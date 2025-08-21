import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AnswerRecommend } from "@/utils/types/connect";

interface ItemProps {
  item: AnswerRecommend;
}

const AnswerRecommendLists = ({ item }: ItemProps) => {
  const { id, title, content, category, createdAt, updatedAt } = item;
  return (
    <View style={styles.container}>
      <Text>{id}</Text>
      <Text>{title}</Text>
      <Text>{content}</Text>
    </View>
  );
};

export default AnswerRecommendLists;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    height: 100,
  },
});
