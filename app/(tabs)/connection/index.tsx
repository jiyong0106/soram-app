import ConnectionLists from "@/components/connection/ConnectionLists";
import {
  getConnections,
  postConnectionsAccept,
  postConnectionsReject,
} from "@/utils/api/connectionPageApi";
import { useOptimisticListRemove } from "@/utils/hooks/useOptimisticListRemove";
import { GetConnectionsResponse } from "@/utils/types/connection";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

const QUERY_KEY = ["getConnectionsKey"] as const;

const ConnectionPage = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery<
    GetConnectionsResponse[]
  >({
    queryKey: QUERY_KEY,
    queryFn: getConnections,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
    });
  };

  // 보이는 리스트: PENDING만
  const items = useMemo(
    () => (data ?? []).filter((d) => d.status === "PENDING"),
    [data]
  );

  //  커스텀 훅 사용 (공용 낙관적 제거)
  const optimisticRemove =
    useOptimisticListRemove<GetConnectionsResponse>(QUERY_KEY);

  type Ctx = { prev?: GetConnectionsResponse[] };

  const acceptMutation = useMutation<unknown, unknown, number, Ctx>({
    mutationFn: (connectionId: number) =>
      postConnectionsAccept({ connectionId }),
    onMutate: async (id) => {
      setProcessingId(id);
      return await optimisticRemove(id); // 캐시에서 즉시 제거
    },
    onError: (_err, _id, ctx) => {
      // 롤백
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
    },
    onSettled: () => {
      setProcessingId(null);
      // 서버 상태와 동기화
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
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev);
    },
    onSettled: () => {
      setProcessingId(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const onAccept = (id: number) => acceptMutation.mutate(id);
  const onReject = (id: number) => rejectMutation.mutate(id);

  if (isLoading) return <Text style={styles.center}>로딩중…</Text>;
  if (isError)
    return <Text style={styles.center}>목록을 불러오지 못했어요</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ConnectionLists
            item={item}
            onAccept={() => onAccept(item.id)}
            onReject={() => onReject(item.id)}
            disabled={processingId === item.id || isRefetching}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListEmptyComponent={<Text style={styles.empty}>요청 목록 없음</Text>}
        ListFooterComponent={
          isRefetching ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : null
        }
        // onRefresh={refetch}
        // refreshing={isRefetching}
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

export default ConnectionPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  empty: { textAlign: "center", color: "#666", marginTop: 20, fontSize: 16 },
  center: { textAlign: "center", marginTop: 24, color: "#666" },
});
