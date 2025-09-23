import { StyleSheet, View } from "react-native";
import React from "react";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";
import ScalePressable from "../common/ScalePressable";
import { useRouter } from "expo-router";

interface MyResponseCardProps {
  item: {
    id: number;
    title: string;
    category: string;
    textContent: string | null;
  };
}

const MyResponseCard = ({ item }: MyResponseCardProps) => {
  // ✅ 새로운 props 타입을 사용
  const { id, title, category, textContent } = item;
  const router = useRouter();

  const handlePress = () => {
    // TODO: 추후 주제 상세가 아닌 '내 답변 상세' 페이지로 이동
    console.log(`Card pressed, response ID: ${id}`);
    // router.push(`/profile/my-responses/${id}`);
  };

  return (
    <ScalePressable style={styles.container} onPress={handlePress}>
      <View style={styles.categoryWrapper}>
        <AppText style={styles.category}># {category}</AppText>
        <Ionicons name="chevron-forward-outline" size={20} color="#5C4B44" />
      </View>
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title} numberOfLines={2}>
          {title}
        </AppText>
      </View>
      {textContent && (
        <View style={styles.responseWrapper}>
          <AppText style={styles.responseText} numberOfLines={2}>
            {textContent}
          </AppText>
        </View>
      )}
    </ScalePressable>
  );
};

export default MyResponseCard;

// 스타일은 TopicSectionLists.tsx와 거의 동일합니다.
const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    gap: 12, // 간격 조정
    marginHorizontal: 16, // 좌우 여백 추가
  },
  categoryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
  title: {
    flex: 1, // 텍스트가 길어질 경우 줄바꿈을 위해 flex: 1 추가
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#5C4B44",
  },
  participants: {
    marginTop: 8,
    fontSize: 13,
    color: "#B0A6A0",
  },
  category: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#B0A6A0",
  },
  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
    fontSize: 16, // title과 사이즈 통일
  },
  responseWrapper: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#d9d9d9",
  },
  responseText: {
    fontSize: 14,
    color: "#B0A6A0", // 주제목보다 약간 연한 색상
    lineHeight: 21,
  },
});
