import React from "react";
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
  TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import LoadingSpinner from "./LoadingSpinner";
import AppText from "./AppText";

interface ButtonProps {
  label: string;
  color?: string;
  textColor?: string;
  borderColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  /** 스케일 효과 on/off */
  withPressScale?: boolean;
  /** 눌렀을 때 스케일 값 */
  scaleTo?: number;
  /** 애니메이션 지속 시간(ms) */
  duration?: number;
}

const Button = ({
  label,
  color,
  textColor = "#222",
  borderColor,
  style,
  textStyle,
  disabled,
  onPress,
  loading,
  withPressScale = true,
  scaleTo = 0.95,
  duration = 120,
}: ButtonProps) => {
  const disabledBg = "#eee";
  const disabledText = "#aaa";
  const disabledBorder = "#eee";
  const isDisabled = !!disabled || !!loading;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (withPressScale && !isDisabled) {
      scale.value = withTiming(scaleTo, { duration });
    }
  };

  const handlePressOut = () => {
    if (withPressScale) {
      scale.value = withTiming(1, { duration });
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={{ width: "100%" }}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: isDisabled ? disabledBg : color,
            borderColor: isDisabled ? disabledBorder : borderColor || color,
          },
          animatedStyle,
          style,
        ]}
      >
        {loading ? (
          <LoadingSpinner color="#FF6B3E" />
        ) : (
          <AppText
            style={[
              styles.label,
              { color: isDisabled ? disabledText : textColor },
              textStyle,
            ]}
          >
            {label}
          </AppText>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});
