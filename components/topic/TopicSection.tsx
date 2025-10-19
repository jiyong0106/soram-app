import React, { useCallback, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import TopicSectionLists from "./TopicSectionLists";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  TopicListType,
  GetTopicListResponse,
  Category,
} from "@/utils/types/topic";
import { getTopicList } from "@/utils/api/topicPageApi";
import LoadingSpinner from "../common/LoadingSpinner";
import { useFocusEffect } from "expo-router";

const TopicSection = ({ category }: { category: Category }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchName, setSearchName] = useState("");
  const isAll = !category || category === "전체";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery<GetTopicListResponse>({
      // 카테고리를 key에 포함해서 탭별 캐시를 분리
      queryKey: ["getTopicListKey", searchName, category],
      queryFn: ({ pageParam }) =>
        getTopicList({
          take: 10,
          cursor: pageParam,
          search: searchName || "",
          category: isAll ? undefined : category,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
      staleTime: 60 * 1000,
    });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // 받은 페이지들을 합치고, 클라이언트에서 카테고리만 필터
  const items: TopicListType[] = data?.pages.flatMap((p) => p.data) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        data={items}
        renderItem={({ item }) => <TopicSectionLists item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15, paddingVertical: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF7D4A"]}
            tintColor="#FF7D4A"
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
      />
    </View>
  );
};

export default TopicSection;

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#fff" },
});
