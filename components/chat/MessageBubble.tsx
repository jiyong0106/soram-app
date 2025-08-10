import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type Props = {
  text: string;
  isMine?: boolean;
  style?: ViewStyle;
};

export default function MessageBubble({ text, isMine = false, style }: Props) {
  return (
    <View
      style={[
        styles.bubble,
        isMine ? styles.bubbleMine : styles.bubbleOther,
        style,
      ]}
    >
      <Text style={[styles.bubbleText, isMine && { color: "#fff" }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  bubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: "#FF6F6F",
  },
  bubbleOther: {
    backgroundColor: "#EFF1F5",
  },
  bubbleText: {
    fontSize: 15,
    color: "#111",
  },
});
