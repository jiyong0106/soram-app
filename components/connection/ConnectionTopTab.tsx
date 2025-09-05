import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
import ReceivedRequests from "./ReceivedRequests";
import SentRequests from "./SentRequests";
import AppText from "../common/AppText";

type Route = { key: "received" | "sent" };

const ROUTES: Route[] = [{ key: "received" }, { key: "sent" }]; //  고정 탭
const TAB_COUNT = ROUTES.length;

const THEME = "#ff6b6b";
const INACTIVE = "#8E9499";
const TAB_HEIGHT = 48;
const H_PADDING = 10; // 탭바 좌우 여백

const renderScene = SceneMap<Route>({
  received: () => <ReceivedRequests />,
  sent: () => <SentRequests />,
});

const ConnectionTopTab = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  // 좌우 패딩 제외한 화면폭을 탭 개수로 균등 분배
  const TAB_WIDTH = (layout.width - H_PADDING * 2) / TAB_COUNT;

  return (
    <TabView<Route>
      navigationState={{ index, routes: ROUTES }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy
      swipeEnabled
      commonOptions={{
        label: ({ route, focused }) => {
          const color = focused ? THEME : INACTIVE;
          const text = route.key === "received" ? "받은 요청" : "보낸 요청";
          const icon =
            route.key === "received" ? "mail-outline" : "send-outline";
          return (
            <View style={styles.labelWrap}>
              <Ionicons name={icon} size={16} color={color} />
              <AppText style={[styles.label, focused && styles.labelActive]}>
                {text}
              </AppText>
            </View>
          );
        },
      }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={styles.tabBar}
          tabStyle={[styles.tab, { width: TAB_WIDTH }]}
          indicatorStyle={styles.indicator}
          pressColor="transparent"
          activeColor={THEME}
          inactiveColor={INACTIVE}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: H_PADDING }}
        />
      )}
    />
  );
};

export default ConnectionTopTab;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6E8EC",
    elevation: 0,
    shadowOpacity: 0,
    height: TAB_HEIGHT,
  },
  tab: {
    paddingHorizontal: 16,
    height: TAB_HEIGHT,
  },
  indicator: {
    backgroundColor: THEME,
    height: 3,
    borderRadius: 2,
  },
  labelWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 14, fontWeight: "700", color: INACTIVE },
  labelActive: { color: THEME },
});
