import React, { useState, useMemo } from "react";
import { View, StyleSheet, SectionList, ActivityIndicator } from "react-native"; // 👈 Text import 제거
import { Stack } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";

// 1단계에서 만든 API 함수 및 타입
import {
  getTransactions,
  GetTransactionsResponse,
} from "@/utils/api/transactionsApi";
// 2단계에서 만든 UI 컴포넌트들
import HistoryTabs from "@/components/ticketHistory/HistoryTabs";
import TransactionRow from "@/components/ticketHistory/TransactionRow";
import SectionHeader from "@/components/ticketHistory/SectionHeader";
import EmptyHistory from "@/components/ticketHistory/EmptyHistory";
// 기존 공통 컴포넌트들
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";

dayjs.locale("ko"); // dayjs 한국어 설정

const TicketHistory = () => {
  // 1. 상태 및 데이터 페칭
  const [activeTab, setActiveTab] = useState<"ALL" | "EARN" | "USE">("ALL");

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<GetTransactionsResponse>({
      queryKey: ["transactions", activeTab],
      queryFn: ({ pageParam }) =>
        getTransactions({
          type: activeTab,
          cursor: typeof pageParam === "number" ? pageParam : undefined,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
      initialPageParam: undefined,
    });

  // 2. API 응답 데이터를 SectionList에 맞는 형태로 가공
  const sections = useMemo(() => {
    const flatData = data?.pages.flatMap((page) => page.data) ?? [];
    if (flatData.length === 0) return [];

    const groupedData = flatData.reduce((acc, transaction) => {
      const dateStr = dayjs(transaction.createdAt).format(
        "YYYY년 M월 D일 dddd"
      );
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(transaction);
      return acc;
    }, {} as { [key: string]: typeof flatData });

    return Object.keys(groupedData).map((dateTitle) => ({
      title: dateTitle,
      data: groupedData[dateTitle],
    }));
  }, [data]);

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
        <HistoryTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* 3. 조건부 렌더링 */}
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : sections.length === 0 ? (
          <EmptyHistory />
        ) : (
          // 4. SectionList와 무한 스크롤
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TransactionRow transaction={item} />}
            // 👇 수정된 부분: Text 대신 SectionHeader 컴포넌트를 사용하도록 복구
            renderSectionHeader={({ section: { title } }) => (
              <SectionHeader title={title} />
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator style={{ margin: 20 }} />
              ) : null
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            stickySectionHeadersEnabled={false}
          />
        )}
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
