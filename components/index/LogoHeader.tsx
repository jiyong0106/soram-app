import { StyleSheet, Text, View } from "react-native";

export default function LogoHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Soram</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    paddingTop: 40,
    paddingLeft: 16,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
});
