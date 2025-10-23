import AppHeader from "@/components/common/AppHeader";
import AppText from "@/components/common/AppText";
import TopicSkeleton from "@/components/skeleton/TopicSkeleton";
import TicketsView from "@/components/topic/TicketsView";
import TopicCard from "@/components/topic/TopicCard";
import TopicTitle from "@/components/topic/TopicTitle";
import { getTopicRandom } from "@/utils/api/topicPageApi";
import useAlert from "@/utils/hooks/useAlert";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// ✨ 1. 최소 로딩 시간을 상수로 정의합니다 (800ms = 0.8초).
const MIN_SHUFFLE_DURATION = 800;

const TopicPage = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const { token } = useAuthStore();
  // ✨ 2. 기존 cooldown, lockRef, timerRef 대신 'isShuffling' 상태 하나로 관리합니다.
  const [isShuffling, setIsShuffling] = useState(false);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["getTopicRandomKey"],
    queryFn: () => getTopicRandom(),
    placeholderData: keepPreviousData,
    enabled: false,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const showInitSkeleton = !data && isLoading;

  // ✨ 3. onShuffle 함수를 Promise.all을 사용하는 방식으로 완전히 교체합니다.
  const onShuffle = useCallback(async () => {
    if (isShuffling) return; // 이미 셔플 중이면 중복 실행 방지

    setIsShuffling(true);

    try {
      // 두 개의 비동기 작업을 준비합니다.
      const refetchPromise = refetch({ throwOnError: true });
      const delayPromise = new Promise((resolve) =>
        setTimeout(resolve, MIN_SHUFFLE_DURATION)
      );

      // '데이터 리프레시'와 '최소 시간 지연'이 모두 끝날 때까지 기다립니다.
      await Promise.all([refetchPromise, delayPromise]);
    } catch (e: any) {
      showAlert(e?.response?.data?.message ?? "주제를 불러오지 못했어요.");
    } finally {
      // 모든 작업이 끝나면 로딩 상태를 해제합니다.
      setIsShuffling(false);
    }
  }, [isShuffling, refetch, showAlert]);

  return (
    <View style={styles.container}>
      <AppHeader />
      {showInitSkeleton ? (
        <TopicSkeleton />
      ) : (
        data && (
          <>
            <TicketsView />
            {/* ✨ 4. loading과 disabled prop에 isShuffling을 전달합니다. */}
            <TopicTitle
              onShuffle={onShuffle}
              disabled={isShuffling}
              loading={isShuffling}
            />
            <TopicCard item={data} loading={isShuffling} />
            <TouchableOpacity
              onPress={() => router.push("/topic/list")}
              activeOpacity={0.5}
              style={styles.moreTopic}
            >
              <AppText style={styles.moreTopicText}>
                더 다양한 주제 보러가기
              </AppText>
              <Ionicons
                name="chevron-forward-outline"
                size={14}
                color="#5C4B44"
              />
            </TouchableOpacity>
          </>
        )
      )}
    </View>
  );
};

export default TopicPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  moreTopic: {
    alignSelf: "center",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  moreTopicText: {
    fontSize: 14,
    color: "#5C4B44",
  },
});
