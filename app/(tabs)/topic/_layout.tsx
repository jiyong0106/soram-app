import { BackButton } from "@/components/common/backbutton";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const TopicLayout = () => {
  return (
    <PageContainer edges={["top"]} padded={false}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="list/index"
          options={{
            title: "주제 둘러보기",
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack>
    </PageContainer>
  );
};
export default TopicLayout;
