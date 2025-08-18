import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AnswerRecommendTab = () => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>여기는 "답변 추천" 탭 (UI Placeholder)</Text>
    </View>
  );
};

export default AnswerRecommendTab;

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
