import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import AnswerRandomLists from "@/components/topic/AnswerRandomLists";
import { useQuery } from "@tanstack/react-query";
import { getAnswerRandom } from "@/utils/api/topicPageApi";
import { AnswerRandom } from "@/utils/types/topic";

const AnswerRandomPage = () => {
  const { topicId } = useLocalSearchParams();

  const { data, isLoading, isError } = useQuery<AnswerRandom[]>({
    queryKey: ["getAnswerRandomKey", topicId],
    // queryFn: () => getAnswerRandom({ topicId: topicId as string }),
    queryFn: () => getAnswerRandom({ topicId: "5" }),
    enabled: !!topicId,
  });

  return (
    <View style={styles.container}>
      <Text>토픽 id는 {topicId}</Text>
      <FlatList
        data={data ?? []}
        renderItem={({ item }) => <AnswerRandomLists item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

export default AnswerRandomPage;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
