// 원본
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";
// import {
//   FlatList,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
// } from "react-native";
// import MessageBubble from "./MessageBubble";
// import { ChatMessageType } from "@/utils/types/chat";
// import LoadingSpinner from "../common/LoadingSpinner";
// import { makeMinuteKey } from "@/utils/util/formatKoClock";

// type Props = {
//   myUserId?: number | null;
//   items: ChatMessageType[]; // 과거(페이지네이션)
//   live: ChatMessageType[]; // 실시간(소켓)
//   onLoadMore: () => void; // 이전 페이지 로드
//   paddingBottom: number;
//   isFetchingNextPage: boolean;
// };

// const MessageList = ({
//   myUserId,
//   items,
//   live,
//   onLoadMore,
//   isFetchingNextPage,
//   paddingBottom,
// }: Props) => {
//   const flatRef = useRef<FlatList<ChatMessageType>>(null);

//   // 1) 과거 + 실시간 병합, id 기준 중복 제거 → 최신→과거(DESC)
//   const dataDesc = useMemo(() => {
//     const map = new Map<string | number, ChatMessageType>();
//     for (const m of items) map.set(m.id ?? `${m.createdAt}-${m.senderId}`, m);
//     for (const m of live) map.set(m.id ?? `${m.createdAt}-${m.senderId}`, m);
//     const arr = Array.from(map.values()).sort(
//       (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
//     );
//     // 분 키 미리 캐시
//     return arr.map((m) => ({ ...m, __minuteKey: makeMinuteKey(m.createdAt) }));
//   }, [items, live]);

//   // 2) 사용자가 하단(= inverted 기준 top) 근처인지 추적해서, 라이브가 올 때만 자동 붙이기
//   //    inverted=true에서 "하단"은 offset=0 근처
//   const [nearBottom, setNearBottom] = useState(true);
//   const BOTTOM_THRESHOLD = 40; // px: 하단 근처로 판단하는 임계값

//   const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const y = e.nativeEvent.contentOffset.y;
//     setNearBottom(y <= BOTTOM_THRESHOLD); // 0에 가까우면 하단 부근
//   }, []);

//   // 새 메시지(live) 길이가 늘었을 때만, 그리고 하단 근처일 때만 자동 스크롤
//   useEffect(() => {
//     if (nearBottom) {
//       flatRef.current?.scrollToOffset({ animated: true, offset: 0 });
//     }
//   }, [live.length, nearBottom]);

//   return (
//     <FlatList
//       ref={flatRef}
//       data={dataDesc} // 최신 → 과거
//       inverted={true} // 최신이 시각적 하단에 보이도록
//       keyExtractor={(m, i) => String(m.id ?? i)}
//       renderItem={({ item, index }) => {
//         const senderId = (item as any).senderId ?? (item as any).sender?.id;

//         const isMine = myUserId != null && senderId === myUserId;

//         const prev = dataDesc[index - 1];
//         const sameMinute = prev && prev.__minuteKey === item.__minuteKey;
//         const sameAuthor =
//           prev &&
//           ((prev as any).senderId ?? (prev as any).sender?.id) === senderId;

//         // 같은 보낸 사람 & 같은 분이면 시간 숨김
//         const showTime = !(sameMinute && sameAuthor);

//         return (
//           <MessageBubble
//             item={item}
//             isMine={isMine}
//             showTime={showTime} // ✅ MessageBubble에 전달
//           />
//         );
//       }}
//       onScroll={onScroll}
//       scrollEventThrottle={16}
//       onEndReachedThreshold={0.1}
//       onEndReached={onLoadMore} // 위로 도달 시 이전페이지 로드
//       ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
//       contentContainerStyle={{
//         paddingHorizontal: 15,
//         paddingTop: paddingBottom + 10,
//         paddingBottom: 10,
//         gap: 6,
//       }}
//       // 하단 붙어있을 땐 새 메시지 오면 자동 정렬, 위로 읽는 중엔 점프 방지
//       maintainVisibleContentPosition={{
//         minIndexForVisible: 1,
//         autoscrollToTopThreshold: 20,
//       }}
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//     />
//   );
// };
// export default MessageList;

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

  const desc = useMemo(
    () =>
      merged
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .map((m) => ({ ...m, __minuteKey: makeMinuteKey(m.createdAt) })),
    [merged]
  );
  const asc = useMemo(() => [...desc].reverse(), [desc]);

  // ---- 모드: 빈 방이면 Top 모드(위에서부터), 아니면 inverted ----
  const isTopMode = items.length === 0;
  const useInverted = !isTopMode;
  const data = useInverted ? desc : asc;

  // ---- 스크롤 상태 추적 ----
  const [nearBottom, setNearBottom] = useState(true);
  const [layoutH, setLayoutH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const canScroll = contentH > layoutH + 1; // 스크롤 가능한지

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayoutH(e.nativeEvent.layout.height);
  }, []);
  const onContentSizeChange = useCallback((w: number, h: number) => {
    setContentH(h);
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { y } = e.nativeEvent.contentOffset;
      const { height: vh } = e.nativeEvent.layoutMeasurement;
      const { height: ch } = e.nativeEvent.contentSize;

      if (useInverted) {
        // inverted: 하단 = offset 0
        setNearBottom(y <= TH);
      } else {
        // Top 모드: 하단 = 리스트 끝
        setNearBottom(y + vh >= ch - TH);

        // Top 모드에서 위로 당겨 과거 불러오기
        if (hasNextPage && y <= TH) onLoadMore();
      }
    },
    [useInverted, hasNextPage, onLoadMore]
  );

  // ---- 새 메시지 자동 붙이기 ----
  useEffect(() => {
    if (!nearBottom) return;

    if (useInverted) {
      // 일반 채팅 UX: 최신이 아래(시각적 하단) → offset 0
      flatRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } else {
      // Top 모드: **스크롤 가능할 때만** 바닥으로 붙임
      if (canScroll) {
        flatRef.current?.scrollToEnd({ animated: true });
      }
      // 스크롤 불가(컨텐츠가 화면보다 작음)면 아무것도 하지 않음 → 위쪽에 고정
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
