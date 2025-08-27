import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import AnswerRecommendLists from "./AnswerRecommendLists";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AnswerRecommend,
  GetAnswerRecommendResponse,
} from "@/utils/types/topic";
import { getAnswerRecommend } from "@/utils/api/topicPageApi";
import LoadingSpinner from "../common/LoadingSpinner";

const AnswerRecommendTab = () => {
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
  } = useInfiniteQuery<GetAnswerRecommendResponse>({
    queryKey: ["getAnswerRecommendKey", searchName],
    queryFn: ({ pageParam }) =>
      getAnswerRecommend({
        take: 10,
        cursor: pageParam,
        search: searchName || "",
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
  });

  const items: AnswerRecommend[] =
    data?.pages.flatMap((item) => item.data) ?? [];

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
        renderItem={({ item }) => <AnswerRecommendLists item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
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

export default AnswerRecommendTab;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  text: {
    fontSize: 14,
  },
});
