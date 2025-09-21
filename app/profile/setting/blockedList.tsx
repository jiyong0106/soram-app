import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";
import { BackButton } from "@/components/common/backbutton";

const blockedList = () => {
  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "차단 목록",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}></View>
    </PageContainer>
  );
};

export default blockedList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
