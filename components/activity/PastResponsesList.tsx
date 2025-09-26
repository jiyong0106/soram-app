import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AppText from "../common/AppText";
import ScalePressable from "../common/ScalePressable";
import LoadingSpinner from "../common/LoadingSpinner";
import { getUnlockedResponsesSummary } from "@/utils/api/activityPageApi";
import {
  GetUnlockedSummaryByUserResponse,
  GetUnlockedSummaryByTopicResponse,
  UnlockedSummaryByUserItem,
  UnlockedSummaryByTopicItem,
} from "@/utils/types/activity";

type ViewMode = "user" | "topic";

// --- 상단 토글 버튼 컴포넌트 ---
const ViewModeToggle = ({
  viewMode,
  setViewMode,
}: {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}) => (
  <View style={styles.toggleContainer}>
    <Pressable
      style={[styles.toggleButton, viewMode === "user" && styles.activeButton]}
      onPress={() => setViewMode("user")}
    >
      <AppText
        style={[
          styles.toggleButtonText,
          viewMode === "user" && styles.activeButtonText,
        ]}
      >
        사용자별
      </AppText>
    </Pressable>
    <Pressable
      style={[styles.toggleButton, viewMode === "topic" && styles.activeButton]}
      onPress={() => setViewMode("topic")}
    >
      <AppText
        style={[
          styles.toggleButtonText,
          viewMode === "topic" && styles.activeButtonText,
        ]}
      >
        주제별
      </AppText>
    </Pressable>
  </View>
);

// --- 사용자별 카드 컴포넌트 ---
const UserCard = ({ item }: { item: UnlockedSummaryByUserItem }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: "/activity/user/[authorId]",
      params: { authorId: item.id, nickname: item.nickname },
    });
  };
  return (
    <ScalePressable style={styles.cardContainer} onPress={handlePress}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
        <AppText style={styles.nickname}>{item.nickname}</AppText>
      </View>
      <View style={styles.cardRightContent}>
        <AppText style={styles.countText}>
          {item.unlockedResponsesCount}개
        </AppText>
        <Ionicons name="chevron-forward" size={20} color="#5C4B44" />
      </View>
    </ScalePressable>
  );
};

// --- 주제별 카드 컴포넌트 ---
const TopicCard = ({ item }: { item: UnlockedSummaryByTopicItem }) => {
  const router = useRouter();
  const handlePress = () => console.log(`Maps to topic ${item.id}'s responses`);

  return (
    <ScalePressable style={styles.topicCardContainer} onPress={handlePress}>
      <View style={styles.topicCardHeader}>
        <AppText style={styles.topicCategory}># {item.category}</AppText>
        <Ionicons name="chevron-forward" size={20} color="#B0A6A0" />
      </View>
      <AppText style={styles.topicTitle}>Q. {item.title}</AppText>
      <AppText style={styles.topicCountText}>
        이어 본 이야기 {item.unlockedResponsesCount}개
      </AppText>
    </ScalePressable>
  );
};

// --- 메인 컴포넌트 ---
const PastResponsesList = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("user");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<
    GetUnlockedSummaryByUserResponse | GetUnlockedSummaryByTopicResponse
  >({
    queryKey: ["getUnlockedResponsesSummary", viewMode],
    queryFn: ({ pageParam = 1 }) =>
      getUnlockedResponsesSummary({
        groupBy: viewMode,
        page: pageParam as number,
        limit: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });

  const mappedData = React.useMemo<
    (UnlockedSummaryByUserItem | UnlockedSummaryByTopicItem)[]
  >(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data as any);
  }, [data]);

  const renderItem = ({
    item,
  }: {
    item: UnlockedSummaryByUserItem | UnlockedSummaryByTopicItem;
  }) => {
    if (viewMode === "user") {
      return <UserCard item={item as UnlockedSummaryByUserItem} />;
    } else {
      return <TopicCard item={item as UnlockedSummaryByTopicItem} />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.pageContainer}>
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      {/* 👇 [추가] 토글 버튼 아래에 화면 전체를 가로지르는 선 */}
      <View />
      {mappedData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="eye-off-outline" size={48} color="#EAEAEA" />
          <Text style={styles.emptyText}>
            아직 이어 본 다른 사람의 이야기가 없어요.
          </Text>
          <Text style={styles.emptySubText}>
            마음에 드는 이야기를 발견하고 다시 꺼내보세요!
          </Text>
        </View>
      ) : (
        <FlatList
          data={mappedData}
          renderItem={renderItem}
          keyExtractor={(item) => `${viewMode}-${item.id}`}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10, // 토글과의 간격을 위해 추가
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    marginHorizontal: 16,
    marginTop: 16, // 위쪽 간격
    borderRadius: 10,
    padding: 2,
  },
  // 구분선 스타일
  // divider: {},
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#B0A6A0",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#FF7D4A",
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFD6C9",
    justifyContent: "center",
    alignItems: "center",
  },
  nickname: { fontSize: 14, fontWeight: "bold", color: "#5C4B44" },
  cardRightContent: { flexDirection: "row", alignItems: "center", gap: 4 },
  countText: { fontSize: 12, color: "#B0A6A0" },
  topicCardContainer: {
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    gap: 6,
  },
  topicCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topicCategory: { fontSize: 12, fontWeight: "bold", color: "#B0A6A0" },
  topicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5C4B44",
    lineHeight: 22,
  },
  topicCountText: { fontSize: 13, color: "#B0A6A0", marginTop: 8 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#B0A6A0", marginTop: 16 },
  emptySubText: { fontSize: 14, color: "#D9D9D9", marginTop: 8 },
});

export default PastResponsesList;
