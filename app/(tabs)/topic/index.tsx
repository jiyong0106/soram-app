import AppText from "@/components/common/AppText";
import TopicTopTabs from "@/components/topic/TopicTopTabs";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const TopicPage = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>이건 expo 기본폰트야! </Text>

      <AppText style={{ fontSize: 20 }}>
        이건 나눔스퀘어 네오 레귤러 폰트야!
      </AppText>

      <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
        이건 나눔스퀘어 네오 레귤러 폰트야!
      </AppText>

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
