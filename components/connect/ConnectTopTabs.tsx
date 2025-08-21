import React, { useMemo, useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import AnswerRecommendTab from "./AnswerRecommendTab";
import TopTabBar from "./TopTabBar";
import TopicRandomTab from "./TopicRandomTab";

interface RouteType {
  key: "random" | "recommend";
  title: string;
}

const ConnectTopTabs = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes: RouteType[] = useMemo(
    () => [
      { key: "random", title: "답변 랜덤" },
      { key: "recommend", title: "답변 추천" },
    ],
    []
  );

  const renderScene = useCallback(({ route }: { route: RouteType }) => {
    switch (route.key) {
      case "random":
        return <TopicRandomTab />;
      case "recommend":
        return <AnswerRecommendTab />;
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
      renderTabBar={(props) => <TopTabBar {...props} />}
    />
  );
};

export default ConnectTopTabs;
