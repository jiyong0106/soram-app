import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";
import MyResponseDetail from "@/components/profile/MyResponseDetail";

const MyResponseDetailPage = () => {
  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "내가 남긴 이야기",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}>
        <MyResponseDetail />
      </View>
    </PageContainer>
  );
};

export default MyResponseDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
