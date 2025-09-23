import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";
import MyResponseCard from "@/components/profile/MyResponseCard";
import { TopicListType } from "@/utils/types/topic";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";

// --- API 연동 전 임시 데이터 ---
const DUMMY_DATA: TopicListType[] = [
  {
    id: 1,
    category: "미래",
    title: "세상에 없던 물건을 만든다면?",
    userCount: 12,
    subQuestions: [],
    createdAt: "2025-09-23",
    updatedAt: "2025-09-23",
  },
  {
    id: 2,
    category: "경험",
    title: "내 인생 최고의 여행지는 어디였나요?",
    userCount: 45,
    subQuestions: [],
    createdAt: "2025-09-23",
    updatedAt: "2025-09-23",
  },
  {
    id: 3,
    category: "일상",
    title: "최근 나를 가장 웃게 했던 순간은 언제인가요?",
    userCount: 8,
    subQuestions: [],
    createdAt: "2025-09-23",
    updatedAt: "2025-09-23",
  },
];
// ---------------------------------

const MyResponsesPage = () => {
  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "내가 남긴 이야기들",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          headerTitleStyle: { color: "#5C4B44", fontWeight: "bold" },
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={DUMMY_DATA}
          renderItem={({ item }) => <MyResponseCard item={item} />}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
    </PageContainer>
  );
};

export default MyResponsesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // 페이지 배경색
  },
  listContentContainer: {
    gap: 12,
    paddingVertical: 16,
  },
});
