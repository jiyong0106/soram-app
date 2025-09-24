import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native"; // ❗️ Text, View 추가
import { useInfiniteQuery } from "@tanstack/react-query";

import { getMyVoiceResponses } from "@/utils/api/profilePageApi";
import {
  GetMyVoiceResponsesResponse,
  MyVoiceResponseItem,
} from "@/utils/types/profile";

import MyResponseCard from "@/components/profile/MyResponseCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { create } from "domain";

const MyResponseList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<GetMyVoiceResponsesResponse>({
    queryKey: ["getMyVoiceResponses"],
    queryFn: ({ pageParam }) =>
      getMyVoiceResponses({ cursor: pageParam as number | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
  });

  const mappedData = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) =>
      page.data.map((item: MyVoiceResponseItem) => ({
        id: item.id,
        title: item.topic.title,
        category: item.topic.category,
        textContent: item.textContent,
        createdAt: item.createdAt,
      }))
    );
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (mappedData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 작성한 이야기가 없어요.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mappedData}
      renderItem={({ item }) => <MyResponseCard item={item} />}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refetch}
          tintColor="#FF7D4A"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    gap: 12,
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#B0A6A0",
  },
});

export default MyResponseList;
