import React, { useMemo, useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import TopicSection from "./TopicSection";
import TopicTabBarLists from "./TopicTabBarLists";
import { CATEGORIES, RouteType } from "@/utils/types/topic";

const TopicTabBar = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes: RouteType[] = useMemo(
    () => CATEGORIES.map((c) => ({ key: c, title: c })),
    []
  );

  const renderScene = useCallback(({ route }: { route: RouteType }) => {
    return <TopicSection category={route.key} />;
  }, []);

  return (
    <TabView<RouteType>
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      initialLayout={{ width: layout.width }}
      lazy
      swipeEnabled
      renderTabBar={(props) => <TopicTabBarLists {...props} />}
    />
  );
};

export default TopicTabBar;
