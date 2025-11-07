import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import SearchBar from "@/components/chat/SearchBar";
import ChatItem from "@/components/chat/ChatItem";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getChat } from "@/utils/api/chatPageApi";
import { ChatItemType, GetChatResponse } from "@/utils/types/chat";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AppText from "@/components/common/AppText";
import EmptyState from "@/components/common/EmptyState";
import { useFocusEffect } from "expo-router";
import { useChatUnreadStore } from "@/utils/store/useChatUnreadStore";

const chatPage = () => {
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const qc = useQueryClient();
  const setActiveConnection = useChatUnreadStore((s) => s.setActiveConnection);

  // 화면 포커스 시: 활성 채팅방 해제만 수행(미읽음 카운트 정상화)
  useFocusEffect(
    useCallback(() => {
      setActiveConnection(null);
    }, [setActiveConnection])
  );

  //채팅방 목록 조회
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    dataUpdatedAt,
  } = useInfiniteQuery<GetChatResponse>({
    queryKey: ["getChatKey"],
    queryFn: ({ pageParam }) =>
      getChat({
        take: 10,
        cursor: pageParam,
      }),

    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
    // 한글 주석: 프리패치 후 캐시를 즉시 표시하기 위해 staleTime을 부여하고 mount 재요청은 비활성화
    staleTime: 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
  });
  const items: ChatItemType[] = data?.pages.flatMap((item) => item.data) ?? [];
  const connectionIds = useMemo(() => items.map((i) => i.id), [items]);
  // 한글 주석: 초기 마운트 직후 onEndReached 자동 호출을 방지하기 위한 가드
  const didScrollRef = useRef(false);

  // 한글 주석: 서버 목록 기준으로 배지 스토어 동기화(고아 카운트 정리)
  useEffect(() => {
    const uid = useChatUnreadStore.getState().currentUserId;
    if (uid == null) return;
    if (!data) return; // 캐시 미존재 시 skip

    if (items.length === 0) {
      // 목록이 비면 해당 사용자 배지를 전부 0으로 초기화
      useChatUnreadStore.getState().resetAllForUser(uid);
      return;
    }

    const keep = new Set(items.map((it) => it.id));
    useChatUnreadStore.setState((s) => {
      const perUser = s.unreadCountByUserId[uid] ?? {};
      const pruned = Object.fromEntries(
        Object.entries(perUser).filter(([k]) => keep.has(Number(k)))
      ) as Record<number, number>;
      // 변경 사항이 없으면 그대로 반환
      const changed =
        Object.keys(perUser).length !== Object.keys(pruned).length;
      if (!changed) return s;
      return {
        unreadCountByUserId: { ...s.unreadCountByUserId, [uid]: pruned },
      } as any;
    });
  }, [data, items]);

  // 한글 주석: 실시간 목록 구독은 루트에서 전역으로 수행하므로 이 화면에서는 불필요합니다.
  const onRefresh = async () => {
    const now = Date.now();
    if (refreshing) return;
    // 강제 새로고침: 데이터 업데이트 시각과 무관하게 허용

    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>대화</AppText>
        {/* <SearchBar value={query} onChangeText={setQuery} /> */}
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <ChatItem item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading || isFetching ? (
            <LoadingSpinner />
          ) : (
            <EmptyState title={"아직 진행중인 대화가 없어요"} />
          )
        }
        onMomentumScrollBegin={() => {
          didScrollRef.current = true;
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B3E"]}
            tintColor="#FF6B3E"
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={() => {
          if (!didScrollRef.current) return; // 한글 주석: 사용자 스크롤 발생 전에는 불러오지 않음
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
      />
    </View>
  );
};

export default chatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#5C4B44",
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  empty: {
    textAlign: "center",
    color: "#B0A6A0",
    marginTop: 20,
    fontSize: 16,
  },
});
