import { useTicketsStore } from "@/utils/store/useTicketsStore";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import TicketsSheet from "./TicketsSheet";
import { useRef } from "react";
import ScalePressable from "../common/ScalePressable";
import { Ionicons } from "@expo/vector-icons";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

const TicketsView = () => {
  const storeState = useTicketsStore();
  const { data, initialized } = storeState;

  const actionSheetRef = useRef<BottomSheetModal>(null);

  if (!initialized) {
    return null;
  }

  const { CHAT, VIEW_RESPONSE } = data;

  const items = [
    {
      icon: (
        <Ionicons name="chatbubble-ellipses-sharp" size={22} color="#FF8A5B" />
      ),
      value: CHAT.totalQuantity,
    },
    {
      icon: <Ionicons name="book" size={22} color="#6A839A" />,
      value: VIEW_RESPONSE.totalQuantity,
    },
  ];

  return (
    <ScalePressable onPress={() => actionSheetRef.current?.present?.()}>
      {/* ✨ 이제 이 View가 버튼의 전체적인 모양을 담당합니다. */}
      <View style={styles.buttonContainer}>
        <AppText style={styles.headerText}>보유중인 이용권</AppText>
        <View style={styles.ticketWrap}>
          {items.map(({ icon, value }, id) => (
            <View key={id} style={styles.ticket}>
              {icon}
              <AppText style={styles.ticketText}>{value}</AppText>
            </View>
          ))}
        </View>
      </View>
      <TicketsSheet ref={actionSheetRef} snapPoints={["50%"]} />
    </ScalePressable>
  );
};

export default TicketsView;

// ✨ StyleSheet가 훨씬 간결해졌습니다.
const styles = StyleSheet.create({
  buttonContainer: {
    // 테두리 설정
    // borderWidth: 1,
    // borderColor: "#FFB591",

    // 그림자 설정 (iOS & Android 호환)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Android용 그림자

    // 기존 레이아웃 스타일
    backgroundColor: "#fff",
    borderRadius: 30,
    alignSelf: "center",
    marginVertical: 10,
    paddingHorizontal: 32,
    paddingVertical: 4, // 패딩 값 조정
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5C4B44",
  },
  ticketWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  ticket: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
});
