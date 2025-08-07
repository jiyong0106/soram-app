// app/(signup)/_layout.tsx
import { Slot, useRouter } from "expo-router";
import {
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SignUpLayout() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80} // 필요에 따라 조정
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Slot />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
