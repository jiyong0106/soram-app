import AppText from "@/components/common/AppText";
import {
  getConnections,
  postConnectionsAccept,
  postConnectionsReject,
} from "@/utils/api/connectionPageApi";
import {
  GetConnectionsResponse,
  GetConnectionsType,
  PostConnectionsAcceptResponse,
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
import { useOptimisticInfiniteRemove } from "@/utils/hooks/useOptimisticInfiniteRemove";
import { useRouter } from "expo-router";
import useAlert from "@/utils/hooks/useAlert";

const QUERY_KEY = ["getConnectionsKey"] as const;

const ReceivedRequests = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();

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

  // 캐시 타입
  type ConnInfinite = InfiniteData<GetConnectionsResponse>;
  type Ctx = { prev?: ConnInfinite };

  // 낙관적 제거 훅 (무한 스크롤용)
  const optimisticRemove = useOptimisticInfiniteRemove<
    GetConnectionsType,
    GetConnectionsResponse
  >(QUERY_KEY);

  // ✨ `acceptMutation`의 `onSuccess` 부분을 `ChatItem.tsx`를 참고하여 수정합니다.
  const acceptMutation = useMutation<
    PostConnectionsAcceptResponse,
    Error,
    number
  >({
    mutationFn: (connectionId: number) =>
      postConnectionsAccept({ connectionId }),

    onMutate: (id) => {
      setProcessingId(id);
    },

    onSuccess: (response) => {
      // ✨ 1. API 응답에서 상대방(요청자) 정보를 직접 사용합니다.
      const opponent = response.requester;

      showAlert(
        `${opponent.nickname}님과 대화가 연결되었어요!\n해당 주제로 이야기를 시작해보시는 건 어떠세요?☺️`,
        () => {
          // ✨ 2. ChatItem.tsx를 참고하여 올바른 경로와 파라미터로 수정합니다.
          router.push({
            pathname: "/chat/[id]",
            params: {
              id: String(response.id), // connectionId
              peerUserId: String(opponent.id), // 상대방 userId
              peerUserName: opponent.nickname, // 상대방 닉네임
              isLeave: "false", // 새로 연결되었으므로 false
              isBlocked: "false", // 새로 연결되었으므로 false
            },
          });
        }
      );

      queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },

    onError: () => {
      showAlert("요청 수락 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
      setProcessingId(id);
      return await optimisticRemove(id);
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData<ConnInfinite>(QUERY_KEY, ctx.prev);
      }
      showAlert("요청 거절 중 오류가 발생했습니다.");
    },

    onSettled: () => {
      setProcessingId(null);
    },
  });

  const onPressCardPreview = (item: GetConnectionsType) => {
    const responseId = item.requesterResponsePreview.id;
    router.push({
      pathname: "/connection/response/[id]",
      params: { id: responseId },
    });
  };

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
            onPressPreview={() => onPressCardPreview(item)}
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
