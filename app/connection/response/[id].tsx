import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

// 👇 [수정됨] 올바른 경로와 이름으로 API 인스턴스를 가져옵니다.
import instance from "@/utils/api/axios";
import { UserAnswerResponse } from "@/utils/types/topic";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import AppText from "@/components/common/AppText";
import UserAnswerList from "@/components/topic/UserAnswerList";

// --- API ---
type VoiceResponseDetail = UserAnswerResponse & {
  topicBox: { title: string };
};

// 👇 [수정됨] authClient 대신 'instance'를 사용합니다.
const getVoiceResponseById = async (
  voiceResponseId: string
): Promise<VoiceResponseDetail[]> => {
  const { data } = await instance.get(`/voices/response/${voiceResponseId}`);
  return data;
};

// --- Screen Component ---
const VoiceResponseDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery<
    VoiceResponseDetail[],
    AxiosError
  >({
    queryKey: ["getVoiceResponseById", id],
    queryFn: () => getVoiceResponseById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !data || data.length === 0) {
    return (
      <View style={styles.center}>
        <AppText>답변을 불러오는 데 실패했어요.</AppText>
      </View>
    );
  }

  const responseData = data[0];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: responseData.topicBox.title }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <UserAnswerList
            item={responseData}
            title={responseData.topicBox.title}
            showActions={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default VoiceResponseDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFB",
  },
  content: {
    padding: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
