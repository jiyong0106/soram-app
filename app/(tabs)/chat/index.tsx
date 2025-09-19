import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import SearchBar from "@/components/chat/SearchBar";
import ChatItem from "@/components/chat/ChatItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getChat } from "@/utils/api/chatPageApi";
import { ChatItemType, GetChatResponse } from "@/utils/types/chat";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AppText from "@/components/common/AppText";

const chatPage = () => {
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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
    staleTime: 60 * 1000,
  });

  const items: ChatItemType[] = data?.pages.flatMap((item) => item.data) ?? [];
  const onRefresh = async () => {
    const now = Date.now();
    if (refreshing) return;
    if (now - dataUpdatedAt < 60_000) return; // 최근 60초 내 데이터면 스킵

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
        <AppText style={styles.title}>채팅</AppText>
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
            colors={["#ff6b6b"]}
            tintColor="#ff6b6b"
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  rowSubtitle: {
    color: "#8A8F98",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
});
