import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

type AnswerBoxProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content?: string | null;
  placeholder?: string;
};

const AnswerBox = ({
  title,
  icon,
  content,
  placeholder = "",
}: AnswerBoxProps) => {
  const hasContent = !!content && content.trim().length > 0;
  return (
    <View style={styles.answerBox}>
      <View style={styles.answerTitleRow}>
        <Ionicons name={icon} size={18} color="#8E8E93" />
        <AppText style={styles.answerTitle}>{title}</AppText>
      </View>
      <AppText style={[styles.answerText, !hasContent && { color: "#8E8E93" }]}>
        {hasContent ? content : placeholder}
      </AppText>
    </View>
  );
};

export default AnswerBox;

const styles = StyleSheet.create({
  answerBox: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 12,
  },
  answerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  answerTitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  answerText: {
    fontSize: 15,
    color: "#222",
    lineHeight: 22,
  },
});
