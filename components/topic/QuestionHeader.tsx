import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import { useQuery } from "@tanstack/react-query";
import { getTextHeader } from "@/utils/api/topicPageApi";
import VerticalQuestionSlider from "./VerticalQuestionSlider";
import QuestionHeaderSkeleton from "../skeleton/QuestionHeaderSkeleton";

type Props = {
  topicBoxId: number;
};

const QuestionHeader = ({ topicBoxId }: Props) => {
  const { data } = useQuery({
    queryKey: ["getTextHeaderKey", topicBoxId],
    queryFn: () => getTextHeader(topicBoxId),
    staleTime: 60 * 1000,
    enabled: !!topicBoxId,
  });

  if (!data) {
    return <QuestionHeaderSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title}>{data?.title}</AppText>
      </View>

      <VerticalQuestionSlider subQuestions={data?.subQuestions} />
    </View>
  );
};

export default QuestionHeader;

const styles = StyleSheet.create({
  container: {},
  titleWrapper: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
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
    color: "#333",
  },
  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },
  subQ: {
    marginVertical: 10,
    backgroundColor: "red",
  },
  subQText: {
    fontSize: 14,
  },
  cardSub: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
  },
});
