import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import PastResponsesUserList from "@/components/activity/PastResponsesUserList";

const UserUnlockedResponsesPage = () => {
  const { authorId, nickname } = useLocalSearchParams<{
    authorId: string;
    nickname: string;
  }>();

  return (
    <PageContainer padded={false} edges={[]}>
      <Stack.Screen
        options={{
          title: `${nickname || "사용자"}님의 이야기`,
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <View style={styles.container}>
        {/* authorId가 유효할 때만 콘텐츠 컴포넌트를 렌더링합니다. */}
        {authorId && <PastResponsesUserList authorId={Number(authorId)} />}
      </View>
    </PageContainer>
  );
};

export default UserUnlockedResponsesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
