import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Swipeable } from "react-native-gesture-handler";
import SwipeActions from "./SwipeActions";
import { SharedValue } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ChatItemType } from "@/utils/types/chat";
import AppText from "../common/AppText";
import ScalePressable from "../common/ScalePressable";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { getMessages } from "@/utils/api/chatPageApi";
import { useChatUnreadStore } from "@/utils/store/useChatUnreadStore";
import { Ionicons } from "@expo/vector-icons"; // 이미 임포트되어 있습니다.
import { useAuthStore } from "@/utils/store/useAuthStore";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT";
import { GetChatResponse } from "@/utils/types/chat";

type ChatItemProps = {
  item: ChatItemType;
};

const ChatItem = ({ item }: ChatItemProps) => {
  const isSwipingRef = useRef(false); // 스와이프 제스처 중/직후 true
  const isOpenRef = useRef(false); // 액션이 열려 있는지 여부(선택)
  const swipeableRef = useRef<Swipeable>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // isMuted를 구조분해합니다.
  const {
    id,
    opponent,
    isLeave,
    isBlocked,
    lastMessage,
    status,
    requesterId,
    isMuted, // 알림 끄기 상태
  } = item;

  const unread = useChatUnreadStore((s) => {
    const uid = s.currentUserId;
    const perUser = uid != null ? s.unreadCountByUserId[uid] ?? {} : {};
    return perUser[id] ?? 0;
  });

  const token = useAuthStore((s) => s.token);
  const myId = getUserIdFromJWT(token);

  const subtitleInfo = useMemo(() => {
    // PENDING 상태를 최우선으로 처리
    if (status === "PENDING") {
      if (myId === requesterId) {
        return {
          text: `👋 ${opponent.nickname}님의 응답을 기다리고 있어요.`,
          isHighlight: false,
        };
      } else {
        return {
          text: `💌 대화 요청이 도착했어요!`,
          isHighlight: true,
        };
      }
    }

    // 그 외 상태(ACCEPTED 등)일 경우
    if (isLeave || isBlocked) {
      return {
        text: `⛓️‍💥종료된 대화입니다`,
        isHighlight: false,
      };
    }

    // 정상적인 대화 상태
    return { text: lastMessage?.content, isHighlight: false };
  }, [status, myId, requesterId, isLeave, isBlocked, lastMessage, opponent]);

  // 스와이프 직후 잠깐(예: 150ms) 탭 무시
  const blockTapBriefly = () => {
    isSwipingRef.current = true;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 150);
  };

  const handleRowPress = async () => {
    if (isSwipingRef.current || isOpenRef.current) return; // 스와이프 중/열려있으면 무시

    // 1) 채팅방 입장 전 메시지 1페이지 프리페치(최대 250ms만 대기)
    try {
      const prefetch = queryClient.prefetchInfiniteQuery({
        queryKey: ["getMessagesKey", id],
        queryFn: ({ pageParam }) =>
          getMessages({ connectionId: id, cursor: pageParam }),
        initialPageParam: undefined as number | undefined,
        staleTime: 60 * 1000,
      });
      const timeout = new Promise((resolve) => setTimeout(resolve, 250));
      await Promise.race([prefetch, timeout]);
    } catch {}

    // 2) 라우팅 진행(프리페치가 끝났다면 즉시 캐시 사용, 아니라도 백그라운드에서 이어짐)
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: String(id),
        peerUserId: opponent.id,
        peerUserName: opponent.nickname,
        isLeave: String(isLeave),
        isBlocked: String(isBlocked),
      },
    });
  };

  const handleActionComplete = () => {
    setTimeout(() => {
      swipeableRef.current?.close();
    }, 250);
  };

  const handleAvatarPress = useCallback(() => {
    router.push({
      pathname: "/profile/[userId]",
      params: { userId: String(opponent.id), nickname: opponent.nickname },
    });
  }, [opponent.id, opponent.nickname]);

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      overshootRight={false}
      // 스와이프 시작/닫힘 제스처 중엔 탭 블록
      onSwipeableWillOpen={blockTapBriefly}
      onSwipeableWillClose={blockTapBriefly}
      // // 열림 상태 추적(원하면 탭 막기용)
      onSwipeableOpen={() => {
        isOpenRef.current = true;
      }}
      onSwipeableClose={() => {
        isOpenRef.current = false;
      }}
      renderRightActions={(
        prog: SharedValue<number>,
        drag: SharedValue<number>
      ) => (
        <SwipeActions
          prog={prog}
          drag={drag}
          connectionId={id}
          isMuted={item.isMuted}
          onActionComplete={handleActionComplete}
        />
      )}
    >
      <ScalePressable style={styles.row} onPress={handleRowPress}>
        <TouchableOpacity
          style={styles.avatar}
          onPress={handleAvatarPress}
          activeOpacity={0.2}
        >
          <Ionicons name="person" size={18} color="#fff" activeOpacity={0.7} />
        </TouchableOpacity>
        <View style={styles.rowTextWrap}>
          {/* 닉네임과 아이콘을 묶는 View 추가 */}
          <View style={styles.titleContainer}>
            <AppText style={styles.rowTitle} numberOfLines={1}>
              {opponent.nickname}
            </AppText>
            {/* isMuted가 true일 때 아이콘 렌더링 */}
            {isMuted && (
              <Ionicons
                name="notifications-off"
                size={14}
                color="#B0A6A0" // rowSubtitle과 동일한 회색
                style={styles.muteIcon}
              />
            )}
          </View>
          <AppText
            style={[
              styles.rowSubtitle,
              subtitleInfo.isHighlight && styles.highlight,
            ]}
            numberOfLines={1}
          >
            {subtitleInfo.text}
          </AppText>
        </View>
        {unread > 0 && status !== "PENDING" && (
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>
              {unread > 99 ? "99+" : unread}
            </AppText>
          </View>
        )}
      </ScalePressable>
    </ReanimatedSwipeable>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD6C9",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextWrap: { flex: 1, overflow: "hidden" }, // overflow: "hidden" 추가 (안정성)
  //  닉네임 + 아이콘 래퍼
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // 기존 rowTitle의 여백
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5C4B44",
    // 긴 닉네임이 아이콘을 밀어내지 않도록 flexShrink
    flexShrink: 1,
    // marginBottom: 4, // -> titleContainer로 이동
  },
  //  알림 끄기 아이콘 스타일
  muteIcon: {
    marginLeft: 4,
    flexShrink: 0, // 아이콘은 줄어들지 않도록
  },
  rowSubtitle: { color: "#B0A6A0", fontSize: 12 },
  highlight: {
    color: "#FF7D4A",
    fontWeight: "bold",
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
});
