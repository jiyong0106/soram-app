import React from "react";
import { View, StyleSheet } from "react-native";
import TopicRandomLists from "./TopicRandomLists";
import { useQuery } from "@tanstack/react-query";
import { getTopicRandom } from "@/utils/api/connectPageApi";
import LoadingSpinner from "../common/LoadingSpinner";

const TopicRandomTab = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getTopicRandomKey"],
    queryFn: () => getTopicRandom(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <View style={styles.wrap} />;

  return (
    <View style={styles.wrap}>
      <TopicRandomLists item={data} />
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
});
