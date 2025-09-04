import { useTicketsStore } from "@/utils/sotre/useTicketsStore";
import { StyleSheet, View } from "react-native";
import AppText from "../common/AppText";
import { Ionicons } from "@expo/vector-icons";

const TicketsView = () => {
  const { CHAT, NEW_RESPONSE, MORE_RESPONSE } = useTicketsStore(
    (s) => s.counts
  );

  const itmes = [
    { color: "#FF8A5B", value: CHAT },
    { color: "#72635C", value: NEW_RESPONSE },
    { color: "#BFDCAB", value: MORE_RESPONSE },
  ];

  return (
    <View style={styles.container}>
      <AppText style={styles.headerText}>내 티켓</AppText>
      <View style={styles.ticketWrap}>
        {itmes.map(({ color, value }, id) => (
          <View key={id} style={styles.ticket}>
            <Ionicons name="ticket-sharp" size={24} color={color} />
            <AppText style={styles.ticketText}>{value}</AppText>
          </View>
        ))}
      </View>
    </View>
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
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "80%",
    marginHorizontal: "auto",
  },
  headerText: {
    fontSize: 13,
  },
  ticketWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticket: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ticketText: {
    fontSize: 11,
  },
});
