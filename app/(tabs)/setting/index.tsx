import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";
import AccountSection from "@/components/settings/AccountSection";
import SupportSection from "@/components/settings/SupportSection";
import PolicySection from "@/components/settings/PolicySection";
import CurrencySection from "@/components/settings/CurrencySection";
import AppText from "@/components/common/AppText";

const SettingPage = () => {
  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerBackVisible: false,
          headerShadowVisible: false,
          headerLeft: () => (
            <View style={{ paddingHorizontal: 16 }}>
              <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
                더보기
              </AppText>
            </View>
          ),
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

export default SettingPage;

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 100,
  },
});
