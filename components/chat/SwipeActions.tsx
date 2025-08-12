import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useDerivedValue,
} from "react-native-reanimated";

type SwipeActionsProps = {
  prog: SharedValue<number>;
  drag: SharedValue<number>;
};

const ACTION_WIDTH = 72; // 버튼 하나의 최대 폭
const MAX_REVEAL = ACTION_WIDTH * 2; // 두 버튼 합

const SwipeActions = ({ drag }: SwipeActionsProps) => {
  // 왼쪽으로 당긴 절대거리(px) 0 ~ MAX_REVEAL 로 clamp
  const reveal = useDerivedValue(() => {
    "worklet";
    const d = -drag.value; // 좌로 당기면 음수 → 양수로
    if (d < 0) return 0;
    if (d > MAX_REVEAL) return MAX_REVEAL;
    return d;
  });

  // 두 버튼 모두 같은 비율로 커지게 (각각 reveal/2, 최대 ACTION_WIDTH)
  const pinStyle = useAnimatedStyle(() => {
    const w = Math.min(reveal.value / 2, ACTION_WIDTH);
    const opacity = interpolate(
      w,
      [8, ACTION_WIDTH],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { width: w, opacity };
  });

  const delStyle = useAnimatedStyle(() => {
    const w = Math.min(reveal.value / 2, ACTION_WIDTH);
    const opacity = interpolate(
      w,
      [8, ACTION_WIDTH],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { width: w, opacity };
  });

  return (
    <Reanimated.View style={styles.actionsContainer}>
      <Reanimated.View style={[styles.actionButton, styles.pin, pinStyle]}>
        <Text style={styles.actionText}>고정</Text>
      </Reanimated.View>
      <Reanimated.View style={[styles.actionButton, styles.delete, delStyle]}>
        <Text style={styles.actionText}>삭제</Text>
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
  pin: { backgroundColor: "#9AA0A6" },
  delete: { backgroundColor: "#FF6F6F" },
  actionText: { color: "#fff", fontWeight: "700" },
});
