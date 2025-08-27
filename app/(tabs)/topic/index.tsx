import TopicTopTabs from "@/components/topic/TopicTopTabs";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const TopicPage = () => {
  return (
    <View style={styles.container}>
      <TopicTopTabs />
    </View>
  );
};

export default TopicPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
