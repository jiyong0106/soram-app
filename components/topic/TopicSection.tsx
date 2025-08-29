import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import TopicSectionLists from "./TopicSectionLists";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TopicListType, GetTopicListResponse } from "@/utils/types/topic";
import { getTopicListType } from "@/utils/api/topicPageApi";
import LoadingSpinner from "../common/LoadingSpinner";

const TopicSection = () => {
  //새로고침 스테이트
  const [refreshing, setRefreshing] = useState(false);
  //검색
  const [searchName, setSearchName] = useState("");

  //쿼리요청
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery<GetTopicListResponse>({
    queryKey: ["getTopicListKey", searchName],
    queryFn: ({ pageParam }) =>
      getTopicListType({
        take: 10,
        cursor: pageParam,
        search: searchName || "",
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
  });

  const items: TopicListType[] = data?.pages.flatMap((item) => item.data) ?? [];

  const onRefresh = async () => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
    });
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

export default TopicSection;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
  },
});
