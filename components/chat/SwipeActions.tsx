import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onPin?: () => void;
  onDelete?: () => void;
};

const SwipeActions = ({ onPin, onDelete }: Props) => {
  return (
    <View style={styles.actionsContainer}>
      <Pressable
        style={[styles.actionButton, { backgroundColor: "#D9D9D9" }]}
        onPress={onPin}
      >
        <Text style={styles.actionText}>고정</Text>
      </Pressable>
      <Pressable
        style={[styles.actionButton, { backgroundColor: "#FF6F6F" }]}
        onPress={onDelete}
      >
        <Text style={styles.actionText}>삭제</Text>
      </Pressable>
    </View>
  );
};

export default SwipeActions;

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 80,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: { color: "white", fontWeight: "700" },
});
