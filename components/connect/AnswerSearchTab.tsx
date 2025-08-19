import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AnswerSearchTab = () => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>여기는 "답변 찾기" 탭 (UI Placeholder)</Text>
    </View>
  );
};

export default AnswerSearchTab;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
  },
});
