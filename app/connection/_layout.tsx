import { BackButton } from "@/components/common/backbutton";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";

const ConnectionLayout = () => {
  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack
        screenOptions={{
          // contentStyle은 topic과 동일하게 흰색 배경을 기본으로 설정합니다.
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        {/* 'response/[id]' 화면에 대한 헤더 옵션을 여기서 정의합니다.
          이렇게 하면 해당 화면에서는 제목(title)만 신경 쓰면 됩니다.
        */}
        <Stack.Screen
          name="response/[id]"
          options={{ title: "", headerLeft: () => <BackButton /> }}
        />
      </Stack>
    </PageContainer>
  );
};

export default ConnectionLayout;
