import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PastResponsesList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>이어 본 이야기 목록이 여기에 표시됩니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#B0A6A0",
  },
});

export default PastResponsesList;
