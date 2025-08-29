import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import UserAnswerList from "@/components/topic/UserAnswerList";
import { useQuery } from "@tanstack/react-query";
import { getUserAnswer } from "@/utils/api/topicPageApi";
import { UserAnswerResponse } from "@/utils/types/topic";
import AppText from "@/components/common/AppText";

const UserAnswerPage = () => {
  const { topicId } = useLocalSearchParams();

  const { data, isLoading, isError } = useQuery<UserAnswerResponse[]>({
    queryKey: ["getUserAnswerKey", topicId],
    queryFn: () => getUserAnswer({ topicId: topicId as string }),
    enabled: !!topicId,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        renderItem={({ item }) => <UserAnswerList item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListEmptyComponent={<AppText style={styles.empty}>답변 없음</AppText>}
      />
    </View>
  );
};

export default UserAnswerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
});
