import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onPressNotification?: () => void;
  hasNotification?: boolean;
};

const AppHeader = ({ onPressNotification, hasNotification }: Props) => {
  return (
    <View style={styles.container}>
      {/* 왼쪽: 로고 + 슬로건 */}
      <View>
        <AppText style={styles.logo}>SORAM</AppText>
        <AppText style={styles.slogan}>같은 생각으로 연결된 우리</AppText>
      </View>

      {/* 오른쪽: 알림 아이콘 */}
      {/* <Pressable onPress={onPressNotification} style={styles.notificationBtn}>
        <View>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          {hasNotification && <View style={styles.badge} />}
        </View>
      </Pressable> */}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B3E",
  },
  slogan: {
    fontSize: 12,
    color: "#999",
  },
  notificationBtn: {
    padding: 6,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
});
