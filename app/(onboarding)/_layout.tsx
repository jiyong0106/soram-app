import { Stack } from "expo-router";
import PageContainer from "@/components/common/PageContainer";

const OnboardingLayout = () => {
  return (
    <PageContainer edges={["top", "bottom"]} padded={false}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="GenderPage" />
        <Stack.Screen name="BirthdatePage" />
        {/* <Stack.Screen name="LocationPage" /> */}
        {/* <Stack.Screen name="InterestsPage" /> */}
        {/* <Stack.Screen name="PersonalityPage" /> */}
      </Stack>
    </PageContainer>
  );
};

export default OnboardingLayout;
