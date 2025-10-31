import { View, StyleSheet } from "react-native";
import AppText from "@/components/common/AppText";

const RootHeader = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.logo}>SORAM</AppText>
      <AppText style={styles.slogan}>이야기와 목소리로 이어진 우리</AppText>
    </View>
  );
};

export default RootHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 10,
    gap: 6,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  slogan: {
    fontSize: 13,
    color: "#6b6b6b",
  },
});
