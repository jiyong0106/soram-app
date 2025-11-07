import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { getUnlockedResponsesByUser } from "@/utils/api/activityPageApi";
import {
  GetMyVoiceResponsesResponse,
  MyVoiceResponseItem,
} from "@/utils/types/activity";

import MyResponseCard from "@/components/activity/MyResponseCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface PastResponsesUserListProps {
  authorId: number;
}

const PastResponsesUserList = ({ authorId }: PastResponsesUserListProps) => {
  const router = useRouter(); // router 훅 사용

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<GetMyVoiceResponsesResponse>({
    queryKey: ["getUnlockedResponsesByUser", authorId],
    queryFn: ({ pageParam }) =>
      getUnlockedResponsesByUser({
        authorId: authorId,
        cursor: pageParam as number | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
    enabled: !!authorId,
  });

  // ---  1] ---
  // topic 객체를 해체하지 않고 그대로 전달하여 id, title, category 모두를 포함시킵니다.
  const mappedData = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) =>
      page.data.map((item: MyVoiceResponseItem) => ({
        id: item.id,
        topic: item.topic, // topic 객체 전체를 전달합니다.
        textContent: item.textContent,
        createdAt: item.createdAt,
        author: item.user,
        connectionStatus: item.connectionStatus,
      }))
    );
  }, [data]);

  // 카드 클릭 시 상세 페이지로 이동하는 핸들러
  const handleCardPress = (item: (typeof mappedData)[0]) => {
    if (!item.author) {
      console.error("Author information is missing.");
      // TODO: 사용자에게 에러 알림 표시
      return;
    }
    // API 응답의 meta 객체가 아닌, 클릭된 'item'에서 connectionStatus 값을 가져옵니다.
    const connectionStatus = item.connectionStatus || null;

    // mappedData의 구조가 변경되었으므로, params를 올바른 경로에서 가져옵니다.
    router.push({
      pathname: "/activity/user/response/[responseId]",
      params: {
        responseId: item.id,
        authorId: item.author.id,
        authorNickname: item.author.nickname,
        topicTitle: item.topic.title, // item.title -> item.topic.title
        topicCategory: item.topic.category, // item.category -> item.topic.category
        topicBoxId: item.topic.id, // 이제 item.topic.id 로 정상 접근 가능합니다.
        textContent: item.textContent,
        createdAt: item.createdAt,
        connectionStatus: connectionStatus,
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (mappedData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 확인한 이야기가 없어요</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mappedData}
      // MyResponseCard 컴포넌트는 이제 item.topic.title 등을 사용해야 합니다.
      // (MyResponseCard 내부 코드도 이 구조에 맞게 필요할 수 있습니다.)
      renderItem={({ item }) => {
        // MyResponseCard에 전달할 props를 재구성합니다.
        const cardItem = {
          id: item.id,
          title: item.topic.title,
          category: item.topic.category,
          textContent: item.textContent,
          createdAt: item.createdAt,
          author: item.author,
        };
        return (
          <MyResponseCard
            item={cardItem}
            onPress={() => handleCardPress(item)}
          />
        );
      }}
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

export default PastResponsesUserList;
