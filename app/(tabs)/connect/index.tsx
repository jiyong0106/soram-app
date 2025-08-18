import ConnectTopTabs from "@/components/connect/ConnectTopTabs";
import React from "react";
import { StyleSheet, View } from "react-native";

const ConnectPage = () => {
  return (
    <View style={styles.container}>
      <ConnectTopTabs />
    </View>
  );
};

export default ConnectPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
