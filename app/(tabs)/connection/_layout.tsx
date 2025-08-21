import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const ConnectionLayout = () => {
  return (
    <PageContainer edges={["top"]} padded={false}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </PageContainer>
  );
};
export default ConnectionLayout;
