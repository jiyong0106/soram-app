import AppHeader from "@/components/common/AppHeader";
import AppText from "@/components/common/AppText";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import TopicCard from "@/components/topic/TopicCard";
import TopicTitle from "@/components/topic/TopicTitle";
import { getTopicRandom } from "@/utils/api/topicPageApi";
import useAlert from "@/utils/hooks/useAlert";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const TopicPage = () => {
  const { showAlert } = useAlert();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getTopicRandomKey"],
    queryFn: () => getTopicRandom(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <View style={styles.wrap} />;

  const onShuffle = async () => {
    try {
      await refetch();
    } catch (e: any) {
      if (e) {
        showAlert(e.response.data.message);
        return;
      }
    }
  };

  const topicId = data.id;

  return (
    <View style={styles.container}>
      <AppHeader />
      <TopicTitle onShuffle={onShuffle} />
      <TopicCard item={data} />
      <TouchableOpacity
        onPress={() => router.push("/topic/list")}
        activeOpacity={0.5}
        style={styles.moreTopic}
      >
        <AppText>더 다양한 주제 보러가기</AppText>
        <Ionicons name="chevron-forward-outline" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default TopicPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  wrap: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  moreTopic: {
    marginHorizontal: "auto",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});
