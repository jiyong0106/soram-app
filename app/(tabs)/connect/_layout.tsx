import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const ConnectLayout = () => {
  return (
    <PageContainer>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </PageContainer>
  );
};
export default ConnectLayout;
