import React from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type MessageInputBarProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSend?: () => void;
};

const MessageInputBar = ({
  value,
  onChangeText,
  onSend,
}: MessageInputBarProps) => {
  return (
    <View style={styles.inputBarWrap}>
      <TouchableOpacity style={styles.addBtn}>
        <Ionicons name="add" size={20} color="#C4C4C4" />
      </TouchableOpacity>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="메시지 입력"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#A5A8AE"
        />
      </View>
      <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
        <Feather name="send" size={22} />
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
  inputWrap: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: "center",
    height: 40,
  },
  input: {
    fontSize: 15,
  },
  sendBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
