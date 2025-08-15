import { Stack } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton, backHeaderOptions } from "@/components/common/backbutton";

const SignupLayout = () => {
  return (
    <PageContainer edges={["top", "bottom"]} padded={false}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "white" },
          title: "",
          headerLeft: () => <BackButton />,
        }}
      >
        <Stack.Screen name="index" options={{ headerLeft: undefined }} />
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
