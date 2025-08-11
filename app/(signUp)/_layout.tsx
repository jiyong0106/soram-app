import { Stack, usePathname } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import SignUpHeader from "@/components/signUp/SignUpHeader";
import PageContainer from "@/components/common/PageContainer";

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
        <PageContainer edges={["top", "bottom"]} padded={false}>
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
        </PageContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpLayout;
