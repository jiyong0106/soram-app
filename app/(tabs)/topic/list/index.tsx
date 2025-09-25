import { StyleSheet, View } from "react-native";
import TopTabBar from "@/components/topic/TopTabBar";
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
      <TopTabBar routes={routes} renderScene={renderScene} />
    </View>
  );
};

export default TopicListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
