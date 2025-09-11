import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const TopicSkeleton = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // 가로 방향 쉬머 이동
  });

  return (
    <View style={styles.container}>
      {/* ===== tickets Skeleton ===== */}
      <View style={[styles.line, styles.ticketsRow]} />
      {/* ===== Title Skeleton ===== */}
      <View style={styles.titleRow}>
        <View style={[styles.line, styles.titleText]} />
        <View style={[styles.line, styles.shufflePill]} />
        {/* Shimmer Overlay for Title */}
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmerTitle, { transform: [{ translateX }] }]}
        />
      </View>

      {/* ===== Card Skeleton ===== */}
      <View style={styles.card}>
        {/* Shimmer Overlay for Card */}
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmer, { transform: [{ translateX }] }]}
        />

        {/* 내부 콘텐츠 자리잡기 (TopicCard와 유사 구조) */}
        <View style={styles.textWrapper}>
          <View style={[styles.line, styles.title]} />
          <View style={[styles.line, styles.subtitle]} />

          <View style={styles.touchRow}>
            <View style={[styles.line, styles.btnLine]} />
            <View style={styles.iconDot} />
          </View>

          <View style={[styles.line, styles.participants]} />
        </View>
      </View>
    </View>
  );
};

export default TopicSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  ticketsRow: {
    width: "65%",
    borderRadius: 8,
    marginHorizontal: "auto",
    height: 30,
  },
  /* ===== Title Skeleton ===== */
  titleRow: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 10,
    alignItems: "center",

    overflow: "hidden",
    gap: 8,
  },
  titleText: {
    width: "100%",
    height: 28,
    borderRadius: 8,
    backgroundColor: "#DCDCDC",
  },
  shufflePill: {
    width: 150, // "다른 주제" 버튼 자리 느낌
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DCDCDC",
    marginLeft: "auto",
  },
  shimmerTitle: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 140,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  /* ===== Card Skeleton ===== */
  card: {
    height: 420,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#ECECEC",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 140,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  textWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  line: {
    backgroundColor: "#DCDCDC",
    borderRadius: 8,
  },
  title: {
    width: "80%",
    height: 28,
  },
  subtitle: {
    marginTop: 16,
    width: "90%",
    height: 16,
  },
  touchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  btnLine: {
    width: 160,
    height: 16,
  },
  iconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DCDCDC",
  },
  participants: {
    marginTop: 16,
    width: "60%",
    height: 14,
  },
});
