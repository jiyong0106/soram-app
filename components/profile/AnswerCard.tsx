import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  answer: {
    questionId: number;
    content: string;
    isPrimary: boolean;
    questionContent: string;
  };
  index?: number;
};

const AnswerCard = ({ answer, index }: Props) => {
  const { questionId, content, isPrimary, questionContent } = answer;
  return (
    <View style={styles.card}>
      <Text style={styles.qLabel}> {`- ${questionContent}`}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 5,
  },
  qLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  content: {
    color: "#5C4B44",
    fontSize: 15,
  },
});

export default AnswerCard;
