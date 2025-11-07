import React, { useMemo, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import TopTabBar from "@/components/common/TopTabBar";
import TicketHistroySection from "@/components/settings/TicketHistroySection";
import { HistoryTabKey } from "@/utils/api/transactionsApi";

const TicketHistory = () => {
  const routes = useMemo<{ key: HistoryTabKey; label: string }[]>(
    () => [
      { key: "ALL", label: "전체" },
      { key: "EARN", label: "획득" },
      { key: "USE", label: "사용" },
    ],
    []
  );

  const renderScene = useCallback(
    ({ route }: { route: { key: HistoryTabKey } }) => (
      <TicketHistroySection type={route.key} />
    ),
    []
  );

  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "사용내역",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}>
        <TopTabBar routes={routes} renderScene={renderScene} />
      </View>
    </PageContainer>
  );
};

export default TicketHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
