import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScalePressable from "../common/ScalePressable";
import AppText from "../common/AppText";

type SettingRowProps = {
  title: string;
  subtitle?: string;
  variant?: "default" | "link" | "danger";
  onPress?: () => void;
  disabled?: boolean;
  rightText?: string;
  style?: ViewStyle;
};

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  subtitle,
  variant = "default",
  onPress,
  disabled,
  rightText,
  style,
}) => {
  const isLink = variant === "link";
  const isDanger = variant === "danger";

  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.row, style, disabled && styles.disabled]}
    >
      <View style={styles.left}>
        <AppText style={[styles.title, isDanger && styles.danger]}>
          {title}
        </AppText>
        {!!subtitle && <AppText style={styles.subtitle}>{subtitle}</AppText>}
      </View>
      <View style={styles.right}>
        {!!rightText && <AppText style={styles.rightText}>{rightText}</AppText>}
        {isLink && (
          <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
        )}
      </View>
    </ScalePressable>
  );
};

export default SettingRow;

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
  },
  right: {
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    color: "#5C4B44",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#5F6368",
  },
  rightText: {
    marginRight: 6,
    color: "#5F6368",
    fontSize: 13,
  },
  danger: {
    color: "#E53935",
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
