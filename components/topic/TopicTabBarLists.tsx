import React from "react";
import { StyleSheet } from "react-native";
import { TabBar, TabBarProps } from "react-native-tab-view";

const TopicTabBarLists = (props: TabBarProps<any>) => {
  return (
    <TabBar
      {...props}
      style={styles.tabBar}
      tabStyle={styles.tab}
      indicatorStyle={styles.indicator}
      pressColor="transparent"
      activeColor="#FF7D4A"
      inactiveColor="#5C4B44"
      scrollEnabled
    />
  );
};

export default TopicTabBarLists;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#fff",
  },
  tab: {
    width: "auto",
    paddingHorizontal: 12,
  },
  indicator: {
    backgroundColor: "#FF7D4A",
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
  },
});
