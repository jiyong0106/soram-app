import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import AppText from "@/components/common/AppText";
import { getMyVoiceResponseDetail } from "@/utils/api/profilePageApi";
import { GetMyVoiceResponseDetailResponse } from "@/utils/types/profile";
import useAlert from "@/utils/hooks/useAlert";
import ScalePressable from "../common/ScalePressable";
import { Ionicons } from "@expo/vector-icons";

const MyResponseDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showActionAlert } = useAlert();

  const [response, setResponse] =
    useState<GetMyVoiceResponseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. 기존 useEffect를 useFocusEffect로 교체합니다.
  useFocusEffect(
    useCallback(() => {
      const responseId = Number(id);
      if (!responseId) {
        setError("유효하지 않은 접근입니다.");
        setLoading(false);
        return;
      }

      const fetchResponseDetail = async () => {
        try {
          setLoading(true);
          const result = await getMyVoiceResponseDetail(responseId);
          setResponse(result);
        } catch (err) {
          setError("답변을 불러오는 데 실패했습니다.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchResponseDetail();

      // useFocusEffect는 cleanup 함수를 반환할 수 있습니다. (필요 없을 경우 비워둠)
      return () => {};
    }, [id]) // 의존성 배열은 그대로 유지합니다.
  );

  const handleEdit = () => {
    if (!response) return;
    // --- 👇 [수정] 이 부분을 추가하여 id 타입을 명확히 합니다. ---
    // id가 배열이면 첫 번째 요소를, 아니면 id 그대로 사용합니다.
    const responseId = Array.isArray(id) ? id[0] : id; // 👈 안전한 responseId 생성
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !response) {
    return (
      <View style={styles.centered}>
        <AppText>{error || "데이터를 찾을 수 없습니다."}</AppText>
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
