import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../common/AppText";

type Props = {
  length: number;
  max: number;
};

const messages = [
  { until: 0, text: "질문에 대한 이야기를 자유롭게 작성해 보세요!" },
  { until: 100, text: "좋아요! 이야기가 더 듣고 싶어요!" },
  { until: 200, text: "멋진 답변이에요! 진심이 느껴져요 ✨" },
  { until: Infinity, text: "충분해요. 자유롭게 마무리해볼까요?" },
];

// ✅ 구간 설정: 3칸, 각 100자씩
const SEGMENT_COUNT = 3;
const STEP = 100;

const ProgressFooter = ({ length, max }: Props) => {
  const msg = useMemo(() => {
    const found = messages.find((m) => length <= m.until);
    return found?.text ?? "";
  }, [length]);

  return (
    <View style={styles.wrap}>
      <AppText style={styles.message}>{msg}</AppText>

      {/* ✅ 구간형 프로그레스 바 */}
      <View style={styles.segments}>
        {Array.from({ length: SEGMENT_COUNT }).map((_, i) => {
          const start = i * STEP;
          const end = start + STEP;
          // 0 ~ 1 사이로 해당 구간의 채움 비율 계산
          const ratio = Math.max(0, Math.min(1, (length - start) / STEP));

          return (
            <View key={i} style={styles.segmentBg}>
              <View
                style={[styles.segmentFill, { width: `${ratio * 100}%` }]}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.counterWrap}>
        <AppText style={styles.counter}>
          {length}/{max}
        </AppText>
      </View>
    </View>
  );
};
export default ProgressFooter;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    width: "100%",
    backgroundColor: "#fff",
  },
  message: {
    fontSize: 13,
    color: "#FF6A00",
    marginBottom: 6,
    textAlign: "center", // 필요시 중앙 정렬
  },
  // ✅ 구간 컨테이너
  segments: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  // ✅ 각 칸의 배경
  segmentBg: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    overflow: "hidden",
  },
  // ✅ 각 칸의 채워지는 부분
  segmentFill: {
    height: "100%",
    backgroundColor: "#FF6A00",
    borderRadius: 4,
  },
  counterWrap: {
    marginTop: 6,
    alignItems: "flex-end",
  },
  counter: {
    fontSize: 12,
    color: "#8A8A8A",
  },
});
