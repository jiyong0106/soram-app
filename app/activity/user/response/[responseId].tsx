import React from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import AppText from "@/components/common/AppText";
import ScalePressable from "@/components/common/ScalePressable";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import useAlert from "@/utils/hooks/useAlert";
import { postRequestConnection } from "@/utils/api/topicPageApi";
import { ConnectionStatus } from "@/utils/types/common";
import {
  RequestConnectionBody,
  RequestConnectionResponse,
} from "@/utils/types/topic";

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
    topicBoxId,
  } = useLocalSearchParams();

  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  // setTimeout을 사용하여 1초 딜레이 추가
  React.useEffect(() => {
    // 1초 후에 애니메이션을 시작하도록 타이머 설정
    const animationTimer = setTimeout(() => {
      // 1단계: 등장 애니메이션 (Pop & Fade-in)
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withSpring(1, undefined, (isFinished) => {
        // 2단계: 등장 애니메이션이 끝나면, 떠다니는 애니메이션 시작
        if (isFinished) {
          translateY.value = withRepeat(
            withSequence(
              withTiming(-5, { duration: 600 }),
              withTiming(0, { duration: 600 })
            ),
            -1,
            true
          );
        }
      });
    }, 1000); // 1000ms = 1초

    // 컴포넌트가 언마운트될 때 타이머를 정리하여 메모리 누수 방지
    return () => clearTimeout(animationTimer);
  }, []);

  // [2단계] connectionStatus에 따라 버튼의 텍스트와 비활성화 여부를 결정
  const buttonState = React.useMemo(() => {
    const status = connectionStatus as ConnectionStatus | "null" | null;

    if (status === "PENDING") {
      return {
        text: `이미 요청을 보낸 사용자입니다`,
        disabled: true,
      };
    }
    if (status === "ACCEPTED") {
      return {
        text: "이미 대화중인 사용자입니다",
        disabled: true,
      };
    }
    return {
      text: "대화 요청하기",
      disabled: false,
    };
  }, [connectionStatus]);

  const { mutate: requestConnection, isPending } = useMutation<
    RequestConnectionResponse, // onSuccess의 data 타입
    AxiosError<any>, // onError의 error 타입
    RequestConnectionBody // requestConnection에 전달될 body 타입
  >({
    mutationFn: postRequestConnection,
    // ✨ 3. [수정] onSuccess의 data 타입을 API의 실제 반환 타입인 RequestConnectionResponse로 변경합니다.
    onSuccess: (data: RequestConnectionResponse) => {
      queryClient.invalidateQueries({
        queryKey: ["getUnlockedResponsesByUser", Number(authorId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["getSentConnectionsKey"],
      });

      // UserAnswerList.tsx와 동일하게 router.push를 사용하여 채팅방으로 이동합니다.
      router.push({
        pathname: "/chat/[id]",
        params: {
          id: String(data.id),
          peerUserId: String(authorId),
          peerUserName: String(authorNickname),
          connectionInfo: JSON.stringify({
            ...data,
            opponent: {
              id: Number(authorId),
              nickname: String(authorNickname),
            },
          }),
        },
      });
    },
    onError: (error: AxiosError | any) => {
      const errorCode = error.response?.data?.errorCode;
      const message =
        error.response?.data?.message || "대화 요청에 실패했습니다.";

      // 1. errorCode에 따라 분기합니다.
      if (errorCode === "RESPONSE_REQUIRED") {
        // 1-1. '답변 부재' 에러: 기존 로직과 동일하게 답변 작성 페이지로 유도
        showActionAlert(
          message, // 서버에서 온 메시지를 그대로 사용
          `이야기 남기기`,
          () => {
            router.push({
              pathname: "/topic/list/[listId]",
              params: { listId: String(topicBoxId), error: "forbidden" },
            });
          }
        );
      } else if (errorCode === "INSUFFICIENT_TICKETS") {
        // 1-2. '재화 부족' 에러: 재화가 부족하다는 알림
        // TODO: 향후 '충전하러 가기'와 같은 Action 추가하여 UX 개선
        showAlert(message);
      } else {
        // 2. 그 외 모든 에러는 기존과 동일하게 서버 메시지를 그대로 표시
        showAlert(message);
      }
    },
  });

  const handleRequestConnection = () => {
    if (!authorId || !responseId) return;
    showActionAlert(
      `대화를 요청할까요?\n\n대화 요청권 1개를 사용합니다.`,
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
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
          </View>
          {!buttonState.disabled && ( // 대화 요청이 가능할 때만 말풍선을 보여줍니다.
            <Animated.View
              style={[styles.speechBubbleContainer, bubbleAnimatedStyle]}
            >
              <View style={styles.speechBubble}>
                <AppText style={styles.bubbleText}>
                  이야기가 와닿으셨다면 대화를 요청해 보세요!
                </AppText>
                <AppText style={[styles.bubbleText, { fontWeight: "bold" }]}>
                  어쩌면, 새로운 인연의 시작일지도 몰라요 😉
                </AppText>
                <View style={styles.bubbleTail} />
              </View>
            </Animated.View>
          )}
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
  speechBubbleContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12, // 버튼 컨테이너와의 간격
  },
  speechBubble: {
    backgroundColor: "#F7F5F4", // 기존 배경과 어울리는 부드러운 색상
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: "relative", // 꼬리 위치 조정을 위해
  },
  bubbleText: {
    textAlign: "center",
    fontSize: 14,
    color: "#5C4B44",
    lineHeight: 20,
  },
  bubbleTail: {
    position: "absolute",
    bottom: -7, // 몸체와 살짝 겹치도록
    alignSelf: "center",
    width: 14,
    height: 14,
    backgroundColor: "#F7F5F4",
    transform: [{ rotate: "45deg" }],
  },
});
