import { Stack, usePathname } from "expo-router";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import SignUpHeader from "@/components/signUp/SignUpHeader";

export default function SignUpLayout() {
  const pathname = usePathname();
  const isRoot = pathname === "/(signUp)";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={40}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <SignUpHeader showBack={!isRoot} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="VerifyCodeInputPage" />
            <Stack.Screen name="ProfileInputPage" />
          </Stack>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
