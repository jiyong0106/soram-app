import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import SwipeActions from "./SwipeActions";
import { SharedValue } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ChatItemType } from "@/utils/types/chat";
import AppText from "../common/AppText";
import ScalePressable from "../common/ScalePressable";
import { useQueryClient } from "@tanstack/react-query";
import { getMessages } from "@/utils/api/chatPageApi";
import { getInitials } from "@/utils/util/uiHelpers";

type ChatItemProps = {
  item: ChatItemType;
};

const ChatItem = ({ item }: ChatItemProps) => {
  const isSwipingRef = useRef(false); // 스와이프 제스처 중/직후 true
  const isOpenRef = useRef(false); // 액션이 열려 있는지 여부(선택)
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, opponent, isLeave, isBlocked, lastMessage } = item;

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
  return (
    <ReanimatedSwipeable
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
      ) => <SwipeActions prog={prog} drag={drag} connectionId={id} />}
    >
      <ScalePressable style={styles.row} onPress={handleRowPress}>
        <View style={styles.avatar}>
          <AppText style={styles.avatarText}>
            {getInitials(opponent?.nickname)}
          </AppText>
        </View>
        <View style={styles.rowTextWrap}>
          <AppText style={styles.rowTitle} numberOfLines={1}>
            {opponent.nickname}
          </AppText>
          <AppText style={styles.rowSubtitle} numberOfLines={1}>
            {isLeave || isBlocked
              ? `${opponent.nickname}님이 방을 나갔어요`
              : lastMessage?.content}
          </AppText>
        </View>
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
    backgroundColor: "#FFE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ff6b6b",
    fontWeight: "800",
  },
  rowTextWrap: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  rowSubtitle: { color: "#8A8F98", fontSize: 12 },
});
