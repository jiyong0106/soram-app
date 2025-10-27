import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { BackButton } from "@/components/common/backbutton";
import PageContainer from "@/components/common/PageContainer";
import AppText from "@/components/common/AppText";
import ScalePressable from "@/components/common/ScalePressable";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getUnlockedResponsesByTopic } from "@/utils/api/activityPageApi";
import { MyVoiceResponseItem } from "@/utils/types/activity";

// --- 개별 답변 카드 컴포넌트 ---
const ResponseItemCard = ({ item }: { item: MyVoiceResponseItem }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: "/activity/user/response/[responseId]",
      params: {
        responseId: item.id,
        authorId: item.user?.id,
        authorNickname: item.user?.nickname,
        topicTitle: item.topic.title,
        textContent: item.textContent,
        createdAt: item.createdAt,
        //  connectionStatus를 함께 전달합니다.
        connectionStatus: item.connectionStatus,
      },
    });
  };

  return (
    <ScalePressable style={styles.cardContainer} onPress={handlePress}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color="#FF7D4A" />
          </View>
          <AppText style={styles.cardAuthor}>{item.user?.nickname}</AppText>
          {/*  연결 상태에 따라 뱃지를 표시합니다. */}
          {/* 1. 대화중 */}
          {item.connectionStatus === "ACCEPTED" && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>대화중</AppText>
            </View>
          )}
          {/* 2. 요청 보냄 */}
          {item.connectionStatus === "PENDING" && (
            <View style={[styles.badge, styles.pendingBadge]}>
              <AppText style={styles.badgeText}>요청 보냄</AppText>
            </View>
          )}
          {/* 3. 거절됨 */}
          {item.connectionStatus === "REJECTED" && (
            <View style={[styles.badge, styles.rejectedBadge]}>
              <AppText style={[styles.badgeText, styles.rejectedBadgeText]}>
                거절됨
              </AppText>
            </View>
          )}
          {/* 4. 대화 종료 (LEFT) */}
          {(item.connectionStatus as string) === "LEFT" && (
            <View style={[styles.badge, styles.leftBadge]}>
              <AppText style={[styles.badgeText, styles.leftBadgeText]}>
                대화 종료
              </AppText>
            </View>
          )}
          {/* 4. 대화 요청 가능 */}
          {(item.connectionStatus as string) === null && (
            <View style={[styles.badge]}>
              <AppText style={[styles.badgeText]}>요청 가능</AppText>
            </View>
          )}
        </View>
        <AppText style={styles.cardText} numberOfLines={2}>
          {item.textContent}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#B0A6A0" />
    </ScalePressable>
  );
};

// --- 메인 화면 컴포넌트 ---
const TopicResponsesPage = () => {
  // ... (기존 로직 동일) ...
  const { topicId, title } = useLocalSearchParams<{
    topicId: string;
    title: string;
  }>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getUnlockedResponsesByTopic", topicId],
    queryFn: ({ pageParam }) =>
      getUnlockedResponsesByTopic({
        topicId: Number(topicId),
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? lastPage.meta.endCursor ?? undefined
        : undefined,
    enabled: !!topicId,
  });

  const mappedData = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isError) {
    return (
      <View style={styles.center}>
        <AppText>목록을 불러오지 못했어요.</AppText>
      </View>
    );
  }

  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: title || "주제별 이야기",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <View style={styles.pageContainer}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={mappedData}
            renderItem={({ item }) => <ResponseItemCard item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContentContainer}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.center}>
                <AppText>이 주제로 조회한 이야기가 없어요.</AppText>
              </View>
            }
            ListFooterComponent={
              isFetchingNextPage ? <ActivityIndicator /> : null
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor="#FF7D4A"
              />
            }
          />
        )}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  listContentContainer: {
    padding: 16,
    gap: 12,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    gap: 10,
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF3EC",
    justifyContent: "center",
    alignItems: "center",
  },
  cardAuthor: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5C4B4A",
  },
  cardText: {
    fontSize: 14,
    color: "#8E807A",
    lineHeight: 18,
  },
  //  뱃지 관련 스타일
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: "#FF7D4A",
    borderRadius: 6,
  },
  pendingBadge: {
    backgroundColor: "#AAA",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  rejectedBadge: {
    backgroundColor: "#E0E0E0", // 회색 계열
  },
  rejectedBadgeText: {
    color: "#B0A6A0", // 비활성 텍스트 색상
  },
  leftBadge: {
    backgroundColor: "#E0E0E0", // 회색 계열
  },
  leftBadgeText: {
    color: "#B0A6A0", // 비활성 텍스트 색상
  },
});

export default TopicResponsesPage;
