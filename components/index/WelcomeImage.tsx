import { StyleSheet, View } from "react-native";
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
  // 부드럽게 이동하는 애니메이션 (기존 유지)
  const shiftX = useSharedValue(0);
  const shiftY = useSharedValue(0);

  useEffect(() => {
    shiftX.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 4800, easing: Easing.inOut(Easing.quad) }),
        withTiming(12, { duration: 4800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    shiftY.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 5200, easing: Easing.inOut(Easing.quad) }),
        withTiming(-8, { duration: 5200, easing: Easing.inOut(Easing.quad) })
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
        <View style={styles.envelopeBody} />

        <LinearGradient
          colors={["#fff3ee", "#ffe6db"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBand}
        />
        {/* 플랩 삼각형 */}
        <View style={styles.flapTriangleOuter}>
          <View style={styles.flapTriangle} />
        </View>
        {/* 플랩 그림자 */}
        <View style={styles.flapShadow} />
        {/* 접힘선 */}
        <View style={styles.foldLeft} />
        <View style={styles.foldRight} />
        {/* 중앙 씰 */}
        <View style={styles.sealOuter}>
          <View style={styles.sealInner} />
        </View>
        {/* 애니메이션 그라데이션 */}
        <Animated.View style={[styles.animatedGradient, animatedStyle]}>
          <LinearGradient
            colors={["rgba(255,245,242,0.72)", "rgba(255,238,232,0.72)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFillObject, styles.warmOverlay]}
          >
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
    marginBottom: 100,
  },

  heroWrapper: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "transparent",
  },

  envelopeBody: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fffdfb", // warm paper
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffe9e0",
  },

  topBand: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 52,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ffe6dc",
  },

  flapTriangleOuter: {
    position: "absolute",
    top: -2,
    left: "50%",
    marginLeft: -88,
    width: 176,
    height: 96,
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "visible",
  },
  flapTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 88,
    borderRightWidth: 88,
    borderBottomWidth: 72,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ffe4d9", // flap main color
  },

  flapShadow: {
    position: "absolute",
    top: 52,
    left: 12,
    right: 12,
    height: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "rgba(0,0,0,0.03)",
    transform: [{ translateY: 2 }],
  },

  foldLeft: {
    position: "absolute",
    left: 20,
    bottom: 56,
    width: "40%",
    height: 1,
    backgroundColor: "#ffeadf",
    transform: [{ rotate: "18deg" }],
    opacity: 0.9,
  },
  foldRight: {
    position: "absolute",
    right: 20,
    bottom: 56,
    width: "40%",
    height: 1,
    backgroundColor: "#ffeadf",
    transform: [{ rotate: "-18deg" }],
    opacity: 0.9,
  },

  stamp: {
    position: "absolute",
    top: 12,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff3f0",
    borderWidth: 1,
    borderColor: "#ffd9cf",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ff6b6b",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stampInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff6b6b",
    opacity: 0.95,
  },

  sealOuter: {
    position: "absolute",
    bottom: 36,
    left: "50%",
    marginLeft: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffb3a3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ff6b6b",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ffc7ba",
  },
  sealInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff6b6b",
  },

  animatedGradient: {
    position: "absolute",
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: 20,
    pointerEvents: "none",
  },
  warmOverlay: {
    opacity: 0.28,
  },

  glowTopRight: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: -10,
    right: 18,
  },
  glowBottomLeft: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -8,
    left: 18,
  },
});
