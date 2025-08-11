import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  label: string;
  color?: string;
  textColor?: string;
  borderColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: any;
}

const Button = ({
  label,
  color,
  textColor = "#222",
  borderColor,
  style,
  disabled,
  onPress,
}: ButtonProps) => {
  // disabled 상태일 때 색상 지정
  const disabledBg = "#eee";
  const disabledText = "#aaa";
  const disabledBorder = "#eee";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? disabledBg : color,
          borderColor: disabled ? disabledBorder : borderColor || color,
        },
        style,
        // disabled && styles.disabled,
      ]}
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text
        style={[styles.label, { color: disabled ? disabledText : textColor }]}
      >
        {label}
      </Text>
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
  },
});
