import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../common/AppText";

type Props = {
  title: string;
  subSteps: string[];
  activeIndex: number;
  onChangeIndex?: (i: number) => void;
};

const QuestionHeader = ({
  title,
  subSteps,
  activeIndex,
  onChangeIndex,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <AppText style={styles.questionHighlight}>Q.</AppText>
        <AppText style={styles.title}>{title}</AppText>
      </View>
      <TouchableOpacity
        onPress={() => onChangeIndex?.((activeIndex + 1) % subSteps.length)}
        activeOpacity={0.7}
      >
        {/* <Text style={styles.subQ}>
          {`${activeIndex + 1}. ${subSteps[activeIndex]}`} ▼
        </Text> */}
      </TouchableOpacity>
    </View>
  );
};

export default QuestionHeader;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
    fontSize: 16,
    fontWeight: "600",
  },
});
