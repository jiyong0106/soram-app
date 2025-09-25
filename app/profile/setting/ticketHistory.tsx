import React, { useMemo, useCallback } from "react";
import { View, StyleSheet } from "react-native"; // 👈 Text import 제거
import { Stack } from "expo-router";

// 기존 공통 컴포넌트들
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import TopicTabBar from "@/components/topic/TopicTabBar";
import TicketHistroySection from "@/components/profile/TicketHistroySection";
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
          title: "재화 사용내역",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}>
        <TopicTabBar routes={routes} renderScene={renderScene} />
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 70, // 아이콘 너비 + 여백 만큼 띄워서 구분선 표시
  },
});
