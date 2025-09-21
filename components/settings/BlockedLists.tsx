import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { deleteUserBlock, getBlockedList } from "@/utils/api/profilePageApi";
import { BlockedListResponse } from "@/utils/types/profile";
import AppText from "../common/AppText";
import { getInitials } from "@/utils/util/uiHelpers";
import ScalePressable from "../common/ScalePressable";
import useAlert from "@/utils/hooks/useAlert";

interface BlockItemProps {
  item: BlockedListResponse;
}

// 단일 차단 항목 카드
const BlockItem = ({ item }: BlockItemProps) => {
  const { blockedAt, user } = item;
  const { showActionAlert, showAlert } = useAlert();
  // 날짜 포맷 간단 처리 (YYYY-MM-DD)
  const dateText = blockedAt?.slice(0, 10) ?? "";

  const handleUnblock = () => {
    showActionAlert(
      `${user.nickname}님 차단을 해제하시나요?`,
      "해제",
      async () => {
        try {
          await deleteUserBlock(user.id);
        } catch (e: any) {
          if (e) showAlert(e.response.data.message);
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
        <AppText style={styles.badge}>차단됨</AppText>
      </View>
    </ScalePressable>
  );
};

const BlockedLists = () => {
  // 차단 목록 조회
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["blockedListKey"],
    queryFn: () => getBlockedList(),
  });
  // console.log(data);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

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
        <AppText onPress={onRefresh} style={styles.retry}>
          다시 시도하기
        </AppText>
      </View>
    );
  }

  // API 타입: BlockedListResponse 단건이 아닌 목록일 가능성 고려
  // 서버가 배열을 반환한다고 가정하고 방어적으로 처리
  const items = Array.isArray(data) ? data : data ? [data] : [];
  console.log(items);
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
      renderItem={({ item }) => <BlockItem item={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
