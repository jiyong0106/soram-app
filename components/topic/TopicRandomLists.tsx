import { StyleSheet, View } from "react-native";
import React from "react";
import { AnswerRecommend } from "@/utils/types/topic";
import Button from "../common/Button";
import { useRouter } from "expo-router";
import AppText from "../common/AppText";

interface TopicRandomListsProps {
  item: AnswerRecommend;
}

const TopicRandomLists = ({ item }: TopicRandomListsProps) => {
  const { id, title, content, category, createdAt, updatedAt } = item;
  const router = useRouter();
  const topicId = id;
  return (
    <View style={styles.container}>
      <AppText>{id}</AppText>
      <AppText>{title}</AppText>
      <AppText>{content}</AppText>
      <View style={styles.btnWrapper}>
        <Button
          label="랜덤 답변 확인 할 버튼"
          color="#ff6b6b"
          textColor="#fff"
          onPress={() => router.push(`/topic/${topicId}`)}
        />
        <AppText>이거 누르면 상세페이지로 이동함</AppText>
      </View>
    </View>
  );
};

export default TopicRandomLists;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
  },
  btnWrapper: {
    marginTop: 10,
    gap: 10,
  },
});
