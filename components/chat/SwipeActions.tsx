import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { postChatLeave } from "@/utils/api/chatPageApi";
import useAlert from "@/utils/hooks/useAlert";
import {
  deleteConnectionMute,
  postConnectionMute,
} from "@/utils/api/connectionPageApi";
import { GetChatResponse } from "@/utils/types/chat";

type SwipeActionsProps = {
  prog: SharedValue<number>;
  drag: SharedValue<number>;
  connectionId: number;
  isMuted: boolean;
  onActionComplete?: () => void;
};

const ACTION_WIDTH = 72;
const MAX_REVEAL = ACTION_WIDTH * 2; // 두 버튼 합

const SwipeActions = ({
  drag,
  connectionId,
  isMuted,
  onActionComplete,
}: SwipeActionsProps) => {
  const queryClient = useQueryClient();
  const { showActionAlert, showAlert } = useAlert();

  // 왼쪽으로 당긴 절대거리(px) 0 ~ MAX_REVEAL 로 clamp
  const reveal = useDerivedValue(() => {
    "worklet";
    const d = -drag.value; // 좌로 당기면 음수 → 양수로
    if (d < 0) return 0;
    if (d > MAX_REVEAL) return MAX_REVEAL;
    return d;
  });

  // 두 버튼 모두 같은 비율로 커지게 (각각 reveal/2, 최대 ACTION_WIDTH)
  const buttonStyle = useAnimatedStyle(() => {
    const w = Math.min(reveal.value / 2, ACTION_WIDTH);
    return { width: w };
  });

  //채팅방 알림 끄기/켜기 (확인 알림창 제거)
  const handleToggleMute = () => {
    // 즉각적인 UI 반응을 위한 낙관적 업데이트
    queryClient.setQueryData(
      ["getChatKey"],
      (oldData: InfiniteData<GetChatResponse> | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              item.id === connectionId ? { ...item, isMuted: !isMuted } : item
            ),
          })),
        };
      }
    );

    // 액션 완료 후 스와이프 닫기 콜백 호출
    onActionComplete?.();

    // 실제 API 호출 (백그라운드에서 실행)
    const apiCall = async () => {
      try {
        if (isMuted) {
          await deleteConnectionMute(connectionId);
        } else {
          await postConnectionMute(connectionId);
        }
        // 성공 시 서버 데이터와 최종 일관성 맞춤
        queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
      } catch (e: any) {
        showAlert(e.response?.data?.message || "다시 시도해 주세요");
        // 실패 시, UI를 원래대로 되돌리기 위해 캐시 무효화
        queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
      }
    };
    apiCall();
  };

  //채팅방 나가기
  const handleChatLeave = () => {
    showActionAlert("채팅방을 나가시나요?", "확인", async () => {
      try {
        await postChatLeave(connectionId);
        queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
      } catch (e: any) {
        if (e) {
          showAlert(e.response.data.message || "다시 시도해 주세요");
          return;
        }
      }
    });
  };

  return (
    <Reanimated.View style={styles.actionsContainer}>
      <Reanimated.View style={[styles.actionButton, styles.noti, buttonStyle]}>
        <TouchableOpacity onPress={handleToggleMute} activeOpacity={0.5}>
          <Ionicons
            name={isMuted ? "notifications-off-outline" : "notifications"}
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </Reanimated.View>
      <Reanimated.View
        style={[styles.actionButton, styles.delete, buttonStyle]}
      >
        <TouchableOpacity onPress={handleChatLeave} activeOpacity={0.5}>
          <AntDesign name="delete" size={26} color="#fff" />
        </TouchableOpacity>
      </Reanimated.View>
    </Reanimated.View>
  );
};

export default SwipeActions;

const styles = StyleSheet.create({
  actionsContainer: {
    width: MAX_REVEAL, // 두 버튼 총 최대폭
    flexDirection: "row",
    overflow: "hidden", // 폭이 늘어나는 만큼만 보이게
    alignItems: "center",
    justifyContent: "flex-end",
  },
  actionButton: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  noti: {
    backgroundColor: "#FF6B3E",
  },
  delete: {
    backgroundColor: "#9AA0A6",
  },
});
