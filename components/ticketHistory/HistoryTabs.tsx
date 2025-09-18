import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../common/AppText";

const TABS = [
  { key: "ALL", label: "전체" },
  { key: "EARN", label: "획득" },
  { key: "USE", label: "사용" },
];

type HistoryTabsProps = {
  activeTab: "ALL" | "EARN" | "USE";
  onTabPress: (tab: "ALL" | "EARN" | "USE") => void;
};

const HistoryTabs: React.FC<HistoryTabsProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabPress(tab.key as any)}
        >
          <AppText
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#121212",
  },
  tabText: {
    fontSize: 16,
    color: "#8A8A8A",
  },
  activeTabText: {
    color: "#121212",
    fontWeight: "bold",
  },
});

export default HistoryTabs;
