import { FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import UserAnswerList from "@/components/topic/UserAnswerList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserAnswer } from "@/utils/api/topicPageApi";
import { UserAnswerResponse } from "@/utils/types/topic";
import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";
import Spin from "@/components/common/Spin";
import useAlert from "@/utils/hooks/useAlert";
import { isAxiosError } from "axios";
import type { AxiosError } from "axios";
import ScalePressable from "@/components/common/ScalePressable";

const UserAnswerPage = () => {
  const { topicId, title } = useLocalSearchParams();
  const [cooldown, setCooldown] = useState(false);
  const { showAlert } = useAlert();
  const isShuffleRef = useRef(false);

  const { data, refetch, isFetching } = useQuery<
    UserAnswerResponse[],
    AxiosError
  >({
    queryKey: ["getUserAnswerKey", topicId],
    queryFn: () => getUserAnswer({ topicId: topicId as string }),
    enabled: !!topicId,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
    // 조건부 재시도: onShuffle 중엔 재시도 OFF, 그 외엔 1번만 재시도
    retry: (failureCount, err) => {
      // 4xx는 원래도 재시도 안 하는게 UX 좋음
      const s = err?.response?.status;
      if (s && s >= 400 && s < 500) return false;
      // onShuffle 시도 중이면 재시도 금지 → 1번만 요청
      if (isShuffleRef.current) return false;
      // 그 외(초기 로딩 등)에는 1회 재시도 허용
      return failureCount < 1; // (= retry: 1)
    },
  });

  const lockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onShuffle = useCallback(async () => {
    // 1) 네트워크 로딩 중이거나 쿨다운 중이면 무시
    if (isFetching || lockRef.current) return;

    // 2) 쿨다운 시작
    lockRef.current = true;
    setCooldown(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      lockRef.current = false;
      setCooldown(false);
    }, 1000);

    // 3) 호출
    try {
      await refetch({ throwOnError: true });
    } catch (e) {
      const msg = isAxiosError(e)
        ? e.response?.data?.message ?? e.message
        : (e as Error).message;
      showAlert(msg);
    } finally {
      isShuffleRef.current = false; //  원상복구
    }
  }, [isFetching, refetch, showAlert]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        renderItem={({ item }) => <UserAnswerList item={item} title={title} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListHeaderComponent={
          <AppText style={styles.remainText}>오늘 남은 이야기 1 / 10</AppText>
        }
        ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
        ListFooterComponent={
          <ScalePressable style={styles.moreTopicWrapper} onPress={onShuffle}>
            {isFetching || cooldown ? (
              <Spin active duration={800}>
                <Ionicons name="reload" size={16} color="#FF6B3E" />
              </Spin>
            ) : (
              <>
                <AppText style={styles.moreTopic}>다른 이야기 보기</AppText>
                <Ionicons name="reload" size={15} color="#8E8E8E" />
              </>
            )}
          </ScalePressable>
        }
        ListEmptyComponent={<AppText style={styles.empty}>답변 없음</AppText>}
      />
    </View>
  );
};

export default UserAnswerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
  remainText: {
    textAlign: "center",
    marginTop: 12,

    color: "#8E8E8E",
    fontSize: 13,
    marginLeft: "auto",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },

  moreTopicWrapper: {
    marginHorizontal: "auto",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  moreTopic: {
    textAlign: "center",
    fontSize: 13,
    color: "#8E8E8E",
  },
});
