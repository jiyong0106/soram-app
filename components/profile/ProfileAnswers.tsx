import React from "react";
import { View, StyleSheet } from "react-native";
import { MyProfileResponse } from "@/utils/types/profile";
import SectionTitle from "./SectionTitle";
import AnswerCard from "./AnswerCard";

type Props = { answers: MyProfileResponse["answers"] };

const ProfileAnswers = ({ answers }: Props) => {
  const primary = answers.filter((a) => a.isPrimary);
  const others = answers.filter((a) => !a.isPrimary);

  return (
    <View style={styles.section}>
      <SectionTitle>내 이야기</SectionTitle>
      <View style={styles.list}>
        {primary.map((a) => (
          <AnswerCard
            key={`p-${a.questionId}`}
            answer={{
              questionId: a.questionId,
              content: a.content,
              isPrimary: a.isPrimary,
              questionContent: a.questionContent,
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
              questionContent: a.questionContent,
            }}
            index={idx + 1}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingTop: 20, gap: 20 },
  list: { gap: 30 },
});

export default ProfileAnswers;
