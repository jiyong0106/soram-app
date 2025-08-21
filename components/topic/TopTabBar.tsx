import React from "react";
import { StyleSheet } from "react-native";
import { TabBar, TabBarProps } from "react-native-tab-view";

const TopTabBar = (props: TabBarProps<any>) => {
  return (
    <TabBar
      {...props}
      style={styles.tabBar}
      tabStyle={styles.tab}
      indicatorStyle={styles.indicator}
      pressColor="transparent"
      activeColor="#ff6b6b"
      inactiveColor="#8E9499"
    />
  );
};

export default TopTabBar;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1E1F22",
  },
  tab: {
    width: "auto",
    paddingHorizontal: 12,
  },
  indicator: {
    backgroundColor: "#ff6b6b",
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
  },
});
