import { SectionList } from "react-native";
import EmptyHistory from "../ticketHistory/EmptyHistory";
import TransactionRow from "../ticketHistory/TransactionRow";
import LoadingSpinner from "../common/LoadingSpinner";
import SectionHeader from "../ticketHistory/SectionHeader";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GetTransactionsResponse,
  HistoryTabKey,
} from "@/utils/api/transactionsApi";
import { getTransactions } from "@/utils/api/transactionsApi";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import dayjs from "dayjs";

const TicketHistroySection = ({ type }: { type: HistoryTabKey }) => {
  // 각 탭 별로 개별 쿼리 키를 사용하여 캐시 분리 및 상태 보존
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<GetTransactionsResponse>({
      queryKey: ["transactionsKey", type],
      queryFn: ({ pageParam }) =>
        getTransactions({
          type,
          cursor: typeof pageParam === "number" ? pageParam : undefined,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
      initialPageParam: undefined,
    });

  const sections = useMemo(() => {
    const flatData = data?.pages.flatMap((page) => page.data) ?? [];
    if (flatData.length === 0)
      return [] as { title: string; data: typeof flatData }[];

    const grouped = flatData.reduce((acc, tx) => {
      const dateStr = dayjs(tx.createdAt).format("YYYY년 M월 D일 dddd");
      if (!acc[dateStr]) acc[dateStr] = [] as typeof flatData;
      acc[dateStr].push(tx);
      return acc;
    }, {} as { [date: string]: typeof flatData });

    return Object.keys(grouped).map((dateTitle) => ({
      title: dateTitle,
      data: grouped[dateTitle],
    }));
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (sections.length === 0) {
    return <EmptyHistory />;
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TransactionRow transaction={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <SectionHeader title={title} />
      )}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      stickySectionHeadersEnabled={false}
    />
  );
};

export default TicketHistroySection;

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 70, // 아이콘 너비 + 여백 만큼 띄워서 구분선 표시
  },
});
