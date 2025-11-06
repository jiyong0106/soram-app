import { useEffect, useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import AppText from "./AppText";

interface Props {
  style?: StyleProp<ViewStyle>;
}
const Timer = ({ style }: Props) => {
  // 남은 시간을 초 단위로 관리
  const TOTAL_SECONDS = 180;
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 매 초마다 남은 시간을 1씩 감소
  useEffect(() => {
    // 이미 동작 중이면 초기화
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 언마운트 시 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // mm:ss 형식으로 포맷
  const formatToMMSS = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const rem = seconds % 60;
    const mm = String(minutes).padStart(2, "0");
    const ss = String(rem).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.timeText}>
        {formatToMMSS(remainingSeconds)}
      </AppText>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {},
  timeText: {
    color: "#FF6B3E",
    fontSize: 12,
    fontWeight: "bold",
  },
});
