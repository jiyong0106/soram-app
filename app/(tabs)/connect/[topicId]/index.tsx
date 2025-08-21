import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const AnswerRandomPage = () => {
  const { topicId } = useLocalSearchParams();
  const topicIdString = topicId as string;
  return (
    <View style={styles.container}>
      <Text>토픽 상세 페이지</Text>
      <Text>{topicId}</Text>
    </View>
  );
};

export default AnswerRandomPage;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
