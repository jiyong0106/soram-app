import { View, Pressable, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import TicketsSheet from "../topic/TicketsSheet";

type Props = {
  hasNotification?: boolean;
};

const AppHeader = ({ hasNotification }: Props) => {
  const router = useRouter();
  const actionSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AppText style={styles.brand}>SORAM</AppText>
        <AppText style={styles.caption}>이야기와 목소리로 연결된 우리</AppText>
      </View>
      <View style={styles.buttonContainer}>
        {/* 티켓 버튼 */}
        <Pressable onPress={() => actionSheetRef.current?.present?.()}>
          <Ionicons name="ticket-outline" size={24} color="black" />
        </Pressable>
        {/* 알림 버튼 */}
        <Pressable onPress={() => router.push("/alerts")}>
          <Ionicons name="notifications-outline" size={24} color="#5C4B44" />
          {hasNotification && <View style={styles.badge} />}
        </Pressable>
      </View>
      <TicketsSheet ref={actionSheetRef} snapPoints={["50%"]} />
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
    paddingVertical: 5,
  },
  logoContainer: {
    alignItems: "baseline",
    gap: 8, // 로고와 슬로건 사이의 간격
  },
  brand: {
    color: "#FF7D4A",
    fontWeight: "bold",
    fontSize: 18,
  },
  caption: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
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
