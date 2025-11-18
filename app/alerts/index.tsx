import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PageContainer from "@/components/common/PageContainer";
import { Stack, useFocusEffect } from "expo-router";
import { BackButton } from "@/components/common/backbutton";
import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  patchNotificationRead,
  patchNotificationsReadAll,
} from "@/utils/api/notificationApi";
import type { NotificationListItem } from "@/utils/types/auth";
import AlertItem from "@/components/alerts/AlertItem";
import { useNotificationStore } from "@/utils/store/useNotificationStore";

const AlertsPage = () => {
  // 무한스크롤 데이터 로딩
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const setHasUnread = useNotificationStore((s) => s.setHasUnread);

  // 화면 포커스/블러 시 안읽음 상태 갱신
  useFocusEffect(
    useCallback(() => {
      return () => {
        // 화면을 벗어날 때 안읽음 상태를 다시 체크
        const checkUnread = async () => {
          try {
            const response = await getNotifications({ take: 1 });
            const hasUnreadNotification = response.data.some(
              (notification) => !notification.isRead
            );
            setHasUnread(hasUnreadNotification);
          } catch (error) {
            if (__DEV__)
              console.error("Failed unread notifications");
          }
        };
        checkUnread();
      };
    }, [setHasUnread])
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["getNotificationsKey"],
    queryFn: ({ pageParam }) =>
      getNotifications({ take: 10, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.endCursor : undefined,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  const items: NotificationListItem[] = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data]
  );

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  // 알림 탭 시 라우팅/읽음 처리
  const handlePressItem = useCallback(
    async (item: NotificationListItem) => {
      try {
        if (!item.isRead) {
          await patchNotificationRead(item.id);
          // 낙관적 반영 대신 서버 신뢰 리프레시
          await qc.invalidateQueries({ queryKey: ["getNotificationsKey"] });
        }
        // 타입에 따른 라우팅은 후속 단계에서 분리된 네비게이터로 연결
        // 예: NEW_CHAT_MESSAGE/CONNECTION_ACCEPTED => chat/[referenceId]
        // NEW_CONNECTION_REQUEST => 요청 상세 화면
      } catch (e) {
        // 에러는 조용히 무시하고 리스트는 유지
      }
    },
    [qc]
  );

  const handleReadAll = useCallback(async () => {
    try {
      await patchNotificationsReadAll();
      await qc.invalidateQueries({ queryKey: ["getNotificationsKey"] });
    } catch {}
  }, [qc]);

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: "알림",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          headerRight: () => (
            <TouchableOpacity onPress={handleReadAll} disabled={isLoading}>
              <Text style={styles.readAll}>모두 읽기</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => (
            <AlertItem item={item} onPress={handlePressItem} />
          )}
          onEndReached={() =>
            hasNextPage && !isFetchingNextPage ? fetchNextPage() : undefined
          }
          onEndReachedThreshold={0.6}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 10 }}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>새로운 알림이 없어요</Text>
              </View>
            ) : null
          }
        />
      </View>
    </PageContainer>
  );
};

export default AlertsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  readAll: {
    color: "#5C4B44",
    fontSize: 14,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: "#8A7F79",
    fontSize: 14,
  },
});
