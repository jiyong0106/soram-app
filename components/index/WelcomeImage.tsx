import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

const WelcomeImage = () => {
  // 한글 주석: 그라데이션 레이어를 살짝 이동시키는 드리프트 애니메이션
  const shiftX = useSharedValue(0);
  const shiftY = useSharedValue(0);

  useEffect(() => {
    // 좌우로 천천히 왕복
    shiftX.value = withRepeat(
      withSequence(
        withTiming(-16, { duration: 4800, easing: Easing.inOut(Easing.quad) }),
        withTiming(16, { duration: 4800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    // 상하로 위상 차를 두고 왕복
    shiftY.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 5200, easing: Easing.inOut(Easing.quad) }),
        withTiming(-10, { duration: 5200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shiftX.value }, { translateY: shiftY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.heroWrapper}>
        <Animated.View style={[styles.animatedGradient, animatedStyle]}>
          <LinearGradient
            colors={["#FFB591", "#FF6B6B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          >
            {/* 장식용 라이트 스팟 */}
            <View style={styles.glowTopRight} />
            <View style={styles.glowBottomLeft} />
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

export default WelcomeImage;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroWrapper: {
    width: "100%",
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
    // 플랫폼별 그림자
    shadowColor: "#ff6b6b",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  animatedGradient: {
    // 한글 주석: 컨테이너보다 약간 크게 만들어 이동 여유를 줌
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 24,
  },
  glowTopRight: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.16)",
    top: -18,
    right: 12,
  },
  glowBottomLeft: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.12)",
    bottom: -12,
    left: 20,
  },
});
