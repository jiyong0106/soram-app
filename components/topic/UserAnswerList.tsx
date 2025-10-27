import { UserAnswerResponse, RequestConnectionBody } from "@/utils/types/topic";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Button from "../common/Button";
import useAlert from "@/utils/hooks/useAlert";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConnectionReminderGuideModal from "./ConnectionReminderGuideModal";
import { postRequestConnection } from "@/utils/api/topicPageApi";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import AppText from "../common/AppText";
// useFocusEffect 추가
import { useRouter, useFocusEffect } from "expo-router";
//  수정 완료
import { useQueryClient } from "@tanstack/react-query";
import { ScrollView } from "react-native-gesture-handler";

interface UserAnswerListProps {
  item: UserAnswerResponse;
  title: string | string[];
  showActions?: boolean; // 버튼 표시 여부를 제어하는 prop
}

// 스토리지 키 정의
const STORAGE_KEY = "@show_connection_reminder_guide";
//

const UserAnswerList = ({
  item,
  title,
  showActions = true,
}: UserAnswerListProps) => {
  const { textContent, id, userId, user, createdAt, topicBoxId } = item;
  const { showAlert, showActionAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // 새 가이드 모달 state 추가
  const [isGuideModalVisible, setGuideModalVisible] = useState(false);
  //

  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  useEffect(() => {
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

  // 화면 포커스 시 깃발(flag) 검사
  useFocusEffect(
    useCallback(() => {
      const checkGuideFlag = async () => {
        try {
          // 1. 스토리지에서 깃발을 확인
          const flag = await AsyncStorage.getItem(STORAGE_KEY);

          if (flag === "true") {
            // 2. 깃발이 있으면, 모달을 띄움
            setGuideModalVisible(true);
            // 3. 깃발을 즉시 제거 (재방문 시 띄우지 않음)
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          console.error("Failed to check connection guide flag", e);
        }
      };

      checkGuideFlag();
    }, []) // 의존성 배열은 비워둠
  );
  //

  const handlePress = () => {
    if (loading) return;

    const body: RequestConnectionBody = {
      addresseeId: userId,
      voiceResponseId: id,
    };

    showActionAlert(
      `대화를 요청할까요?\n\n대화 요청권 1개를 사용합니다.`,
      "요청",
      async () => {
        try {
          setLoading(true);
          const response = await postRequestConnection(body);
          // API 성공 시, 응답 객체와 함께 상대방 정보도 파라미터로 전달
          router.push({
            pathname: "/chat/[id]",
            params: {
              id: response.id,
              peerUserId: String(user.id),
              peerUserName: user.nickname,
              connectionInfo: JSON.stringify(response),
              isNewRequest: "true", // 커스텀 모달 호출을 위한 플래그 추가
              topicTitle: title,
            },
          });
          queryClient.invalidateQueries({
            queryKey: ["getSentConnectionsKey"],
          });
        } catch (e: any) {
          const errorCode = e.response?.data?.errorCode;
          const msg =
            e?.response?.data?.message || "요청 중 오류가 발생했어요.";

          if (errorCode === "RESPONSE_REQUIRED") {
            // showActionAlert 콜백을 async로 변경 및 깃발 저장 로직 추가
            showActionAlert(msg, `이야기 남기기`, async () => {
              try {
                // 1. 페이지 이동 전, 깃발(flag)을 스토리지에 저장
                await AsyncStorage.setItem(STORAGE_KEY, "true");

                // 2. 깃발 저장 후, 이야기 작성 페이지로 이동
                router.push({
                  pathname: "/topic/list/[listId]",
                  params: {
                    listId: String(topicBoxId), // '이야기 작성 후' 실행할 액션을 정의하는 플래그
                    postSubmitAction: "REQUEST_CONNECTION", // 대화 요청에 필요한 모든 컨텍스트 전달
                    addresseeId: String(userId),
                    voiceResponseId: String(id),
                    peerUserName: user.nickname,
                    title: String(title),
                  },
                });
              } catch (storageError) {
                console.error(
                  "Failed to set connection guide flag",
                  storageError
                );
                // 깃발 저장이 실패해도, 일단 페이지는 이동시킴
                router.push({
                  pathname: "/topic/list/[listId]",
                  params: {
                    listId: String(topicBoxId),
                    postSubmitAction: "REQUEST_CONNECTION",
                    addresseeId: String(userId),
                    voiceResponseId: String(id),
                    peerUserName: user.nickname,
                    title: String(title),
                  },
                });
              }
            });
            //  수정 완료
          } else if (errorCode === "INSUFFICIENT_TICKETS") {
            showAlert(msg);
          } else {
            showAlert(msg);
          }
        } finally {
          setLoading(false);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* --- 상단 스크롤 가능 콘텐츠 --- */}
      <ScrollView
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.contentWrapper}>
          {/* 질문 말풍선 카드 */}
          <View style={styles.titleWrapper}>
            <AppText style={styles.questionHighlight}>Q.</AppText>
            <AppText style={styles.title}>{title}</AppText>
          </View>

          <AppText style={styles.content}>{textContent}</AppText>

          {/* 작성자 닉네임 (오른쪽 정렬, 서명 느낌) */}
          <AppText style={styles.nick}>- {user.nickname}</AppText>

          {/* 메타 (필요 시 표시) */}
          <AppText style={styles.meta}>
            {new Date(createdAt).toLocaleDateString()}
          </AppText>
        </View>
      </ScrollView>

      {/* --- 하단 고정 액션 영역 --- */}
      {showActions && (
        <View style={styles.bottomActionContainer}>
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
          <View style={styles.btnWrapper}>
            <Button
              label="대화 요청하기"
              color="#FFF5F0"
              textColor="#FF6B3E"
              style={styles.btnEmphasis}
              disabled={loading}
              onPress={handlePress}
            />
            <Button
              label={`${user.nickname}님의 \n 다른 이야기 보기`}
              color="#FFFFFF"
              textColor="#B0A6A0"
              style={styles.btnOutline}
            />
          </View>
        </View>
      )}

      {/* 새로 만든 가이드 모달 렌더링 */}
      <ConnectionReminderGuideModal
        isVisible={isGuideModalVisible}
        onClose={() => setGuideModalVisible(false)}
        peerUserName={user.nickname}
      />
    </View>
  );
};

export default UserAnswerList;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 차지하도록 설정
    backgroundColor: "#fff",
    justifyContent: "space-between", // 콘텐츠와 하단 액션 영역을 분리
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "center", // 내용이 짧을 때 중앙에 오도록
  },
  contentWrapper: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    // 카드 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  /* 질문 말풍선 */
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
    fontSize: 16,
  },

  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#5C4B44",
  },

  nick: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginRight: 8,
    color: "#5C4B44",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
  },

  meta: {
    alignSelf: "flex-end",
    color: "#B0A6A0",
    marginTop: 4,
    fontSize: 12,
    marginRight: 8,
  },

  bottomActionContainer: {
    paddingHorizontal: 20,
  },
  btnWrapper: {
    gap: 12,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#B0A6A0",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: "auto",
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btnEmphasis: {
    borderWidth: 1,
    borderColor: "#FF6B3E",
    backgroundColor: "#FFF5F0",
    borderRadius: 12,
    height: "auto",
    minHeight: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  speechBubbleContainer: {
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 12,
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
  nextStoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 16,
  },
  nextStoryText: {
    fontSize: 14,
    color: "#B0A6A0",
  },
});
