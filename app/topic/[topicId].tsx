import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import UserAnswerList from "@/components/topic/UserAnswerList";
import { useQuery } from "@tanstack/react-query";
import { getUserAnswer } from "@/utils/api/topicPageApi";
import { UserAnswerResponse } from "@/utils/types/topic";
import AppText from "@/components/common/AppText";
import { Ionicons } from "@expo/vector-icons";

const UserAnswerPage = () => {
  const { topicId, title } = useLocalSearchParams();

  const { data, isLoading, isError, refetch } = useQuery<UserAnswerResponse[]>({
    queryKey: ["getUserAnswerKey", topicId],
    queryFn: () => getUserAnswer({ topicId: topicId as string }),
    enabled: !!topicId,
    staleTime: 60 * 1000,
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={data ?? []}
        renderItem={({ item }) => <UserAnswerList item={item} title={title} />}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        ListHeaderComponent={
          <AppText style={styles.remainText}>오늘 남은 이야기 1 / 10</AppText>
        }
        ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.moreTopicWrapper}
            activeOpacity={0.7}
            onPress={() => refetch()}
          >
            <AppText style={styles.moreTopic}>다른 이야기 보기</AppText>
            <Ionicons name="reload" size={15} color="#8E8E8E" />
          </TouchableOpacity>
        }
        ListEmptyComponent={<AppText style={styles.empty}>답변 없음</AppText>}
      />
    </View>
  );
};

export default UserAnswerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
  remainText: {
    textAlign: "center",
    marginTop: 12,

    color: "#8E8E8E",
    fontSize: 13,
    marginLeft: "auto",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },

  moreTopicWrapper: {
    marginHorizontal: "auto",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  moreTopic: {
    textAlign: "center",
    fontSize: 13,
    color: "#8E8E8E",
  },
});
