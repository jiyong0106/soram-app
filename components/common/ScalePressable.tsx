import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  duration?: number;
  disabled?: any;
};

const ScalePressable = ({
  children,
  onPress,
  style,
  scaleTo = 0.95,
  duration = 120,
  disabled,
}: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(scaleTo, { duration }))}
      onPressOut={() => (scale.value = withTiming(1, { duration }))}
      disabled={disabled}
      style={{ width: "100%" }}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

export default ScalePressable;
