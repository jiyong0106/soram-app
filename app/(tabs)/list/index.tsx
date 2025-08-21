import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ListPage = () => {
  return (
    <View style={styles.container}>
      <Text>리스트페이지</Text>
    </View>
  );
};

export default ListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
