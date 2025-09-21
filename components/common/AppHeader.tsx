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
      <View style={styles.logoContainer}>
                <AppText style={styles.logo}>SORAM</AppText>
        <AppText style={styles.slogan}>같은 생각으로 연결된 우리</AppText>
      </View>

      {/* 오른쪽: 알림 아이콘 */}
      <Pressable onPress={onPressNotification} style={styles.notificationBtn}>
        <Ionicons name="notifications-outline" size={24} color="#5C4B44" />
        {hasNotification && <View style={styles.badge} />}
      </Pressable>
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
  logoContainer: {
    flexDirection: "row", // 자식 요소들을 가로로 배열
    alignItems: "baseline",
    gap: 8, // 로고와 슬로건 사이의 간격
  },
  slogan: {
    fontSize: 12,
    color: "#5C4B44",
  },
  notificationBtn: {},
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  tickets: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
  },
});
