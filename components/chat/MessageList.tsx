import React, { useEffect, useMemo, useRef } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import MessageBubble from "./MessageBubble";
import { ChatMessageType } from "@/utils/types/chat";
import LoadingSpinner from "../common/LoadingSpinner";

type Props = {
  myUserId?: number | null;
  items: ChatMessageType[];
  live: ChatMessageType[];
  onLoadMore: () => void; // 이전 페이지 가져오기
  paddingBottom: number;

  isFetchingNextPage: boolean;
};

export default function MessageList({
  myUserId,
  items,
  live,
  onLoadMore,
  isFetchingNextPage,
  paddingBottom,
}: Props) {
  const flatRef = useRef<FlatList<ChatMessageType>>(null);

  // 히스토리(과거) + 라이브(최근) 병합 → id 기준 중복 제거 → createdAt ASC
  // const data = useMemo(() => {
  //   const map = new Map<string | number, ChatMessageType>();
  //   [...items, ...live].forEach((m) =>
  //     map.set(m.id ?? `${m.createdAt}-${m.senderId}`, m)
  //   );
  //   return Array.from(map.values()).sort(
  //     (a, b) =>
  //       new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //   );
  // }, [items, live]);

  // 새 메시지 오면 하단으로 스크롤(리스트는 inverted=true라 scrollToOffset(0)이 하단)
  useEffect(() => {
    flatRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [live.length]);

  return (
    <FlatList
      ref={flatRef}
      data={items}
      inverted={true}
      keyExtractor={(m, i) => String(m.id ?? i)}
      renderItem={({ item }) => {
        const sender = (item as any).senderId ?? (item as any).sender?.id;
        const isMine = myUserId != null && sender === myUserId;
        return <MessageBubble item={item} isMine={isMine} />;
      }}
      onEndReachedThreshold={0.1}
      onEndReached={() => onLoadMore()}
      ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom,
        gap: 6,
      }}
      maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    />
  );
}
