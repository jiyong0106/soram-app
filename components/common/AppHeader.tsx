import { View, Pressable, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  hasNotification?: boolean;
};

const AppHeader = ({ hasNotification }: Props) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AppText style={styles.logo}>SORAM</AppText>
        <AppText style={styles.slogan}>이야기와 목소리로 연결된 우리</AppText>
      </View>
      <Pressable
        onPress={() => router.push("/alerts")}
        style={styles.notificationBtn}
      >
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
    flexDirection: "row",
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
