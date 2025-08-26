import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  themeColor?: string;
};

const ReasonOption = ({
  label,
  selected,
  onPress,
  themeColor = "#ff6b6b",
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.row,
        selected && { borderColor: themeColor, backgroundColor: "#fff3f3" },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: selected ? themeColor : "#ccc" },
          selected && { backgroundColor: themeColor },
        ]}
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default ReasonOption;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 10,
  },
  label: {
    fontSize: 15,
    color: "#333",
  },
});
