import React from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import AppText from "@/components/common/AppText";
import ScalePressable from "@/components/common/ScalePressable";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import useAlert from "@/utils/hooks/useAlert";
import { postRequestConnection } from "@/utils/api/topicPageApi";
import { ConnectionStatus } from "@/utils/types/common";

const UnlockedResponseDetailScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showAlert, showActionAlert } = useAlert();

  const {
    responseId,
    authorId,
    authorNickname,
    topicTitle,
    textContent,
    createdAt,
    connectionStatus, // [1단계] 이전 화면에서 전달받은 connectionStatus
  } = useLocalSearchParams();

  // [2단계] connectionStatus에 따라 버튼의 텍스트와 비활성화 여부를 결정
  const buttonState = React.useMemo(() => {
    const status = connectionStatus as ConnectionStatus | "null" | null;

    if (status === "PENDING") {
      return {
        text: `이미 요청을 보내셨어요!`,
        disabled: true,
      };
    }
    if (status === "ACCEPTED") {
      return {
        text: "이미 대화방이 있어요!",
        disabled: true,
      };
    }
    return {
      text: "대화 요청하기",
      disabled: false,
    };
  }, [connectionStatus]);

  const { mutate: requestConnection, isPending } = useMutation({
    mutationFn: postRequestConnection,
    onSuccess: (data) => {
      // 대화 요청 후에는 이전 화면의 연결 상태가 바뀌었을 것이므로,
      // 관련 쿼리를 무효화하여 돌아갔을 때 최신 상태를 볼 수 있도록 합니다.
      queryClient.invalidateQueries({
        queryKey: ["getUnlockedResponsesByUser", Number(authorId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["getSentConnectionsKey"],
      });

      const successMessage =
        data.status === "ACCEPTED"
          ? "이미 대화방이 있어요!"
          : `대화 요청 완료!\n\n${authorNickname}님이 수락하면 알림을 보내드릴게요.`;
      showAlert(successMessage, () => {
        router.back();
      });
    },
    onError: (error: AxiosError | any) => {
      const message =
        error.response?.data?.message || "대화 요청에 실패했습니다.";

      if (error.response?.data?.statusCode === 403) {
        showActionAlert(
          "대화를 요청하려면 이 주제에 대한 나의 답변이 먼저 필요해요. 지금 바로 내 이야기를 남겨볼까요?",
          "이야기 남기기",
          () => {
            console.log("답변 남기기 화면으로 이동");
          }
        );
        return;
      }
      showAlert(message);
    },
  });

  const handleRequestConnection = () => {
    if (!authorId || !responseId) return;
    showActionAlert(
      `대화를 요청할까요?\n\n${authorNickname}님이 요청을 수락하면\n\n대화 요청권이 1개 차감됩니다.`,
      "요청하기",
      () => {
        requestConnection({
          addresseeId: Number(authorId),
          voiceResponseId: Number(responseId),
        });
      }
    );
  };

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{
          title: `${authorNickname || "사용자"}님의 이야기`,
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <View style={styles.pageWrapper}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.titleWrapper}>
              <AppText style={styles.questionHighlight}>Q.</AppText>
              <AppText style={styles.title}>{topicTitle}</AppText>
            </View>

            <AppText style={styles.content}>{textContent}</AppText>

            <AppText style={styles.nick}>- {authorNickname}</AppText>

            <AppText style={styles.meta}>
              {new Date(
                Array.isArray(createdAt) ? createdAt[0] : createdAt
              ).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              에 남긴 이야기
            </AppText>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <ScalePressable
            // [3단계] 결정된 버튼 상태를 UI에 적용
            style={[
              styles.buttonBase,
              buttonState.disabled
                ? styles.disabledButton
                : styles.requestButton,
            ]}
            onPress={handleRequestConnection}
            disabled={isPending || buttonState.disabled}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText
                style={
                  buttonState.disabled
                    ? styles.disabledButtonText
                    : styles.requestButtonText
                }
              >
                {buttonState.text}
              </AppText>
            )}
          </ScalePressable>
        </View>
      </View>
    </PageContainer>
  );
};

export default UnlockedResponseDetailScreen;

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 0,
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
    fontSize: 16,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: "#5C4B44",
  },
  nick: {
    alignSelf: "flex-end",
    marginTop: 24,
    marginRight: 4,
    color: "#5C4B44",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  meta: {
    alignSelf: "flex-end",
    color: "#B0A6A0",
    marginTop: 8,
    fontSize: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  buttonBase: {
    flexDirection: "row",
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  requestButton: {
    backgroundColor: "#FF6B3E",
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // [4단계] 비활성화된 버튼을 위한 스타일 추가
  disabledButton: {
    backgroundColor: "#D9D9D9",
  },
  disabledButtonText: {
    color: "#B0A6A0",
    fontWeight: "bold",
    fontSize: 16,
  },
});
