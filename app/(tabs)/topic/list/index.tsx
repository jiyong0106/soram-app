import { StyleSheet, View } from "react-native";
import TopicTabBar from "@/components/topic/TopicTabBar";
import { CATEGORIES, RouteType } from "@/utils/types/topic";
import { useCallback, useMemo } from "react";
import TopicSection from "@/components/topic/TopicSection";

const TopicListPage = () => {
  const routes: RouteType[] = useMemo(
    () => CATEGORIES.map((c) => ({ key: c, label: c })),
    []
  );

  const renderScene = useCallback(({ route }: { route: RouteType }) => {
    return <TopicSection category={route.key} />;
  }, []);
  return (
    <View style={styles.container}>
      <TopicTabBar routes={routes} renderScene={renderScene} />
    </View>
  );
};

export default TopicListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
