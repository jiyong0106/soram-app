import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getSentConnections,
  postConnectionsCancel,
} from "@/utils/api/connectionPageApi";
import {
  GetSentConnectionsResponse,
  GetSentConnectionsType,
} from "@/utils/types/connection";
import SentRequestsCard from "./SentRequestsCard";
import AppText from "../common/AppText";
import LoadingSpinner from "../common/LoadingSpinner";
import { useOptimisticInfiniteRemove } from "@/utils/hooks/useOptimisticInfiniteRemove";

const QUERY_KEY = ["getSentConnectionsKey"] as const;

const SentRequests = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<GetSentConnectionsResponse>({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam }) =>
      getSentConnections({
        take: 10,
        cursor: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? lastPage.meta.endCursor ?? undefined
        : undefined,
  });

  // 보기용 리스트 (필요하면 PENDING만 필터)
  const items: GetSentConnectionsType[] = useMemo(() => {
    const flat = (data?.pages ?? []).flatMap((p) => p.data);
    return flat;
  }, [data?.pages]);

  // 연속 새로고침 방지: 1.5초 이내 재시도 무시 + 진행 중 가드
  const lastRefreshAtRef = useRef<number>(0);
  const onRefresh = async () => {
    if (refreshing) return;
    const now = Date.now();
    if (now - lastRefreshAtRef.current < 2000) return;
    lastRefreshAtRef.current = now;
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  // ✅ 무한스크롤 전용 낙관적 제거 훅
  const optimisticRemove = useOptimisticInfiniteRemove<
    GetSentConnectionsType,
    GetSentConnectionsResponse
  >(QUERY_KEY);

  // ✅ 컨텍스트 타입: InfiniteData 형태로 맞추기
  type ConnInfinite = InfiniteData<GetSentConnectionsResponse>;
  type Ctx = { prev?: ConnInfinite };

  const cancelMutation = useMutation<unknown, unknown, number, Ctx>({
    mutationFn: (connectionId: number) =>
      postConnectionsCancel({ connectionId }),
    onMutate: async (id) => {
      setProcessingId(id);
      return await optimisticRemove(id);
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData<ConnInfinite>(QUERY_KEY, ctx.prev);
    },
    onSettled: () => {
      setProcessingId(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const onCancel = (id: number) => cancelMutation.mutate(id);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <AppText style={styles.center}>목록을 불러오지 못했어요</AppText>;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <SentRequestsCard
            item={item}
            disabled={processingId === item.id || isRefetching}
            onCancel={() => onCancel(item.id)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListEmptyComponent={
          <AppText style={styles.empty}>보낸 대화 요청이 없어요</AppText>
        }
        ListFooterComponent={
          isRefetching || isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : hasNextPage ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : null
        }
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B3E"]}
            tintColor="#FF6B3E"
          />
        }
      />
    </View>
  );
};

export default SentRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
