import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const TopicLayout = () => {
  return (
    <PageContainer edges={["top"]} padded={false}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[topicId]" />
      </Stack>
    </PageContainer>
  );
};
export default TopicLayout;
