import AppHeader from "@/components/common/AppHeader";
import AppText from "@/components/common/AppText";
import TopicSkeleton from "@/components/skeleton/TopicSkeleton";
import TicketsView from "@/components/topic/TicketsView";
import TopicCard from "@/components/topic/TopicCard";
import TopicTitle from "@/components/topic/TopicTitle";
import { getTopicRandom } from "@/utils/api/topicPageApi";
import useAlert from "@/utils/hooks/useAlert";
import { Ionicons } from "@expo/vector-icons";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const TopicPage = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  // 내부 락/타이머 레퍼런스 (리렌더 영향 X)
  const lockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["getTopicRandomKey"],
    queryFn: () => getTopicRandom(),
    placeholderData: keepPreviousData,
  });

  const [cooldown, setCooldown] = useState(false);
  const showInitSkeleton = !data && isLoading;

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
    } catch (e: any) {
      showAlert(e?.response?.data?.message ?? "주제를 불러오지 못했어요.");
    }
  }, [isFetching, refetch, showAlert]);

  return (
    <View style={styles.container}>
      <AppHeader />
      {showInitSkeleton ? (
        <TopicSkeleton />
      ) : (
        data && (
          <>
            <TicketsView />
            <TopicTitle
              onShuffle={onShuffle}
              disabled={isFetching || cooldown}
              loading={isFetching || cooldown}
            />
            <TopicCard item={data} />
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
