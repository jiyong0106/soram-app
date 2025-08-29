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
            // title: "",
            // headerRight: () => (
            //   <Ionicons name="notifications-outline" size={24} color="black" />
            // ),
            // headerLeft: () => <Text>소람 어쩌고 ㅓ쩌고</Text>,
          }}
        />
        <Stack.Screen
          name="[topicId]"
          options={{
            title: "",
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack>
    </PageContainer>
  );
};
export default TopicLayout;
