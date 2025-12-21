import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  LayoutRectangle,
  Keyboard,
  InteractionManager,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "@/components/common/PageContainer";
import ChatActionSheet from "@/components/chat/ChatActionSheet";
import { BackButton } from "@/components/common/backbutton";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "@/utils/api/chatPageApi";
import { ChatItemType, ChatMessageType } from "@/utils/types/chat";
import { useChat } from "@/utils/hooks/useChat";
import { IMessage } from "react-native-gifted-chat";
import GiftedChatView from "@/components/chat/GiftedChatView";
import { useChatUnreadStore } from "@/utils/store/useChatUnreadStore";
import { useAuthStore } from "@/utils/store/useAuthStore";
import ChatTriggerBanner from "@/components/chat/ChatTriggerBanner";
import { GetChatResponse } from "@/utils/types/chat";
import { InfiniteData } from "@tanstack/react-query";
import PendingRequestActions from "@/components/chat/PendingRequestActions";
import {
  postConnectionsAccept,
  postConnectionsReject,
} from "@/utils/api/connectionPageApi";
import useAlert from "@/utils/hooks/useAlert";
import ConnectionRequestGuideModal from "@/components/chat/ConnectionRequestGuideModal";
import ReceiverRequestGuideModal from "@/components/chat/ReceiverRequestGuideModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatIdPage = () => {
  const router = useRouter();
  const { showAlert, showActionAlert } = useAlert();
  const {
    id,
    peerUserId,
    peerUserName,
    isLeave,
    isBlocked,
    connectionInfo: connectionInfoParam, // 라우팅으로 전달받은 connection 정보
    // 라우팅 파라미터를 추가로 받습니다.
    isNewRequest,
    topicTitle,
  } = useLocalSearchParams<{
    id: string;
    peerUserId: string;
    peerUserName: string;
    isLeave: string;
    isBlocked: string;
    connectionInfo?: string;
    isNewRequest?: string; // "true" or undefined
    topicTitle?: string;
  }>();
  // 라우트 파라미터 불리언 안전 변환 유틸
  const toBoolParam = (param: string | string[] | undefined): boolean => {
    const raw = Array.isArray(param) ? param[0] : param;
    if (raw == null) return false;
    const v = String(raw).trim().toLowerCase();
    return v === "true" || v === "1" || v === "yes";
  };

  const isLeaveUser = useMemo(() => toBoolParam(isLeave), [isLeave]);
  const isBlockedUser = useMemo(() => toBoolParam(isBlocked), [isBlocked]);
  const roomId = Number(id);
  const blockedId = Number(peerUserId);
  const token = useAuthStore((s) => s.token) ?? "";
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState(false);
  const [localConnectionInfo, setLocalConnectionInfo] =
    useState<ChatItemType | null>(null);

  // 모달의 표시 여부를 관리할 state를 추가
  const [isGuideModalVisible, setGuideModalVisible] = useState(false);
  const [isReceiverGuideVisible, setReceiverGuideVisible] = useState(false);

  // 스포트라이트 효과를 위한 배너 레이아웃 state
  const [bannerLayout, setBannerLayout] = useState<LayoutRectangle | undefined>(
    undefined
  );
  //  bannerWrapper의 ref를 생성
  const bannerRef = useRef<View>(null);

  const actionSheetRef = useRef<any>(null);
  // 한글 주석: 단순/안정 전략 - 키보드 닫고 상호작용 종료 후 시트 오픈
  const openActionSheet = useCallback(() => {
    Keyboard.dismiss();
    InteractionManager.runAfterInteractions(() => {
      actionSheetRef.current?.present?.();
    });
  }, []);

  //  isNewRequest 파라미터에 따라 모달을 띄우는 useEffect를 추가
  useEffect(() => {
    if (isNewRequest === "true") {
      setGuideModalVisible(true);
    }
  }, [isNewRequest]);

  const myUserId = useMemo(() => getUserIdFromJWT(token), [token]);

  // 1) 채팅 목록 캐시에서 현재 채팅방 정보 찾기 (라우팅 파라미터 우선)
  const connectionInfoFromCache = useMemo(() => {
    // 로컬 state를 최우선으로 사용 // 로컬 상태 오버라이드 (수락/거절 시 즉시 UI 반영용)
    if (localConnectionInfo) {
      return localConnectionInfo;
    }

    // 라우팅 시 직접 전달받은 정보가 있으면 최우선으로 사용
    if (connectionInfoParam) {
      try {
        const parsed = JSON.parse(connectionInfoParam);
        return parsed;
      } catch (e) {
        if (__DEV__) console.error("Failed to parse connectionInfo param");
      }
    }

    const chatListData = queryClient.getQueryData<
      InfiniteData<GetChatResponse>
    >(["getChatKey"]);
    if (!chatListData) {
      return null;
    }

    for (const page of chatListData.pages) {
      const found = page.data.find((item: ChatItemType) => item.id === roomId);
      if (found) {
        return found;
      }
    }
    return null;
  }, [queryClient, roomId, connectionInfoParam, localConnectionInfo]); // 2) [제거됨] 캐시에 정보가 없을 경우 API로 직접 조회하는 useQuery 로직 // 3) 최종 connectionInfo 확정 (캐시/파라미터/로컬 state 우선)

  const connectionInfo = connectionInfoFromCache;

  const isPending = connectionInfo?.status === "PENDING";
  const isRequester = connectionInfo?.requesterId === myUserId; // 방 진입/이탈에 따른 읽음 처리(활성 방 추적)

  const { setActiveConnection, resetUnread } = useChatUnreadStore();
  useEffect(() => {
    setActiveConnection(roomId); // 진입 시 해당 방의 배지 제거 (현재 사용자 버킷 기준)
    resetUnread(roomId);
    return () => setActiveConnection(null);
  }, [roomId, setActiveConnection, resetUnread]); // 1) 이전 채팅 이력 (항상 최신 보장: staleTime 0, refetchOnMount always)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["getMessagesKey", roomId],
      queryFn: ({ pageParam }) =>
        getMessages({
          connectionId: roomId,
          cursor: pageParam,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnReconnect: true, // enabled: !isPending, // PENDING 상태에서는 메시지 조회 비활성화
    });
  const historyItems: ChatMessageType[] =
    data?.pages.flatMap((item) => item.data) ?? []; // 2) 실시간 수신
  const {
    messages: realtimeItems,
    sendMessage,
    readUpTo,
    isChatActive,
  } = useChat(token, roomId, myUserId ?? undefined); // 서버 ChatMessageType -> GiftedChat IMessage 매핑
  const mapToIMessage = useCallback(
    (m: ChatMessageType): IMessage => ({
      _id: String(m.id),
      text: m.content ?? "",
      createdAt: new Date(m.createdAt),
      user: {
        _id: m.senderId,
        name: m.sender?.nickname,
      }, // isPending 상태가 true이면, 서버에서 온 isRead 값이 무엇이든 무조건 false로 덮어씁니다. // isPending이 false일 때만 서버에서 온 m.isRead 값을 그대로 사용
      isRead: isPending ? false : m.isRead,
    }), // isPending 값이 변경될 때마다 이 함수가 최신 값을 참조할 수 있도록 // useCallback의 의존성 배열에 isPending을 추가
    [isPending]
  ); // 이전 이력 + 실시간 합치기(중복 제거, 오름차순 정렬)

  const giftedMessages = useMemo(() => {
    const merged = [...historyItems, ...realtimeItems];
    const dedupMap = new Map<number, ChatMessageType>();
    for (const m of merged) dedupMap.set(m.id, m);
    const unique = Array.from(dedupMap.values());
    unique.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return unique.map(mapToIMessage);
  }, [historyItems, realtimeItems, mapToIMessage]); // GiftedChat onSend -> 소켓 전송만 수행(낙관적 추가는 서버 에코로 처리)

  const handleSendGifted = useCallback(
    (newMessages?: IMessage[]) => {
      const t = newMessages?.[0]?.text?.trim();
      if (!t) return;
      sendMessage(t);
    },
    [sendMessage]
  ); // 스크롤 최상단 자동 로드 시 다중 호출 방지용 락

  const loadingEarlierRef = useRef(false);
  const handleLoadEarlier = useCallback(async () => {
    // 이미 로딩 중이면 추가 호출 무시
    if (loadingEarlierRef.current) return;
    loadingEarlierRef.current = true;
    try {
      await fetchNextPage();
    } finally {
      loadingEarlierRef.current = false;
    }
  }, [fetchNextPage]); // 화면에 보이는 메시지가 변경될 때 '읽음' 이벤트를 전송하는 콜백 함수

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: IMessage }> }) => {
      if (!viewableItems || viewableItems.length === 0 || !myUserId) return; // 화면에 보이는 '상대방' 메시지들만 필터링

      const opponentMessages = viewableItems
        .map((viewable) => viewable.item)
        .filter((msg) => msg.user._id !== myUserId);

      if (opponentMessages.length === 0) return; // 상대방 메시지 중 ID가 가장 큰 (가장 최신) 메시지를 찾음

      const lastVisibleOpponentMessage = opponentMessages.reduce(
        (latest, msg) => (Number(msg._id) > Number(latest._id) ? msg : latest)
      ); // 이 메시지까지 읽었다고 서버에 알림 (IMessage의 _id는 string이므로 숫자로 변환)

      readUpTo(Number(lastVisibleOpponentMessage._id));
    },
    [myUserId, readUpTo]
  );

  const handleAccept = () => {
    // 이미 로딩 중이면 중복 실행 방지
    if (actionLoading) return;

    showActionAlert(
      "요청을 수락하시겠어요?", // 확인 메시지
      "수락", // 확인 버튼 텍스트
      async () => {
        // --- 기존 로직 ---
        setActionLoading(true);
        try {
          await postConnectionsAccept({ connectionId: roomId });
          showAlert(
            "요청을 수락했어요!\n\n두 분을 이어준 이야기로 첫마디를 건네면\n\n더욱 자연스러운 대화가 시작될 거예요.☺️"
          );
          if (connectionInfo) {
            setLocalConnectionInfo({
              ...connectionInfo,
              status: "ACCEPTED",
            });
          }
          await queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
          await queryClient.invalidateQueries({
            queryKey: ["getMessagesKey", roomId],
          });
        } catch (e: any) {
          showAlert(e?.response?.data?.message || "오류가 발생했습니다.");
        } finally {
          setActionLoading(false);
        } // --- 기존 로직 끝 ---
      }
    );
  };

  const handleReject = () => {
    // 이미 로딩 중이면 중복 실행 방지
    if (actionLoading) return;

    showActionAlert(
      "거절한 이야기는 다시 확인할 수 없어요.\n\n거절하시겠습니까?", // 확인 메시지 (요청하신 문구)
      "거절", // 확인 버튼 텍스트
      async () => {
        // --- 기존 로직 ---
        setActionLoading(true);
        try {
          await postConnectionsReject({ connectionId: roomId });
          showAlert("대화 요청을 거절했어요.", () => {
            router.back();
          });
          await queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
        } catch (e: any) {
          showAlert(e?.response?.data?.message || "오류가 발생했습니다.");
        } finally {
          setActionLoading(false);
        } // --- 기존 로직 끝 ---
      }
    );
  }; // useEffect 로직 변경: measure() 사용

  useEffect(() => {
    const checkReceiverGuide = async () => {
      // 유효한 connection 정보가 있고,
      // 내가 요청자가 아닐 때 (즉, 수신자일 때)
      if (connectionInfo && isPending && !isRequester) {
        const storageKey = `@viewed_receiver_guide_${roomId}`;
        try {
          const hasViewed = await AsyncStorage.getItem(storageKey);
          if (!hasViewed) {
            // ref.current.measure()를 사용해 절대 좌표를 측정
            //  측정이 완료될 때까지 잠시 대기 (setTimeout)
            setTimeout(() => {
              if (bannerRef.current) {
                bannerRef.current.measure(
                  (x, y, width, height, pageX, pageY) => {
                    // state에 절대 좌표로 저장
                    setBannerLayout({
                      x: pageX,
                      y: pageY,
                      width: width,
                      height: height,
                    }); // 측정이 완료된 후 모달을 띄움
                    setReceiverGuideVisible(true);
                  }
                ); // '봤음'으로 저장 (measure 호출 직후)
                AsyncStorage.setItem(storageKey, "true").catch((e) =>
                  console.error("Failed to set AsyncStorage item")
                );
              } else {
                // 혹시 ref가 준비되지 않았을 경우 (폴백)

                setReceiverGuideVisible(true); // 스포트라이트 없이 그냥 모달 띄우기
                AsyncStorage.setItem(storageKey, "true").catch((e) =>
                  console.error("Failed to set AsyncStorage item")
                );
              }
            }, 100); // 100ms 대기 후 실행
          }
        } catch (e) {
          if (__DEV__) console.error("Failed to access AsyncStorage for guide");
        }
      }
    };

    checkReceiverGuide(); // connectionInfo가 확정된 이후에 이 로직이 실행되어야 함
  }, [connectionInfo, isPending, isRequester, roomId]); // [제거됨] isConnectionInfoLoading 로딩 상태 체크

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: peerUserName,
          headerShown: true,
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity activeOpacity={0.5} onPress={openActionSheet}>
                <Ionicons name="ellipsis-vertical" size={22} />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.chatContainer}>
        <GiftedChatView
          messages={giftedMessages}
          onSend={handleSendGifted}
          currentUser={{ _id: myUserId ?? "me" }}
          opponent={{ id: peerUserId, nickname: peerUserName }}
          onLoadEarlier={handleLoadEarlier}
          canLoadEarlier={!!hasNextPage}
          isLoadingEarlier={!!isFetchingNextPage}
          isLeaveUser={!isChatActive || isLeaveUser}
          isBlockedUser={!isChatActive || isBlockedUser}
          leaveUserName={peerUserName}
          listViewProps={{
            contentContainerStyle: { paddingBottom: 30 },
            onViewableItemsChanged: handleViewableItemsChanged,
            viewabilityConfig: { itemVisiblePercentThreshold: 50 },
          }}
          renderInputToolbar={
            isPending && !isRequester
              ? () => (
                  <PendingRequestActions
                    onAccept={handleAccept}
                    onReject={handleReject}
                    loading={actionLoading}
                  />
                )
              : undefined
          }
        />
        {/* ref를 할당하고 onLayout을 제거 */}
        <View style={styles.bannerWrapper} ref={bannerRef}>
          <ChatTriggerBanner roomId={roomId} />
        </View>
      </View>
      <ChatActionSheet
        ref={actionSheetRef}
        blockedId={blockedId}
        roomId={roomId}
        peerUserName={peerUserName}
      />
      {/* 페이지의 최상단에 모달 컴포넌트를 렌더링 */}
      <ConnectionRequestGuideModal
        isVisible={isGuideModalVisible}
        onClose={() => setGuideModalVisible(false)}
        peerUserName={peerUserName}
        topicTitle={
          Array.isArray(topicTitle) ? topicTitle[0] : topicTitle ?? ""
        }
      />
      {/* [추가] 수신자용 가이드 모달 */}
      <ReceiverRequestGuideModal
        isVisible={isReceiverGuideVisible}
        onClose={() => setReceiverGuideVisible(false)}
        peerUserName={peerUserName} // 측정된 배너 레이아웃을 prop으로 전달
        bannerLayout={bannerLayout}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  centeredInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#5C4B44",
  },
});

export default ChatIdPage;
