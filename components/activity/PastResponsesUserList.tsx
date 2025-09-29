import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router"; // useRouter import 추가

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

  // --- [수정 1] ---
  // API 응답 데이터에 포함된 작성자 정보(user)를 mappedData에 포함시킵니다.
  const mappedData = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) =>
      page.data.map((item: MyVoiceResponseItem) => ({
        // MyVoiceResponseItem 타입에는 user가 없지만, 실제 API 응답에는 포함되어 있습니다.
        // 따라서 item as any로 임시 처리하고, user 정보를 명시적으로 추가합니다.
        id: item.id,
        title: item.topic.title,
        category: item.topic.category,
        textContent: item.textContent,
        createdAt: item.createdAt,
        author: (item as any).user, // 작성자 정보 추가
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

    router.push({
      pathname: "/activity/user/response/[responseId]", // 새로 만들 상세 페이지 경로
      params: {
        responseId: item.id,
        authorId: item.author.id,
        authorNickname: item.author.nickname,
        topicTitle: item.title,
        topicCategory: item.category,
        textContent: item.textContent,
        createdAt: item.createdAt,
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
      // --- [수정 3] ---
      // renderItem에서 onPress 핸들러를 연결합니다.
      renderItem={({ item }) => (
        <MyResponseCard item={item} onPress={() => handleCardPress(item)} />
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
