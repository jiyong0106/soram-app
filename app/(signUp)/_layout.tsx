import { Stack, usePathname } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import SignUpHeader from "@/components/signUp/SignUpHeader";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpLayout = () => {
  const pathname = usePathname();
  const isRoot = pathname === "/(signUp)";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={40}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpLayout;
