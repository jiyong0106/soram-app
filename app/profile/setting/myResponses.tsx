import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import MyResponseList from "@/components/profile/MyResponseList"; // ❗️ 데이터 로직 컴포넌트 import

// --- ❗️ DUMMY_DATA 변수 전체를 삭제합니다. ---

const MyResponsesPage = () => {
  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "내가 답변한 이야기",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}>
        {/* ❗️ 기존 FlatList 대신, MyResponseList 컴포넌트를 렌더링합니다. */}
        <MyResponseList />
      </View>
    </PageContainer>
  );
};

export default MyResponsesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
