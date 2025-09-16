import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from "react-native";
import MessageBubble from "./MessageBubble";
import { ChatMessageType } from "@/utils/types/chat";
import LoadingSpinner from "../common/LoadingSpinner";
import { makeMinuteKey } from "@/utils/util/formatKoClock";

type Props = {
  myUserId?: number | null;
  items: ChatMessageType[]; // 과거(페이지네이션)
  live: ChatMessageType[]; // 실시간(소켓)
  hasNextPage?: boolean;
  onLoadMore: () => void;
  paddingBottom: number;
  isFetchingNextPage: boolean;
};

const TH = 40;

const MessageList = ({
  myUserId,
  items,
  live,
  hasNextPage = false,
  onLoadMore,
  isFetchingNextPage,
  paddingBottom,
}: Props) => {
  const flatRef = useRef<FlatList<ChatMessageType>>(null);

  // ---- 병합 & 정렬 ----
  const merged = useMemo(() => {
    const map = new Map<string | number, ChatMessageType>();
    for (const m of items) map.set(m.id ?? `${m.createdAt}-${m.senderId}`, m);
    for (const m of live) map.set(m.id ?? `${m.createdAt}-${m.senderId}`, m);
    return Array.from(map.values());
  }, [items, live]);

  // DESC: 최신→과거
  const desc = useMemo(
    () =>
      merged
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .map((m) => ({ ...m, __minuteKey: makeMinuteKey(m.createdAt) })),
    [merged]
  );
  // ASC: 과거→최신
  const asc = useMemo(() => [...desc].reverse(), [desc]);

  // ---- 레이아웃/콘텐츠 측정 ----
  const [nearBottom, setNearBottom] = useState(true);
  const [layoutH, setLayoutH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const canScroll = contentH > layoutH + 1;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayoutH(e.nativeEvent.layout.height);
  }, []);
  const onContentSizeChange = useCallback((w: number, h: number) => {
    setContentH(h);
  }, []);

  // ---- 모드 결정 ----
  // 기본 규칙: 과거(items) 없고 더 불러올 것도 없으면 Top 모드
  const baseTopMode = items.length === 0 && !hasNextPage;
  // 추가 규칙: 콘텐츠가 화면을 못 채우면(스크롤 불가) 무조건 Top 모드
  const compactTopMode = !canScroll;
  const useTopMode = baseTopMode || compactTopMode;
  const useInverted = !useTopMode;

  const data = useInverted ? desc : asc;

  // ---- 스크롤 처리 ----
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { y } = e.nativeEvent.contentOffset;
      const { height: vh } = e.nativeEvent.layoutMeasurement;
      const { height: ch } = e.nativeEvent.contentSize;

      if (useInverted) {
        setNearBottom(y <= TH);
      } else {
        setNearBottom(y + vh >= ch - TH);
        if (hasNextPage && y <= TH) onLoadMore();
      }
    },
    [useInverted, hasNextPage, onLoadMore]
  );

  // 새 메시지 자동 붙이기
  useEffect(() => {
    if (!nearBottom) return;

    if (useInverted) {
      flatRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } else {
      if (canScroll) {
        flatRef.current?.scrollToEnd({ animated: true });
      }
    }
  }, [live.length, nearBottom, useInverted, canScroll]);

  return (
    <FlatList
      ref={flatRef}
      data={data}
      inverted={useInverted}
      keyExtractor={(m, i) => String((m as any).id ?? i)}
      renderItem={({ item, index }) => {
        const senderId = (item as any).senderId ?? (item as any).sender?.id;
        const isMine = myUserId != null && senderId === myUserId;

        const prev = data[index - 1] as any;
        const sameMinute =
          prev && prev.__minuteKey === (item as any).__minuteKey;
        const sameAuthor =
          prev &&
          ((prev as any).senderId ?? (prev as any).sender?.id) === senderId;

        const showTime = !(sameMinute && sameAuthor);

        return (
          <MessageBubble item={item} isMine={isMine} showTime={showTime} />
        );
      }}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      onScroll={onScroll}
      scrollEventThrottle={16}
      onEndReachedThreshold={0.1}
      onEndReached={useInverted ? onLoadMore : undefined}
      ListFooterComponent={
        useInverted && isFetchingNextPage ? <LoadingSpinner /> : null
      }
      ListHeaderComponent={
        !useInverted && isFetchingNextPage ? <LoadingSpinner /> : null
      }
      contentContainerStyle={{
        paddingHorizontal: 15,
        ...(useInverted
          ? { paddingTop: paddingBottom + 10, paddingBottom: 10 }
          : { paddingTop: 10, paddingBottom: paddingBottom + 10 }),
        gap: 6,
      }}
      maintainVisibleContentPosition={
        useInverted
          ? { minIndexForVisible: 1, autoscrollToTopThreshold: 20 }
          : undefined
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MessageList;
