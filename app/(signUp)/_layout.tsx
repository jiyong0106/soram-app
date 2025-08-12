import { Stack, usePathname } from "expo-router";
import SignUpHeader from "@/components/signUp/SignUpHeader";
import PageContainer from "@/components/common/PageContainer";

const SignUpLayout = () => {
  const pathname = usePathname();
  const isRoot = pathname === "/(signUp)";

  return (
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
        <Stack.Screen name="PhoneNumberPage" />
      </Stack>
    </PageContainer>
  );
};

export default SignUpLayout;
