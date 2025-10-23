import React from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import AppText from "@/components/common/AppText";
import { getMyVoiceResponseDetail } from "@/utils/api/activityPageApi";
import { GetMyVoiceResponseDetailResponse } from "@/utils/types/activity";
import useAlert from "@/utils/hooks/useAlert";
import ScalePressable from "../common/ScalePressable";
import { Ionicons } from "@expo/vector-icons";

const MyResponseDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showActionAlert } = useAlert();

  // 한글 주석: React Query 기반으로 상세 데이터를 조회하고, 캐시를 재사용합니다.
  const responseId = Number(Array.isArray(id) ? id[0] : id);
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<GetMyVoiceResponseDetailResponse | undefined>({
    queryKey: ["myVoiceResponseDetail", responseId],
    queryFn: async () => {
      if (!Number.isFinite(responseId)) return undefined;
      return await getMyVoiceResponseDetail(responseId);
    },
    enabled: Number.isFinite(responseId),
    staleTime: 30 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleEdit = () => {
    if (!response) return;
    // id가 배열이면 첫 번째 요소를, 아니면 id 그대로 사용합니다.
    const responseId = Array.isArray(id) ? id[0] : id;
    if (!responseId) return;
    router.push({
      pathname: "/activity/[id]/edit",
      params: {
        id: responseId,
        topicId: response.topicBox.id,
        initialContent: response.textContent,
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !response) {
    return (
      <View style={styles.centered}>
        <AppText>{"데이터를 찾을 수 없습니다."}</AppText>
      </View>
    );
  }

  return (
    <View style={styles.pageWrapper}>
      <ScrollView>
        <View style={styles.container}>
          {/* 질문 말풍선 카드 */}
          <View style={styles.titleWrapper}>
            <View></View>
            <AppText style={styles.questionHighlight}>Q.</AppText>
            <AppText style={styles.title}>{response.topicBox.title}</AppText>
          </View>

          {/* 내 답변 내용 */}
          <AppText style={styles.content}>{response.textContent}</AppText>

          {/* 작성일 (오른쪽 정렬) */}
          <AppText style={styles.meta}>
            {new Date(response.updatedAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            에 작성한 이야기
          </AppText>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ScalePressable
          style={[styles.buttonBase, styles.editButton]}
          onPress={handleEdit}
        >
          <AppText style={styles.editButtonText}>수정하기</AppText>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#FF7D4A"
            style={styles.editButtonIcon}
          />
        </ScalePressable>
      </View>
    </View>
  );
};

export default MyResponseDetail;

const styles = StyleSheet.create({
  // --- 기존 스타일 (변경 없음) ---
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    // 카드 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    // 말풍선도 살짝 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#5C4B44",
  },
  questionHighlight: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5C4B44",
  },
  meta: {
    alignSelf: "flex-end",
    color: "#B0A6A0",
    marginTop: 24,
    fontSize: 12,
  },

  // --- 레이아웃과 버튼을 위한 스타일 ---
  pageWrapper: {
    // flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  // --- TopicListSheet의 ctaBase 스타일을 그대로 적용 ---
  buttonBase: {
    flexDirection: "row",
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#FF6B3E",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: "#FF6B3E",
    fontWeight: "bold",
  },
  editButtonIcon: {
    position: "absolute",
    right: 20,
  },
});
