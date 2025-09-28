import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MessageInputBarProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSend?: () => void;
  height: SharedValue<number>;
};

const AnimatedView = Reanimated.createAnimatedComponent(View);

const MessageInputBar = ({
  value,
  onChangeText,
  onSend,
  height,
}: MessageInputBarProps) => {
  const { bottom: safeBottom } = useSafeAreaInsets();

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -height.value }],
  }));

  return (
    <AnimatedView
      style={[
        styles.container,
        { paddingBottom: safeBottom },
        animatedContainerStyle,
      ]}
    >
      <View style={styles.row}>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="메시지를 입력하세요"
          placeholderTextColor="#A5A8AE"
          style={[styles.input, { paddingRight: 44 }]}
          value={value}
          onChangeText={onChangeText}
        />

        <TouchableOpacity onPress={onSend} style={styles.sendButton}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );
};

export default MessageInputBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  row: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sendButton: {
    position: "absolute",
    right: 10,
    bottom: 8,
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    padding: 8,
  },
});
