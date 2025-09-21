import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteUserBlock, getBlockedList } from "@/utils/api/profilePageApi";
import { BlockedListResponse, BlockedListType } from "@/utils/types/profile";
import AppText from "../common/AppText";
import { getInitials } from "@/utils/util/uiHelpers";
import ScalePressable from "../common/ScalePressable";
import useAlert from "@/utils/hooks/useAlert";

interface BlockItemProps {
  item: BlockedListType;
}

// 단일 차단 항목 카드
const BlockItem = ({ item }: BlockItemProps) => {
  const { blockedAt, user } = item;
  const { showActionAlert, showAlert } = useAlert();
  // 날짜 포맷 간단 처리 (YYYY-MM-DD)
  const dateText = blockedAt?.slice(0, 10) ?? "";
  const queryClient = useQueryClient();

  // 낙관적 업데이트: 차단 해제 시 즉시 리스트에서 제거, 실패 시 롤백
  const { mutate: unblock } = useMutation({
    mutationFn: (userId: number) => deleteUserBlock(userId),
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ["blockedListKey"] });
      const previous = queryClient.getQueryData(["blockedListKey"]);
      const next = (() => {
        const data = queryClient.getQueryData<any>(["blockedListKey"]);
        if (!data) return data;
        if (data.pages) {
          return {
            ...data,
            pages: data.pages.map((p: BlockedListResponse) => ({
              ...p,
              data: p.data.filter((i) => i.user.id !== userId),
            })),
          };
        }
        return data;
      })();
      queryClient.setQueryData(["blockedListKey"], next);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["blockedListKey"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedListKey"] });
    },
  });

  const handleUnblock = () => {
    showActionAlert(
      `${user.nickname}님 차단을 해제하시나요?`,
      "해제",
      async () => {
        try {
          unblock(user.id);
        } catch (e: any) {
          if (e)
            showAlert(e.response?.data?.message ?? "차단 해제에 실패했습니다.");
        }
      }
    );
  };

  return (
    <ScalePressable style={styles.itemCard} onPress={handleUnblock}>
      <View style={styles.avatar}>
        <AppText style={styles.avatarText}>
          {getInitials(user?.nickname)}
        </AppText>
      </View>
      <View style={styles.itemContent}>
        <AppText style={styles.itemTitle}>{user.nickname}</AppText>
        <AppText style={styles.itemSubtitle}>{`차단일: ${dateText}`}</AppText>
      </View>
      <View style={styles.badgeWrap}>
        <AppText style={styles.badge}>차단</AppText>
      </View>
    </ScalePressable>
  );
};

const BlockedLists = () => {
  const queryClient = useQueryClient();

  // 무한스크롤 쿼리
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery<BlockedListResponse>({
    queryKey: ["blockedListKey"],
    queryFn: ({ pageParam }) =>
      getBlockedList({ take: 10, cursor: pageParam as number | undefined }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  // 병합된 리스트 아이템
  const items: BlockedListType[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  // 풀투리프레시: 캐시 무효화로 초기 로드부터 다시 가져오기
  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["blockedListKey"] });
  }, [queryClient]);

  // 중복 호출 방지를 위한 락
  const loadingMoreRef = useRef(false);
  const onEndReached = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    try {
      await fetchNextPage();
    } finally {
      loadingMoreRef.current = false;
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    // 로딩 상태: 인디케이터 중앙 배치
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <AppText style={styles.loadingText}>차단 목록을 불러오는 중…</AppText>
      </View>
    );
  }

  if (isError) {
    // 에러 상태: 간단 안내 및 재시도 버튼 UX 대체 텍스트
    return (
      <View style={styles.centered}>
        <AppText style={styles.errorTitle}>목록을 가져오지 못했어요</AppText>
        <AppText style={styles.errorSub}>
          네트워크 상태를 확인한 후 다시 시도해주세요.
        </AppText>
        <AppText onPress={() => refetch()} style={styles.retry}>
          다시 시도하기
        </AppText>
      </View>
    );
  }

  if (!items.length) {
    // 빈 상태
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon} />
        <AppText style={styles.emptyTitle}>차단한 사용자가 없어요</AppText>
        <AppText style={styles.emptySub}>
          불쾌한 유저를 만나면 언제든 차단할 수 있어요.
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.user.id)}
      contentContainerStyle={styles.listContainer}
      refreshing={isRefetching}
      onRefresh={onRefresh}
      renderItem={({ item }) => <BlockItem item={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={{ paddingVertical: 16 }}>
            <ActivityIndicator color="#4F46E5" />
          </View>
        ) : null
      }
    />
  );
};

export default BlockedLists;

const styles = StyleSheet.create({
  // 화면 공통 배경에 맞춘 여백/컬러
  listContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },
  errorSub: {
    color: "#6B7280",
    marginBottom: 12,
  },
  retry: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  emptySub: {
    marginTop: 4,
    color: "#6B7280",
  },
  separator: {
    height: 12,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ff6b6b",
    fontWeight: "800",
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },
  itemSubtitle: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
  },
  badgeWrap: {
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "bold",
    fontSize: 12,
  },
});
