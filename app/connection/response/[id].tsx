import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import instance from "@/utils/api/axios";
import { UserAnswerResponse } from "@/utils/types/topic";
import {
  postConnectionsAccept,
  postConnectionsReject,
} from "@/utils/api/connectionPageApi";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import AppText from "@/components/common/AppText";
import UserAnswerList from "@/components/topic/UserAnswerList";
import { backHeaderOptions } from "@/components/common/backbutton";
import Button from "@/components/common/Button";
import useAlert from "@/utils/hooks/useAlert";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
} from "react-native-reanimated";

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
  const { id, connectionId } = useLocalSearchParams<{
    id: string;
    connectionId: string;
  }>();

  const router = useRouter();
  const queryClient = useQueryClient();
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // 1. useAlert 훅에서 showActionAlert를 가져옵니다.
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  const { showAlert, showActionAlert } = useAlert();
  const [isProcessing, setIsProcessing] = useState(false);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  React.useEffect(() => {
    const animationTimer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withSpring(1, undefined, (isFinished) => {
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
    }, 1000);

    return () => clearTimeout(animationTimer);
  }, []);

  const { data, isLoading, isError } = useQuery<
    VoiceResponseDetail[],
    AxiosError
  >({
    queryKey: ["getVoiceResponseById", id],
    queryFn: () => getVoiceResponseById(id!),
    enabled: !!id,
  });

  const acceptMutation = useMutation({
    mutationFn: (connId: number) =>
      postConnectionsAccept({ connectionId: connId }),
    onSuccess: (response) => {
      showAlert(
        `${response.requester.nickname}님과 대화가 연결되었어요!`,
        () => {
          queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
          queryClient.invalidateQueries({ queryKey: ["getConnectionsKey"] });
          router.replace({
            pathname: "/chat/[id]",
            params: {
              id: String(response.id),
              peerUserId: String(response.requester.id),
              peerUserName: response.requester.nickname,
              isLeave: "false",
              isBlocked: "false",
            },
          });
        }
      );
    },
    onError: () => showAlert("요청 수락 중 오류가 발생했습니다."),
    onSettled: () => setIsProcessing(false),
  });

  const rejectMutation = useMutation({
    mutationFn: (connId: number) =>
      postConnectionsReject({ connectionId: connId }),
    onSuccess: () => {
      showAlert("요청을 거절했어요.", () => {
        queryClient.invalidateQueries({ queryKey: ["getConnectionsKey"] });
        router.back();
      });
    },
    onError: () => showAlert("요청 거절 중 오류가 발생했습니다."),
    onSettled: () => setIsProcessing(false),
  });

  const handleAccept = () => {
    if (!connectionId || isProcessing) return;
    showActionAlert(`요청을 수락할까요?`, "수락", () => {
      setIsProcessing(true);
      acceptMutation.mutate(Number(connectionId));
    });
  };

  const handleReject = () => {
    if (!connectionId || isProcessing) return;
    showActionAlert("거절하시겠습니까?", "거절", () => {
      setIsProcessing(true);
      rejectMutation.mutate(Number(connectionId));
    });
  };

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
      <Stack.Screen
        options={{
          ...backHeaderOptions,
          title: `${responseData.user.nickname}님의 이야기`,
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
        </ScrollView>
        <View style={styles.bottomActionContainer}>
          <Animated.View
            style={[styles.speechBubbleContainer, bubbleAnimatedStyle]}
          >
            <View style={styles.speechBubble}>
              <AppText style={styles.bubbleText}>
                이야기가 와닿으셨다면 대화를 시작해보세요😉
              </AppText>
              <View style={styles.bubbleTail} />
            </View>
          </Animated.View>
          <Button
            label="수락하기"
            color="#FF7D4A"
            textColor="#FFFFFF"
            style={styles.btnEmphasis}
            onPress={handleAccept}
            disabled={isProcessing}
          />
          <Button
            label="거절하기"
            color="#FFFFFF"
            textColor="#B0A6A0"
            style={styles.btnOutline}
            onPress={handleReject}
            disabled={isProcessing}
          />
        </View>
      </View>
    </>
  );
};

export default VoiceResponseDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  content: {
    padding: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomActionContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    gap: 12,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    minHeight: 52,
  },
  btnEmphasis: {
    backgroundColor: "#FF7D4A",
    borderRadius: 12,
    minHeight: 52,
  },
  speechBubbleContainer: {
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 12, // 버튼과의 간격
  },
  speechBubble: {
    backgroundColor: "#F7F5F4",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: "relative",
  },
  bubbleText: {
    textAlign: "center",
    fontSize: 14,
    color: "#5C4B44",
    lineHeight: 24,
  },
  bubbleTail: {
    position: "absolute",
    bottom: -7,
    alignSelf: "center",
    width: 14,
    height: 14,
    backgroundColor: "#F7F5F4",
    transform: [{ rotate: "45deg" }],
  },
});
