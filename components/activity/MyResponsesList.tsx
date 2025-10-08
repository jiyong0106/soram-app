import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getMyVoiceResponses } from "@/utils/api/profilePageApi";
import {
  GetMyVoiceResponsesResponse,
  MyVoiceResponseItem,
} from "@/utils/types/profile";

import MyResponseCard from "@/components/activity/MyResponseCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// [수정] useRouter와 useFocusEffect를 expo-router에서 가져옵니다.
import { useRouter, useFocusEffect } from "expo-router";

const MyResponsesList = () => {
  const router = useRouter();
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

  // [수정] 화면이 포커스될 때마다 데이터를 다시 불러오는 로직을 추가합니다.
  useFocusEffect(
    React.useCallback(() => {
      // 컴포넌트가 화면에 나타날 때 refetch 함수를 호출합니다.
      refetch();
    }, [refetch])
  );

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
      renderItem={({ item }) => (
        <MyResponseCard
          item={item}
          onPress={() =>
            router.push({
              pathname: `/activity/[id]`,
              params: { id: item.id },
            })
          }
        />
      )}
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
    backgroundColor: "#fff",
    gap: 12,
    paddingVertical: 10,
    paddingBottom: 100,
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

export default MyResponsesList;
