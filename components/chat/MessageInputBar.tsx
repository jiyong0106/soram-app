import React from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  LayoutChangeEvent,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MessageInputBarProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSend?: () => void;
  onLayoutHeightChange?: (h: number) => void;
};

const MessageInputBar = ({
  value,
  onChangeText,
  onSend,
  onLayoutHeightChange,
}: MessageInputBarProps) => {
  const handleLayout = (e: LayoutChangeEvent) => {
    onLayoutHeightChange?.(e.nativeEvent.layout.height);
  };
  return (
    <View style={styles.inputBarWrap} onLayout={handleLayout}>
      <TouchableOpacity style={styles.addBtn}>
        <Ionicons name="add" size={20} color="#C4C4C4" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="메시지 입력"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#A5A8AE"
        multiline
      />
      <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
        <Feather name="send" size={22} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInputBar;

const styles = StyleSheet.create({
  inputBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "top",
    backgroundColor: "#F2F4F7",
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 40,
  },
  sendBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
