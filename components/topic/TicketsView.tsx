import { useTicketsStore } from "@/utils/sotre/useTicketsStore";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";
import TicketsSheet from "./TicketsSheet";
import { useRef } from "react";
import ScalePressable from "../common/ScalePressable";

const TicketsView = () => {
  const { CHAT, VIEW_RESPONSE } = useTicketsStore((s) => s.counts);
  const actionSheetRef = useRef<any>(null);

  const itmes = [
    { color: "#FF8A5B", value: CHAT },
    { color: "#72635C", value: VIEW_RESPONSE },
  ];
  return (
    <ScalePressable
      style={styles.container}
      onPress={() => actionSheetRef.current?.present?.()}
    >
      <AppText style={styles.headerText}>내 티켓</AppText>
      <View style={styles.ticketWrap}>
        {itmes.map(({ color, value }, id) => (
          <View key={id} style={styles.ticket}>
            <Ionicons name="ticket-sharp" size={24} color={color} />
            <AppText style={styles.ticketText}>{value}</AppText>
          </View>
        ))}
      </View>
      <TicketsSheet ref={actionSheetRef} snapPoints={["40%"]} />
    </ScalePressable>
  );
};

export default TicketsView;

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#FF6B6B",
    marginVertical: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "60%",
    marginHorizontal: "auto",
  },
  headerText: {
    fontSize: 13,
  },
  ticketWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticket: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ticketText: {
    fontSize: 11,
  },
});
