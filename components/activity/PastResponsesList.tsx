import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppText from "../common/AppText";
import ScalePressable from "../common/ScalePressable";
import LoadingSpinner from "../common/LoadingSpinner";

// --- 임시 데이터 (API 연동 후 삭제) ---
const DUMMY_USER_DATA = [
  {
    user: { id: 1, nickname: "감성적인 고양이" },
    unlockedResponsesCount: 3,
  },
  {
    user: { id: 2, nickname: "보리" },
    unlockedResponsesCount: 1,
  },
  {
    user: { id: 3, nickname: "겨울잠 자는 곰" },
    unlockedResponsesCount: 5,
  },
];

const DUMMY_TOPIC_DATA = [
  {
    topic: {
      id: 101,
      category: "생각",
      title: "인생의 가치관",
    },
    unlockedResponsesCount: 2,
  },
  {
    topic: {
      id: 102,
      category: "여행",
      title: "혼자 떠난 여행",
    },
    unlockedResponsesCount: 4,
  },
];
// --- 임시 데이터 끝 ---

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
const UserCard = ({ item }: { item: (typeof DUMMY_USER_DATA)[0] }) => {
  const router = useRouter();
  const { user, unlockedResponsesCount } = item;

  const handlePress = () => console.log(`Maps to user ${user.id}'s responses`);

  return (
    <ScalePressable style={styles.cardContainer} onPress={handlePress}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
        <AppText style={styles.nickname}>{user.nickname}</AppText>
      </View>
      <View style={styles.cardRightContent}>
        <AppText style={styles.countText}>
          이어 본 이야기 {unlockedResponsesCount}개
        </AppText>
        <Ionicons name="chevron-forward" size={20} color="#D9D9D9" />
      </View>
    </ScalePressable>
  );
};

// --- 주제별 카드 컴포넌트 ---
const TopicCard = ({ item }: { item: (typeof DUMMY_TOPIC_DATA)[0] }) => {
  const router = useRouter();
  const { topic, unlockedResponsesCount } = item;

  const handlePress = () =>
    console.log(`Maps to topic ${topic.id}'s responses`);

  return (
    <ScalePressable style={styles.topicCardContainer} onPress={handlePress}>
      <View style={styles.topicCardHeader}>
        <AppText style={styles.topicCategory}># {topic.category}</AppText>
        <Ionicons name="chevron-forward" size={20} color="#B0A6A0" />
      </View>
      <AppText style={styles.topicTitle}>Q. {topic.title}</AppText>
      <AppText style={styles.topicCountText}>
        이어 본 이야기 {unlockedResponsesCount}개
      </AppText>
    </ScalePressable>
  );
};

// --- 메인 컴포넌트 ---
const PastResponsesList = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("user");

  // TODO: useInfiniteQuery를 사용한 실제 API 연동 로직 추가
  const isLoading = false;
  const userData = DUMMY_USER_DATA;
  const topicData = DUMMY_TOPIC_DATA;
  const isEmpty =
    (viewMode === "user" && userData.length === 0) ||
    (viewMode === "topic" && topicData.length === 0);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (isEmpty) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="eye-off-outline" size={48} color="#EAEAEA" />
          <Text style={styles.emptyText}>
            아직 이어 본 다른 사람의 이야기가 없어요.
          </Text>
          <Text style={styles.emptySubText}>
            마음에 드는 이야기를 발견하고 다시 꺼내보세요!
          </Text>
        </View>
      );
    }
    if (viewMode === "user") {
      return (
        <FlatList
          data={userData}
          renderItem={({ item }) => <UserCard item={item} />}
          keyExtractor={(item) => `user-${item.user.id}`}
        />
      );
    }
    if (viewMode === "topic") {
      return (
        <FlatList
          data={topicData}
          renderItem={({ item }) => <TopicCard item={item} />}
          keyExtractor={(item) => `topic-${item.topic.id}`}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.pageContainer}>
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // --- 토글 스타일 ---
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F7F7F7",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    padding: 2,
  },
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

  // --- 사용자별 카드 ---
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFD6C9",
    justifyContent: "center",
    alignItems: "center",
  },
  nickname: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5C4B44",
  },
  cardRightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  countText: {
    fontSize: 13,
    color: "#B0A6A0",
  },

  // --- 주제별 카드 ---
  topicCardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
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
  topicCategory: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#B0A6A0",
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5C4B44",
    lineHeight: 22,
  },
  topicCountText: {
    fontSize: 13,
    color: "#B0A6A0",
    marginTop: 8,
  },

  // --- 빈 화면 ---
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#B0A6A0",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#D9D9D9",
    marginTop: 8,
  },
});

export default PastResponsesList;
