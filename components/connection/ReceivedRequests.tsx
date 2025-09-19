import AppText from "@/components/common/AppText";
import {
  getConnections,
  postConnectionsAccept,
  postConnectionsReject,
} from "@/utils/api/connectionPageApi";
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
    queryKey: ["getConnectionsKey"],
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

  // 캐시 타입
  type ConnInfinite = InfiniteData<GetConnectionsResponse>;
  type Ctx = { prev?: ConnInfinite };

  // 수락
  const acceptMutation = useMutation<unknown, unknown, number, Ctx>({
    mutationFn: (connectionId: number) =>
      postConnectionsAccept({ connectionId }),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["getConnectionsKey"] });
      setProcessingId(id);

      const prev = queryClient.getQueryData<ConnInfinite>([
        "getConnectionsKey",
      ]);

      if (prev) {
        const next: ConnInfinite = {
          pageParams: [...prev.pageParams],
          pages: prev.pages.map((page) => ({
            ...page,
            data: page.data.filter((item) => item.id !== id),
          })),
        };
        queryClient.setQueryData<ConnInfinite>(["getConnectionsKey"], next);
      }

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData<ConnInfinite>(["getConnectionsKey"], ctx.prev);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
    },

    onSettled: () => {
      setProcessingId(null);
    },
  });

  // 거절
  const rejectMutation = useMutation<unknown, unknown, number, Ctx>({
    mutationFn: (connectionId: number) =>
      postConnectionsReject({ connectionId }),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["getConnectionsKey"] });
      setProcessingId(id);

      const prev = queryClient.getQueryData<ConnInfinite>([
        "getConnectionsKey",
      ]);

      if (prev) {
        const next: ConnInfinite = {
          pageParams: [...prev.pageParams],
          pages: prev.pages.map((page) => ({
            ...page,
            data: page.data.filter((item) => item.id !== id),
          })),
        };
        queryClient.setQueryData<ConnInfinite>(["getConnectionsKey"], next);
      }

      return { prev };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData<ConnInfinite>(["getConnectionsKey"], ctx.prev);
      }
    },

    onSettled: () => {
      setProcessingId(null);
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
