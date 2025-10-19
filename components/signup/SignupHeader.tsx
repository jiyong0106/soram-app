import { StyleSheet, View } from "react-native";
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
    marginTop: 15,
    marginBottom: 30,
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5C4B44",
    marginBottom: 10,
    lineHeight: 36,
  },
  subtitle: {
    color: "#5C4B44",
  },
});
