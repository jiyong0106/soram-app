import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AnswerRecommend } from "@/utils/types/connect";
import Button from "../common/Button";

interface AnswerRandomListsProps {
  item: AnswerRecommend;
}

const AnswerRandomLists = ({ item }: AnswerRandomListsProps) => {
  const { id, title, content, category, createdAt, updatedAt } = item;

  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <Text>{content}</Text>
      <View style={styles.btnWrapper}>
        <Button
          label="다른 이야기 보기"
          color="#ff6b6b"
          textColor="#fff"
          style={{ flex: 1 }}
        />
        <View style={{ width: 8 }} /> // 간격
        <Button
          label="대화 요청하기"
          color="#ff6b6b"
          textColor="#fff"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

export default AnswerRandomLists;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
  },
  btnWrapper: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
});
