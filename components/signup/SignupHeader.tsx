import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SignupHeaderProps = {
  title?: string;
  showBack?: boolean;
};

export default function SignupHeader({
  title = "",
  showBack = false,
}: SignupHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.left}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="#111"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.left} />
      )}

      <Text style={styles.title}>{title}</Text>
      <View style={styles.right} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  left: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  right: {
    width: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
});
