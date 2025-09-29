import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import AppText from "../common/AppText";

interface SummaryCardProps {
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SummaryCard = ({ title, children, style }: SummaryCardProps) => {
  return (
    <View style={[styles.card, style]}>
      <AppText style={styles.cardTitle}>{title}</AppText>
      {children}
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EDEDED",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  },
});
