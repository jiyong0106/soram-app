import React from "react";
import { View, StyleSheet } from "react-native";
import { MyProfileResponse } from "@/utils/types/profile";
import AnswerCard from "./AnswerCard";

type Props = { profile: MyProfileResponse };

const MyProfileAnswers = ({ profile }: Props) => {
  const primary = profile.answers.filter((a) => a.isPrimary);
  const others = profile.answers.filter((a) => !a.isPrimary);

  return (
    <View style={styles.wrap}>
      {primary.map((a) => (
        <AnswerCard
          key={`p-${a.questionId}`}
          answer={{
            questionId: a.questionId,
            content: a.content,
            isPrimary: a.isPrimary,
          }}
        />
      ))}
      {others.map((a, idx) => (
        <AnswerCard
          key={a.questionId}
          answer={{
            questionId: a.questionId,
            content: a.content,
            isPrimary: a.isPrimary,
          }}
          index={idx + 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingVertical: 12 },
});

export default MyProfileAnswers;
