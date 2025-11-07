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
    fontSize: 22,
    fontWeight: "bold",
    color: "#5C4B44",
    marginVertical: 10,
  },
});

export default SectionTitle;
