import { BackButton } from "@/components/common/backbutton";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const AnswerRandomLayout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#fff" },
        title: "",
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};
export default AnswerRandomLayout;
