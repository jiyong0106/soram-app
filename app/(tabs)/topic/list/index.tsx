import { StyleSheet, View } from "react-native";
import TopicTabBar from "@/components/topic/TopicTabBar";

const TopicListPage = () => {
  return (
    <View style={styles.container}>
      <TopicTabBar />
    </View>
  );
};

export default TopicListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
