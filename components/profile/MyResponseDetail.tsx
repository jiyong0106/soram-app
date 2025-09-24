// app/components/profile/MyResponseDetail.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AppText from "@/components/common/AppText";
import { getMyVoiceResponseDetail } from "@/utils/api/profilePageApi";
import { GetMyVoiceResponseDetailResponse } from "@/utils/types/profile";

const MyResponseDetail = () => {
  const { id } = useLocalSearchParams();
  const [response, setResponse] =
    useState<GetMyVoiceResponseDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [id]);

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
  );
};

export default MyResponseDetail;

const styles = StyleSheet.create({
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
});
