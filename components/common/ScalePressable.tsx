import React, { useRef } from "react";
import { Pressable, Animated, StyleProp, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number; // 눌렀을 때 줄어드는 정도
  duration?: number; // 속도 (ms)
};

const ScalePressable = ({
  children,
  onPress,
  style,
  scaleTo = 0.95,
  duration = 120,
}: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: scaleTo,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default ScalePressable;
