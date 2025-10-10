import { View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";

const RootHeader = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.logo}>SORAM</AppText>
      <AppText style={styles.slogan}>같은 생각으로 연결된 우리</AppText>
    </View>
  );
};

export default RootHeader;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  logo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FF6B3E",
  },

  slogan: {
    fontSize: 12,
    color: "#5C4B44",
  },
});
