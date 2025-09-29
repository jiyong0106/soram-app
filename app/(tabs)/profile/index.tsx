import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";
import AccountSection from "@/components/settings/AccountSection";
import SupportSection from "@/components/settings/SupportSection";
import PolicySection from "@/components/settings/PolicySection";
import CurrencySection from "@/components/settings/CurrencySection";

const ProfilePage = () => {
  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: "더보기",
          headerShown: true,
          headerBackVisible: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <CurrencySection />
        <SupportSection />
        <PolicySection />
        <AccountSection />
      </ScrollView>
    </PageContainer>
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
