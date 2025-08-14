import { Stack, usePathname } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import AuthHeader from "@/components/auth/AuthHeader";

const AuthLayout = () => {
  const pathname = usePathname();
  const isRoot = pathname === "/(auth)";

  return (
    <PageContainer edges={["top", "bottom"]} padded={false}>
      <AuthHeader showBack={!isRoot} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="VerifyCode" />
      </Stack>
    </PageContainer>
  );
};

export default AuthLayout;
