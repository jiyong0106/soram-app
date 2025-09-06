import AppText from "@/components/common/AppText";
import {
  getConnections,
  postConnectionsAccept,
  postConnectionsReject,
} from "@/utils/api/connectionPageApi";
import { useOptimisticInfiniteRemove } from "@/utils/hooks/useOptimisticInfiniteRemove";
import {
  GetConnectionsResponse,
  GetConnectionsType,
} from "@/utils/types/connection";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import ReceivedRequestsCard from "./ReceivedRequestsCard";
import LoadingSpinner from "../common/LoadingSpinner";

const QUERY_KEY = ["getConnectionsKey"] as const;

const ReceivedRequests = () => {
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

  const onRefresh = async () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  // 보기용 리스트 (필요하면 PENDING만 필터)
  const items: GetConnectionsType[] = useMemo(() => {
    const flat = (data?.pages ?? []).flatMap((p) => p.data);
    // PENDING만 보고 싶으면 아래 줄 사용
    // return flat.filter((d) => d.status === "PENDING");
    return flat;
  }, [data?.pages]);

  // ✅ 무한스크롤 전용 낙관적 제거 훅
  const optimisticRemove = useOptimisticInfiniteRemove<
    GetConnectionsType,
    GetConnectionsResponse
  >(QUERY_KEY);

  // ✅ 컨텍스트 타입: InfiniteData 형태로 맞추기
  type ConnInfinite = InfiniteData<GetConnectionsResponse>;
  type Ctx = { prev?: ConnInfinite };

  const acceptMutation = useMutation<unknown, unknown, number, Ctx>({
    mutationFn: (connectionId: number) =>
      postConnectionsAccept({ connectionId }),

    onMutate: async (id) => {
      setProcessingId(id);
      return await optimisticRemove(id); // { prev } 반환
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData<ConnInfinite>(QUERY_KEY, ctx.prev);
    },

    onSuccess: () => {
      // 채팅 목록 갱신 필요 시
      queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
    },

    onSettled: () => {
      setProcessingId(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const rejectMutation = useMutation<unknown, unknown, number, Ctx>({
    mutationFn: (connectionId: number) =>
      postConnectionsReject({ connectionId }),

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

  const onAccept = (id: number) => acceptMutation.mutate(id);
  const onReject = (id: number) => rejectMutation.mutate(id);

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
            onAccept={() => onAccept(item.id)}
            onReject={() => onReject(item.id)}
            disabled={processingId === item.id || isRefetching}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListEmptyComponent={
          <AppText style={styles.empty}>받은 대화 요청이 없어요</AppText>
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
            colors={["#ff6b6b"]}
            tintColor="#ff6b6b"
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
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
  center: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
  },
});
