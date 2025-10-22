import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

import CurrencySection from "@/components/settings/CurrencySection";
import AppText from "@/components/common/AppText";

const ProfilePage = () => {
  return (
    // <PageContainer edges={["bottom"]} padded={false}>
    // <Stack.Screen
    //   options={{
    //     title: "프로필",
    //     headerShown: true,
    //     headerBackVisible: false,
    //   }}
    // />
    <ScrollView contentContainerStyle={styles.scroll}>
      <View>
        <AppText>프로필</AppText>
      </View>
    </ScrollView>
    // </PageContainer>
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
