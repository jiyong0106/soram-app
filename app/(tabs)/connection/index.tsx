import ConnectionTopTab from "@/components/connection/ConnectionTopTab";
import { StyleSheet, View } from "react-native";

const ConnectionPage = () => {
  return (
    <View style={styles.container}>
      <ConnectionTopTab />
    </View>
  );
};

export default ConnectionPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
