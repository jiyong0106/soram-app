import { ChatMessage } from "@/utils/types/chat";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type MessageBubbleProps = {
  item: ChatMessage;
  isMine: boolean; //
};

const MessageBubble = ({ item, isMine }: MessageBubbleProps) => {
  const { id, senderId, content, isRead } = item;

  return (
    <View
      style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}
    >
      <Text style={[styles.bubbleText, isMine && { color: "#fff" }]}>
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
