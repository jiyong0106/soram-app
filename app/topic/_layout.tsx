import { BackButton } from "@/components/common/backbutton";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const UserAnswerLayout = () => {
  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen
          name="[topicId]"
          options={{ title: "", headerLeft: () => <BackButton /> }}
        />
      </Stack>
    </PageContainer>
  );
};
export default UserAnswerLayout;
