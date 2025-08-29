import React, { useMemo, useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import TopicSection from "./TopicSection";
import TopicTabBarLists from "./TopicTabBarLists";

interface RouteType {
  key: "random" | "recommend";
  title: string;
}

const TopicTabBar = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes: RouteType[] = useMemo(
    () => [{ key: "recommend", title: "답변 추천" }],
    []
  );

  const renderScene = useCallback(({ route }: { route: RouteType }) => {
    switch (route.key) {
      case "recommend":
        return <TopicSection />;
      default:
        return null;
    }
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
