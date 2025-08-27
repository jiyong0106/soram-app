import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import TopicRandomLists from "./TopicRandomLists";
import { useQuery } from "@tanstack/react-query";
import { getTopicRandom } from "@/utils/api/topicPageApi";
import LoadingSpinner from "../common/LoadingSpinner";
import AppText from "../common/AppText";

const TopicRandomTab = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["getTopicRandomKey"],
    queryFn: () => getTopicRandom(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <View style={styles.wrap} />;

  const handleNext = async () => {
    try {
      await refetch();
    } catch (e) {}
  };

  return (
    <View style={styles.wrap}>
      <TopicRandomLists item={data} />
      <TouchableOpacity
        style={[styles.nextBtn, isFetching && { opacity: 0.6 }]}
        onPress={handleNext}
        disabled={isFetching}
        activeOpacity={0.8}
      >
        {isFetching ? (
          <LoadingSpinner />
        ) : (
          <AppText style={styles.nextText}>다른 주제 보기</AppText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TopicRandomTab;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  text: {
    fontSize: 14,
  },
  nextBtn: {
    padding: 12,
    backgroundColor: "#ff6b6b",
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
