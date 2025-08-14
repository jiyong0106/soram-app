import { Stack } from "expo-router";
import PageContainer from "@/components/common/PageContainer";

const SignupLayout = () => {
  return (
    <PageContainer edges={["top", "bottom"]} padded={false}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="gender" />
        <Stack.Screen name="birthdate" />
        <Stack.Screen name="location" />
        <Stack.Screen name="interests" />
        <Stack.Screen name="personality" />
        <Stack.Screen name="finish" />
      </Stack>
    </PageContainer>
  );
};

export default SignupLayout;
