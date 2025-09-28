import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { postChatLeave } from "@/utils/api/chatPageApi";
import useAlert from "@/utils/hooks/useAlert";

type SwipeActionsProps = {
  prog: SharedValue<number>;
  drag: SharedValue<number>;
  connectionId: number;
};

const ACTION_WIDTH = 72; // 버튼 하나의 최대 폭
const MAX_REVEAL = ACTION_WIDTH * 2; // 두 버튼 합

const SwipeActions = ({ drag, connectionId }: SwipeActionsProps) => {
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

  //채팅방 알림 끄기

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
        <TouchableOpacity
          onPress={() => Alert.alert("알림 끄기")}
          activeOpacity={0.5}
        >
          <Ionicons name="notifications-outline" size={26} color="#fff" />
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
    backgroundColor: "#FF6B6B",
  },
  delete: {
    backgroundColor: "#9AA0A6",
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
