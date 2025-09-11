import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = () => <View style={styles.line} />;

const styles = StyleSheet.create({
  line: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: "#f0f0f0",
  },
});

export default Divider;
