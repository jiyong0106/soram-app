import { BackButton } from "@/components/common/backbutton";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const TopicListIdLayout = () => {
  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen
          name="[listId]"
          options={{ title: "", headerLeft: () => <BackButton /> }}
        />
      </Stack>
    </PageContainer>
  );
};
export default TopicListIdLayout;
