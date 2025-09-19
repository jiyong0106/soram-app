import { useTicketsStore } from "@/utils/store/useTicketsStore";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import TicketsSheet from "./TicketsSheet";
import { useRef } from "react";
import ScalePressable from "../common/ScalePressable";

const TicketsView = () => {
  // 변경점: 스토어에서 데이터를 각각의 selector로 가져와 무한 루프를 방지합니다.
  const storeState = useTicketsStore();
  console.log(
    "--- [TicketsView파일] 스토어 상태를 사용한 렌더링:",
    JSON.stringify(storeState, null, 2)
  );

  const { data, initialized } = storeState;
  const actionSheetRef = useRef<any>(null);

  if (!initialized) {
    return null;
  }

  const { CHAT, VIEW_RESPONSE } = data;

  const items = [
    { color: "#FF8A5B", value: CHAT.totalQuantity },
    { color: "#BFDCAB", value: VIEW_RESPONSE.totalQuantity },
  ];

  return (
    <ScalePressable
      style={styles.container}
      onPress={() => actionSheetRef.current?.present?.()}
    >
      <AppText style={styles.headerText}>보유 중인 사용권</AppText>
      <View style={styles.ticketWrap}>
        {items.map(({ color, value }, id) => (
          <View key={id} style={styles.ticket}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: color, marginRight: 4 },
              ]}
            >
              <AppText style={styles.iconBadgeText}>
                {id === 0 ? "C" : "M"}
              </AppText>
            </View>
            <AppText style={styles.ticketText}>{value}</AppText>
          </View>
        ))}
      </View>
      <TicketsSheet ref={actionSheetRef} snapPoints={["50%"]} />
    </ScalePressable>
  );
};

export default TicketsView;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A4A4A",
  },
  ticketWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ticket: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ticketText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  iconBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
  },
});
