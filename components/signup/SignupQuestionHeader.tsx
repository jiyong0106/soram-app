import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";
import VerticalQuestionSlider from "@/components/topic/VerticalQuestionSlider";

type Props = {
  title: string;
  subQuestions?: string[];
};

const SignupQuestionHeader = ({ title, subQuestions }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title}>{title}</AppText>
      </View>

      {subQuestions && subQuestions.length > 0 && (
        <VerticalQuestionSlider subQuestions={subQuestions} />
      )}
    </View>
  );
};

export default SignupQuestionHeader;

const styles = StyleSheet.create({
  container: {},
  titleWrapper: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#5C4B44",
  },
  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },
});
