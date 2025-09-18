import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <AppText style={styles.text}>{title}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#F5F7FA", // 리스트 배경과 다른 색으로 구분
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#5C6E80",
  },
});

export default SectionHeader;
