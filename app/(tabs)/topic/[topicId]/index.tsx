import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import AnswerRandomLists from "@/components/topic/AnswerRandomLists";
import { useQuery } from "@tanstack/react-query";
import { getAnswerRandom } from "@/utils/api/topicPageApi";
import { AnswerRandom } from "@/utils/types/topic";
import AppText from "@/components/common/AppText";

const AnswerRandomPage = () => {
  const { topicId } = useLocalSearchParams();

  const { data, isLoading, isError } = useQuery<AnswerRandom[]>({
    queryKey: ["getAnswerRandomKey", topicId],
    queryFn: () => getAnswerRandom({ topicId: topicId as string }),
    enabled: !!topicId,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        renderItem={({ item }) => <AnswerRandomLists item={item} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListEmptyComponent={<AppText style={styles.empty}>답변 없음</AppText>}
      />
    </View>
  );
};

export default AnswerRandomPage;

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
