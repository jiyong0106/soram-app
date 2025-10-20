import AppText from "@/components/common/AppText";
import { getConnections } from "@/utils/api/connectionPageApi";
import {
  GetConnectionsResponse,
  GetConnectionsType,
} from "@/utils/types/connection";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import ReceivedRequestsCard from "./ReceivedRequestsCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { useRouter } from "expo-router";

const QUERY_KEY = ["getConnectionsKey"] as const;

const ReceivedRequests = () => {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<GetConnectionsResponse>({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getConnections({
        take: 10,
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? lastPage.meta.endCursor ?? undefined
        : undefined,
  });

  // 새로고침 가드
  const lastRefreshAtRef = useRef<number>(0);
  const onRefresh = async () => {
    if (refreshing) return;
    const now = Date.now();
    if (now - lastRefreshAtRef.current < 2000) return;
    lastRefreshAtRef.current = now;
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  // 화면 표시용 리스트
  const items: GetConnectionsType[] = useMemo(() => {
    const flat = (data?.pages ?? []).flatMap((p) => p.data);
    return flat;
  }, [data?.pages]);

  const onPressCardPreview = (item: GetConnectionsType) => {
    const responseId = item.requesterResponsePreview.id;
    router.push({
      pathname: "/connection/response/[id]",
      params: { id: responseId, connectionId: item.id },
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <AppText style={styles.center}>목록을 불러오지 못했어요</AppText>;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ReceivedRequestsCard
            item={item}
            onPressPreview={() => onPressCardPreview(item)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10, paddingBottom: 100 }}
        ListEmptyComponent={
          <AppText style={styles.empty}>받은 대화 요청이 없어요</AppText>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : null
        }
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching} // refreshing 상태를 isRefetching과 동기화
            onRefresh={onRefresh}
            colors={["#FF7D4A"]}
            tintColor={"#FF7D4A"}
          />
        }
      />
    </View>
  );
};

export default ReceivedRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingBottom: 100,
  },
  empty: {
    textAlign: "center",
    color: "#B0A6A0",
    marginTop: 20,
    fontSize: 16,
  },
  center: {
    textAlign: "center",
    marginTop: 24,
    color: "#B0A6A0",
  },
});
