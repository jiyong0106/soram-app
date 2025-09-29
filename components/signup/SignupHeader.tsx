import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppText from "../common/AppText";

interface SignupHeaderProps {
  title: string;
  subtitle: string;
}

const SignupHeader = ({ title, subtitle }: SignupHeaderProps) => {
  return (
    <View style={styles.headerTitle}>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.subtitle}>{subtitle}</AppText>
    </View>
  );
};

export default SignupHeader;

const styles = StyleSheet.create({
  headerTitle: {
    marginBottom: 30,
    gap: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
  },
});
