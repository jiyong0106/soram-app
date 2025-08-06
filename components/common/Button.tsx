import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface ButtonProps {
  label: string;
  color?: string;
  textColor?: string;
  borderColor?: string;
  style?: ViewStyle;
}

const Button = ({
  label,
  color,
  textColor = "#222",
  borderColor,
  style,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, borderColor: borderColor || color },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
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
