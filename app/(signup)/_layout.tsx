import { Stack, usePathname } from "expo-router";
import SignupHeader from "@/components/signup/SignupHeader";
import PageContainer from "@/components/common/PageContainer";

const SignupLayout = () => {
  const pathname = usePathname();
  const isRoot = pathname === "/(signup)";

  return (
    <PageContainer edges={["top", "bottom"]} padded={false}>
      <SignupHeader showBack={!isRoot} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="VerifyCodeInputPage" />
      </Stack>
    </PageContainer>
  );
};

export default SignupLayout;
