import { StyleSheet, View } from "react-native";
import React from "react";
import PageContainer from "@/components/common/PageContainer";
import { Stack } from "expo-router";
import { BackButton } from "@/components/common/backbutton";
import DeleteAccountForm from "@/components/settings/DeleteAccountForm";

const DeleteAccountPage = () => {
  return (
    <PageContainer padded={false} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "계정 삭제",
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View style={styles.container}>
        <DeleteAccountForm />
      </View>
    </PageContainer>
  );
};

export default DeleteAccountPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
