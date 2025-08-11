import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type MessageBubbleProps = {
  text: string;
  isMine?: boolean;
  style?: ViewStyle;
};

const MessageBubble = ({ text, isMine = false, style }: MessageBubbleProps) => {
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
};

export default MessageBubble;

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
