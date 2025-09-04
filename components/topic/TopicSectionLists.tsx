import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { TopicListType } from "@/utils/types/topic";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";
import TopicListSheet from "./TopicListSheet";

interface ItemProps {
  item: TopicListType;
}

const TopicSectionLists = ({ item }: ItemProps) => {
  const { id, title, subQuestions, category, userCount } = item;
  const actionSheetRef = useRef<any>(null);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={() => actionSheetRef.current?.present?.()}
    >
      <View style={styles.categoryWrapper}>
        <AppText style={styles.category}># {category}</AppText>
        <Ionicons name="chevron-forward-outline" size={20} color="black" />
      </View>
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title}>{title}</AppText>
      </View>
      <View>
        {subQuestions.map((content, index) => (
          <AppText key={`${id}-${index}`} style={styles.cardSub}>
            {content}
          </AppText>
        ))}
      </View>
      <AppText style={styles.participants}>
        {userCount === 0
          ? "아직 등록 된 답변이 없어요"
          : `💬 ${userCount}명이 이야기하고 있어요`}
      </AppText>
      <TopicListSheet
        ref={actionSheetRef}
        title={title}
        id={id}
        subQuestions={subQuestions}
      />
    </TouchableOpacity>
  );
};

export default TopicSectionLists;
const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    // 카드 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2, // 안드로이드 그림자
    gap: 10,
    marginHorizontal: 10,
  },
  categoryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#333",
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
  participants: {
    marginTop: 12,
    fontSize: 13,
    color: "#999",
  },
  category: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#888",
  },

  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },
  cardSub: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
  },
});
