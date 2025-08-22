import { ChatMessage } from "@/utils/types/chat";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type MessageBubbleProps = {
  item: ChatMessage;
};

const MessageBubble = ({ item }: MessageBubbleProps) => {
  const { id, senderId, content, isRead } = item;
  // const isMine === senderId;

  return (
    <View
      style={[styles.bubble, senderId ? styles.bubbleMine : styles.bubbleOther]}
    >
      <Text
        style={[
          styles.bubbleText,
          senderId ? { color: "#fff" } : { color: "black" },
        ]}
      >
        {content}
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
