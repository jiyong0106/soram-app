import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import SearchBar from "@/components/chat/SearchBar";
import ChatItem from "@/components/chat/ChatItem";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getChat } from "@/utils/api/chatPageApi";
import { ChatItemType, GetChatResponse } from "@/utils/types/chat";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AppText from "@/components/common/AppText";
import { useFocusEffect } from "expo-router";
import { getAuthToken } from "@/utils/util/auth";
import { useChatListRealtime } from "@/utils/hooks/useChatListRealtime";

const chatPage = () => {
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const qc = useQueryClient();

  // 화면 포커스 시 최신화 보장
  useFocusEffect(
    useCallback(() => {
      qc.invalidateQueries({ queryKey: ["getChatKey"] });
    }, [qc])
  );

  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
  const items: ChatItemType[] = data?.pages.flatMap((item) => item.data) ?? [];
  const connectionIds = useMemo(() => items.map((i) => i.id), [items]);

  // 실시간 목록 갱신: 소켓으로 newMessage 수신 시 캐시 업데이트
  const jwt = getAuthToken() ?? "";
  useChatListRealtime(jwt);
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
        <SearchBar value={query} onChangeText={setQuery} />
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <ChatItem item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<AppText style={styles.empty}>메세지 없음</AppText>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B3E"]}
            tintColor="#FF6B3E"
          />
        }
        onEndReached={() => {
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
