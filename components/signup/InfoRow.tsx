import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  dimWhenEmpty?: boolean;
};

const InfoRow = ({ icon, label, value, dimWhenEmpty }: InfoRowProps) => {
  const isEmpty = !value || value === "-" || value === "미설정";
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={18} color="#8E8E93" />
        <AppText style={styles.rowLabel}>{label}</AppText>
      </View>
      <AppText style={[styles.rowValue, isEmpty && { color: "#8E8E93" }]}>
        {isEmpty && dimWhenEmpty ? "미설정" : value}
      </AppText>
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowLabel: {
    color: "#8E8E93",
    fontSize: 14,
  },
  rowValue: {
    color: "#222",
    fontSize: 15,
    fontWeight: "bold",
  },
});
