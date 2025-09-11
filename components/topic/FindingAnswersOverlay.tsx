// components/topic/FindingAnswersOverlay.tsx
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import AppText from "@/components/common/AppText";

type Props = {
  visible: boolean;
  text?: string;
  fadeMs?: number; // 기본 220ms
};

const FindingAnswersOverlay = ({
  visible,
  text = "답변을 찾는 중…",
  fadeMs = 220,
}: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible); // ← 언마운트 제어

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (visible) {
      // 나타날 때: 먼저 마운트 → 페이드인
      setMounted(true);
      opacity.stopAnimation();
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: fadeMs,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      // 사라질 때: 페이드아웃 → 애니 끝나면 언마운트
      Animated.timing(opacity, {
        toValue: 0,
        duration: fadeMs,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        timer = setTimeout(() => setMounted(false), 0);
      });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, mounted, opacity, fadeMs]);

  if (!mounted) return null; // ✅ 완전 언마운트

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.overlay, { opacity }]}
    >
      <Pulse />
      <AppText style={styles.text}>{text}</AppText>
    </Animated.View>
  );
};

export default FindingAnswersOverlay;

const Pulse = () => {
  const s1 = useRef(new Animated.Value(0)).current;
  const s2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

    loop(s1, 0);
    loop(s2, 600);

    return () => {
      s1.stopAnimation();
      s2.stopAnimation();
    };
  }, [s1, s2]);

  const circle = (v: Animated.Value) => ({
    transform: [
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 2.2] }) },
    ],
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
  });

  return (
    <View style={styles.pulseBox}>
      <Animated.View style={[styles.pulseCircle, circle(s1)]} />
      <Animated.View style={[styles.pulseCircle, circle(s2)]} />
      <View style={styles.pulseDot} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  text: { marginTop: 16, fontSize: 14, color: "#888" },
  pulseBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ff6b6b",
  },
  pulseDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ff6b6b",
  },
});
