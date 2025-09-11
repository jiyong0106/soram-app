import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  loading?: boolean;
};

const EmptyState = ({ title, subtitle }: Props) => {
  return (
    <View style={styles.wrap} accessible accessibilityRole="text">
      <Ionicons name="document-text-outline" size={36} color="#CFCFCF" />
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  title: {
    marginTop: 4,
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#8E8E8E",
    textAlign: "center",
    lineHeight: 18,
  },
});
