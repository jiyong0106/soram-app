import { Answer } from "@/utils/types/profile";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  answer: Answer;
  index?: number; // 카드 넘버링 감성용
};

const AnswerCard: React.FC<Props> = ({ answer, index }) => {
  return (
    <View style={[styles.card, answer.isPrimary && styles.primary]}>
      <Text style={styles.qLabel}>
        {answer.isPrimary ? "메인 이야기" : `이야기 ${index ?? ""}`}
      </Text>
      <Text style={styles.content}>{answer.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },
  primary: {
    borderColor: "#ffd5cc",
    backgroundColor: "#fff8f6",
  },
  qLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#222",
  },
});

export default AnswerCard;
