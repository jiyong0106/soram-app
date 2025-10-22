import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";

// 한글 주석: 브랜드 영역 (로고 텍스트/슬로건)
const ProfileBranding = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.brand}>SORAM</AppText>
      <AppText style={styles.caption}>같은 생각으로 연결된 우리</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 8,
  },
  brand: {
    color: "#FF7D4A",
    fontWeight: "bold",
    fontSize: 18,
  },
  caption: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 20,
  },
});

export default ProfileBranding;
