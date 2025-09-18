import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import AppHeader from "@/components/common/AppHeader";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";

const TicketHistory = () => {
  // id를 사용해 데이터 패칭 예정

  return (
    <PageContainer padded={false}>
      <Stack.Screen
        options={{
          title: "재화 사용내역",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}></View>
    </PageContainer>
  );
};

export default TicketHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
