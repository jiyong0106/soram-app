import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PageContainer from "@/components/common/PageContainer";
import ChatActionSheet from "@/components/chat/ChatActionSheet";
import { BackButton } from "@/components/common/backbutton";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "@/utils/api/chatPageApi";
import { ChatMessageType } from "@/utils/types/chat";
import { useChat } from "@/utils/hooks/useChat";
import { IMessage } from "react-native-gifted-chat";
import GiftedChatView from "@/components/chat/GiftedChatView";
import { useChatUnreadStore } from "@/utils/store/useChatUnreadStore";
import { useAuthStore } from "@/utils/store/useAuthStore";
import ChatTriggerBanner from "@/components/chat/ChatTriggerBanner";

const ChatIdPage = () => {
  const { id, peerUserId, peerUserName, isLeave, isBlocked } =
    useLocalSearchParams<{
      id: string;
      peerUserId: string;
      peerUserName: string;
      isLeave: string;
      isBlocked: string;
    }>();
  //  라우트 파라미터 불리언 안전 변환 유틸
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

  const actionSheetRef = useRef<any>(null);

  const myUserId = useMemo(() => getUserIdFromJWT(token), [token]);

  // 방 진입/이탈에 따른 읽음 처리(활성 방 추적)
  const { setActiveConnection, resetUnread } = useChatUnreadStore();
  useEffect(() => {
    setActiveConnection(roomId);
    // 진입 시 해당 방의 배지 제거
    resetUnread(roomId);
    return () => setActiveConnection(null);
  }, [roomId, setActiveConnection, resetUnread]);

  // 1) 이전 채팅 이력 (항상 최신 보장: staleTime 0, refetchOnMount always)
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
      refetchOnReconnect: true,
    });
  const historyItems: ChatMessageType[] =
    data?.pages.flatMap((item) => item.data) ?? [];

  // 2) 실시간 수신
  const { messages: realtimeItems, sendMessage } = useChat(token, roomId);

  // 서버 ChatMessageType -> GiftedChat IMessage 매핑
  const mapToIMessage = useCallback(
    (m: ChatMessageType): IMessage => ({
      _id: String(m.id),
      text: m.content ?? "",
      createdAt: new Date(m.createdAt),
      user: {
        _id: m.senderId,
        name: m.sender?.nickname,
      },
    }),
    []
  );

  // 이전 이력 + 실시간 합치기(중복 제거, 오름차순 정렬)
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
  }, [historyItems, realtimeItems, mapToIMessage]);

  // GiftedChat onSend -> 소켓 전송만 수행(낙관적 추가는 서버 에코로 처리)
  const handleSendGifted = useCallback(
    (newMessages?: IMessage[]) => {
      const t = newMessages?.[0]?.text?.trim();
      if (!t) return;
      sendMessage(t);
    },
    [sendMessage]
  );

  // 스크롤 최상단 자동 로드 시 다중 호출 방지용 락
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
  }, [fetchNextPage]);

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: peerUserName,
          headerShown: true,
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => actionSheetRef.current?.present?.()}
              >
                <Ionicons name="ellipsis-vertical" size={22} />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => <BackButton />,
        }}
      />

      {/* 변경점: ChatTriggerBanner와 GiftedChatView를 새로운 View로 감싸 레이아웃을 제어합니다. */}
      <View style={styles.chatContainer}>
        <GiftedChatView
          messages={giftedMessages}
          onSend={handleSendGifted}
          currentUser={{ _id: myUserId ?? "me" }}
          onLoadEarlier={handleLoadEarlier}
          canLoadEarlier={!!hasNextPage}
          isLoadingEarlier={!!isFetchingNextPage}
          isLeaveUser={isLeaveUser}
          isBlockedUser={isBlockedUser}
          leaveUserName={peerUserName}
          // 배너에 가려지는 첫 메시지를 위해 상단에 패딩 추가
          listViewProps={{
            contentContainerStyle: {
              paddingBottom: 30, // 배너 높이만큼 여백 확보
            },
          }}
        />

        {/* 배너를 절대 위치를 가진 View로 감싸 화면 위에 띄웁니다. */}
        <View style={styles.bannerWrapper}>
          <ChatTriggerBanner roomId={roomId} />
        </View>
      </View>

      <ChatActionSheet
        ref={actionSheetRef}
        blockedId={blockedId}
        roomId={roomId}
        peerUserName={peerUserName}
      />
    </PageContainer>
  );
};

// 레이아웃을 위한 스타일 객체 추가
const styles = StyleSheet.create({
  chatContainer: {
    flex: 1, // 헤더를 제외한 모든 영역을 차지하도록 설정
    backgroundColor: "#fff", // 채팅방 배경색 예시 (필요에 따라 수정)
  },
  bannerWrapper: {
    position: "absolute", // 부모(chatContainer)를 기준으로 절대 위치 설정
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // 다른 요소들보다 위에 보이도록 설정
  },
});

export default ChatIdPage;
