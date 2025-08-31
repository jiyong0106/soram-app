import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import { BackButton } from "@/components/common/backbutton";

const TopicListIdPage = () => {
  const { listId } = useLocalSearchParams();

  return (
    <PageContainer edges={["bottom"]} padded={false}>
      <Stack.Screen
        options={{ title: String(listId), headerLeft: () => <BackButton /> }}
      />
      <View style={{ flex: 1 }}></View>
    </PageContainer>
  );
};

export default TopicListIdPage;

const styles = StyleSheet.create({});
