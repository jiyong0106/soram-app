import React from "react";
import { StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";

type Props = { children: React.ReactNode };

// 한글 주석: 섹션 타이틀 공용 컴포넌트
const SectionTitle = ({ children }: Props) => {
  return <AppText style={styles.title}>{children}</AppText>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF7D4A",
    marginVertical: 10,
  },
});

export default SectionTitle;
