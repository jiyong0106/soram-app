import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

import AppText from "@/components/common/AppText";
import UserAnswerList from "@/components/topic/UserAnswerList";
import ScalePressable from "@/components/common/ScalePressable";
import EmptyState from "@/components/common/EmptyState";
import useAlert from "@/utils/hooks/useAlert";
import { getUserAnswer } from "@/utils/api/topicPageApi";
import { UserAnswerResponse } from "@/utils/types/topic";
import { Ionicons } from "@expo/vector-icons";
import useMinDelay from "@/utils/hooks/useMinDelay";
import FindingAnswersOverlay from "@/components/topic/FindingAnswersOverlay";
import useTicketGuard from "@/utils/hooks/useTicketGuard";

const OVERLAY_FADE_MS = 220;
const MIN_SHUFFLE_MS = 3000;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const UserAnswerPage = () => {
  const { topicId, title } = useLocalSearchParams();
  const { showAlert } = useAlert();
  const [shuffleOverlay, setShuffleOverlay] = useState(false);
  const [forceEmpty, setForceEmpty] = useState(false);
  const [suppressList, setSuppressList] = useState(false); // 플리커 방지용
  const router = useRouter();

  // 초기 3초
  const minElapsed = useMinDelay(MIN_SHUFFLE_MS);

  // 데이터
  const { data, refetch, isFetching, isSuccess, isError, error } = useQuery<
    UserAnswerResponse[],
    AxiosError
  >({
    queryKey: ["getUserAnswerKey", topicId],
    queryFn: () => getUserAnswer({ topicId: topicId as string }),
    enabled: !!topicId,
    staleTime: 60 * 1000,
    retry: (failureCount, err) => {
      const s = err?.response?.status;
      if (s && s >= 400 && s < 500) return false;
      return failureCount < 1;
    },
  });

  // 비관적 차감: 페이지 진입이 성공(isSuccess)한 첫 시점에 1장 차감
  const { ensure } = useTicketGuard("VIEW_RESPONSE", { optimistic: false });
  const [deducted, setDeducted] = useState(false);

  useEffect(() => {
    if (!deducted && isSuccess) {
      ensure(() => setDeducted(true));
    }
  }, [deducted, isSuccess, ensure]);

  const initialReady = minElapsed && (isSuccess || isError);
  const dataForRender = forceEmpty ? [] : data ?? [];

  const onShuffle = useCallback(async () => {
    if (isFetching) return;

    setShuffleOverlay(true);
    setSuppressList(true); // ✅ 리스트 잠깐 숨김
    setForceEmpty(false);

    const startedAt = Date.now();

    try {
      const result = await refetch({ throwOnError: true });
      const next = result.data ?? [];

      const elapsed = Date.now() - startedAt;
      const remain = Math.max(0, MIN_SHUFFLE_MS - elapsed);
      if (remain) await delay(remain);

      setShuffleOverlay(false);
      await delay(OVERLAY_FADE_MS + 20);

      if (!next.length) {
        showAlert(
          "조회 가능한 답변이 없어요. 주제를 바꿔보거나 새 답변을 남겨보세요."
        );
        setForceEmpty(true);
      }
    } catch (e) {
      const elapsed = Date.now() - startedAt;
      const remain = Math.max(0, MIN_SHUFFLE_MS - elapsed);
      if (remain) await delay(remain);

      setShuffleOverlay(false);
      await delay(OVERLAY_FADE_MS + 20);

      const msg = isAxiosError(e)
        ? e.response?.data?.message ?? e.message
        : (e as Error).message;

      showAlert(msg);
      setForceEmpty(true);
    } finally {
      setSuppressList(false); // ✅ 최종 단계에서만 다시 보이기
    }
  }, [isFetching, refetch, showAlert]);

  return (
    <View style={styles.container}>
      {initialReady &&
        !suppressList && ( // ✅ 숨김 중에는 리스트 렌더 안 함
          <FlatList
            data={dataForRender}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <UserAnswerList item={item} title={title} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
            ListFooterComponent={
              isError ? (
                <ScalePressable
                  style={styles.moreTopicWrapper}
                  onPress={() => router.push("/topic/list")}
                >
                  <AppText style={styles.moreTopic}>다른 주제 보기</AppText>
                  <Ionicons name="reload" size={15} color="#8E8E8E" />
                </ScalePressable>
              ) : (
                <ScalePressable
                  style={styles.moreTopicWrapper}
                  onPress={onShuffle}
                >
                  <AppText style={styles.moreTopic}>다른 이야기 보기</AppText>
                  <Ionicons name="reload" size={15} color="#8E8E8E" />
                </ScalePressable>
              )
            }
            ListEmptyComponent={
              <EmptyState
                title="조회 가능한 답변이 없어요"
                subtitle="주제를 바꿔보거나 새 답변을 남겨보세요."
                onPressAction={onShuffle}
                loading={isFetching}
              />
            }
          />
        )}

      <FindingAnswersOverlay
        visible={!initialReady || shuffleOverlay}
        text="답변을 찾는 중이에요"
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
  listContent: {
    gap: 10,
    padding: 10,
  },
  remainText: {
    textAlign: "center",
    marginTop: 12,
    color: "#8E8E8E",
    fontSize: 13,
    marginLeft: "auto",
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
