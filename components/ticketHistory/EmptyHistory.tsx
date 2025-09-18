import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../common/AppText";

const EmptyHistory = () => (
  <View style={styles.container}>
    <Ionicons name="file-tray-outline" size={60} color="#E0E0E0" />
    <Text style={styles.text}>아직 재화 내역이 없어요.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50, // 헤더 높이 등을 고려한 여백
    backgroundColor: "#F5F7FA",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#B0B0B0",
  },
});

export default EmptyHistory;
