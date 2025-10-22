import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import AppText from "@/components/common/AppText";

const ProfilePage = () => {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View>
        <AppText>프로필</AppText>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scroll: {
    paddingBottom: 60,
  },
});
