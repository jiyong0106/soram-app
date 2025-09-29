import { Stack, usePathname } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";

const AuthLayout = () => {
  return (
    <PageContainer edges={["top"]} padded={false}>
      <Stack
        screenOptions={{
          headerLeft: () => <BackButton />,
          title: "",
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="VerifyCode" />
      </Stack>
    </PageContainer>
  );
};

export default AuthLayout;
