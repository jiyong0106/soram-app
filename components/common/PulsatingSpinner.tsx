import { View, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const PulsatingSpinner = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  const animationConfig = {
    duration: 500,
    easing: Easing.inOut(Easing.ease),
  };

  useEffect(() => {
    dot1.value = withRepeat(
      withTiming(1, animationConfig),
      -1, // infinite repeat
      true // reverse animation
    );
    dot2.value = withDelay(
      200,
      withRepeat(withTiming(1, animationConfig), -1, true)
    );
    dot3.value = withDelay(
      400,
      withRepeat(withTiming(1, animationConfig), -1, true)
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, animatedStyle1]} />
      <Animated.View style={[styles.dot, animatedStyle2]} />
      <Animated.View style={[styles.dot, animatedStyle3]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF7D4A",
  },
});

export default PulsatingSpinner;
