import React from "react";
import { View, StyleSheet } from "react-native";
import AnswerCard from "./AnswerCard";
import { ProfileType } from "@/utils/types/profile";

type AnswerListProps = { profile: ProfileType };

const AnswerList = ({ profile }: AnswerListProps) => {
  const primary = profile.answers.filter((a) => a.isPrimary);
  const others = profile.answers.filter((a) => !a.isPrimary);

  return (
    <View style={styles.wrap}>
      {primary.map((a) => (
        <AnswerCard key={`p-${a.questionId}`} answer={a} />
      ))}
      {others.map((a, idx) => (
        <AnswerCard key={a.questionId} answer={a} index={idx + 1} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingVertical: 12 },
});

export default AnswerList;
