import { Stack, usePathname } from "expo-router";
import SignupHeader from "@/components/signup/SignupHeader";
import PageContainer from "@/components/common/PageContainer";

const OnboardingLayout = () => {
  const pathname = usePathname();
  // const isRoot = pathname === "/(signup)";

  return (
    <PageContainer edges={["top", "bottom"]} padded={false}>
      {/* <SignupHeader showBack={!isRoot} /> */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "white" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="GenderPage" />
        <Stack.Screen name="BirthdatePage" />
        <Stack.Screen name="LocationPage" />
        {/* <Stack.Screen name="InterestsPage" /> */}
        {/* <Stack.Screen name="PersonalityPage" /> */}
      </Stack>
    </PageContainer>
  );
};

export default OnboardingLayout;
