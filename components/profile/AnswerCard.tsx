import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";

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
      <AppText style={styles.qLabel}>{`${questionContent}`}</AppText>
      <AppText style={styles.content}>"{content}"</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 5,
  },
  qLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5C4B44",
    marginBottom: 10,
    marginTop: 30,
  },
  content: {
    color: "#5C4B44",
    fontSize: 14,
    lineHeight: 40,
  },
});

export default AnswerCard;
