import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import LoadingSpinner from "./LoadingSpinner";
import AppText from "./AppText";

interface ButtonProps {
  label: string;
  color?: string;
  textColor?: string;
  borderColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: any;
  loading?: boolean;
}

const Button = ({
  label,
  color,
  textColor = "#222",
  borderColor,
  style,
  disabled,
  onPress,
  loading,
}: ButtonProps) => {
  // disabled 상태일 때 색상 지정
  const disabledBg = "#eee";
  const disabledText = "#aaa";
  const disabledBorder = "#eee";
  const isDisabled = !!disabled || !!loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? disabledBg : color,
          borderColor: isDisabled ? disabledBorder : borderColor || color,
        },
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {loading ? (
        <LoadingSpinner color="#ff6b6b" />
      ) : (
        <AppText
          style={[
            styles.label,
            { color: isDisabled ? disabledText : textColor },
          ]}
        >
          {label}
        </AppText>
      )}
    </TouchableOpacity>
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
