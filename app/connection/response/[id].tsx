import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import instance from "@/utils/api/axios";
import { UserAnswerResponse } from "@/utils/types/topic";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import AppText from "@/components/common/AppText";
import UserAnswerList from "@/components/topic/UserAnswerList";
import { backHeaderOptions } from "@/components/common/backbutton";

// --- API ---
type VoiceResponseDetail = UserAnswerResponse & {
  topicBox: { title: string };
};

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
    <>
      {/* 👇 2. Stack.Screen을 최상단으로 이동시킵니다. */}
      <Stack.Screen
        options={{
          ...backHeaderOptions,
          title: `${responseData.user.nickname}님의 이야기`,
          headerTitleStyle: {
            color: "#5C4B44", // 원하는 색상 코드를 입력하세요.
            fontWeight: "bold", // 폰트 두께 등 다른 스타일도 가능합니다.
          },
        }}
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <UserAnswerList
              item={responseData}
              title={responseData.topicBox.title}
              showActions={false}
            />
          </View>
          <View style={styles.center}>
            <AppText style={styles.promptText1}>
              이야기가 와닿으셨다면 대화를 시작해보세요!
            </AppText>
            <AppText style={styles.promptText2}>
              어쩌면, 새로운 인연의 시작일지도 몰라요 ☺️
            </AppText>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default VoiceResponseDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  promptText1: {
    color: "#5C4B44",
    fontSize: 14,
    marginVertical: 6,
  },
  promptText2: {
    color: "#5C4B44",
    fontSize: 14,
    marginVertical: 6,
    fontWeight: "bold",
  },
});
