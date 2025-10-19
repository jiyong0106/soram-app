import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

export type BadgeProps = {
  // 숫자 배지 값
  count?: number;
  // 숫자 최대 표시값 (초과 시 `${max}+`)
  max?: number;
  // 0일 때도 표시할지 여부
  showZero?: boolean;
  // 도트 모드(숫자 대신 작은 점)
  dot?: boolean;
  // 외부 스타일(포지션 등) 주입
  style?: ViewStyle;
  textStyle?: TextStyle;
  // 접근성 라벨(없으면 숫자 기준 기본 라벨 사용)
  accessibilityLabel?: string;
};

/**
 * 공용 배지 컴포넌트
 * - 기본: 숫자 배지 (99+ 처리)
 * - 도트 모드: 작은 점만 표시
 * - 포지셔닝은 부모에서 style로 제어 (absolute 등)
 */
const Badge = memo(
  ({
    count = 0,
    max = 99,
    showZero = false,
    dot = false,
    style,
    textStyle,
    accessibilityLabel,
  }: BadgeProps) => {
    if (dot) {
      return (
        <View
          style={[styles.dot, style]}
          accessibilityLabel={accessibilityLabel}
          accessible
        />
      );
    }

    if (!showZero && (!count || count <= 0)) return null;

    const label = useMemo(
      () => (count > max ? `${max}+` : String(count)),
      [count, max]
    );

    return (
      <View
        style={[styles.container, style]}
        accessible
        accessibilityLabel={accessibilityLabel ?? `배지 ${label}개`}
      >
        <Text style={[styles.text, textStyle]}>{label}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
});

export default Badge;
