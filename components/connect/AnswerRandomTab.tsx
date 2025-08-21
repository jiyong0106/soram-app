import React from "react";
import { View, StyleSheet } from "react-native";
import AnswerRandomLists from "./AnswerRandomLists";
import { useQuery } from "@tanstack/react-query";
import { getAnswerRandom } from "@/utils/api/connectPageApi";
import LoadingSpinner from "../common/LoadingSpinner";

const AnswerRandomTab = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAnswerRandomKey"],
    queryFn: () => getAnswerRandom(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <View style={styles.wrap} />;

  return (
    <View style={styles.wrap}>
      <AnswerRandomLists item={data} />
    </View>
  );
};

export default AnswerRandomTab;

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
