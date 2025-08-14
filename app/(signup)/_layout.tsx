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
        <Stack.Screen name="Gender" />
        <Stack.Screen name="Birthdate" />
        <Stack.Screen name="Location" />
        <Stack.Screen name="Interests" />
        <Stack.Screen name="Personality" />
        <Stack.Screen name="Finish" />
      </Stack>
    </PageContainer>
  );
};

export default SignupLayout;
