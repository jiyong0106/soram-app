import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import PageContainer from "@/components/common/PageContainer";
import AppText from "@/components/common/AppText";

// TODO: 3단계에서 생성할 컴포넌트들을 임시로 import합니다.
import MyResponsesList from "@/components/activity/MyResponsesList";
import PastResponsesList from "@/components/activity/PastResponsesList";

// 1. Route 타입을 '내 이야기', '이어 본 이야기'에 맞게 변경
type Route = { key: "myResponses" | "pastResponses" };

const ROUTES: Route[] = [{ key: "myResponses" }, { key: "pastResponses" }];
const TAB_COUNT = ROUTES.length;

const THEME = "#FF7D4A";
const INACTIVE = "#B0A6A0";
const TAB_HEIGHT = 48;
const H_PADDING = 10;

// 2. SceneMap에 새로운 컴포넌트를 매핑
const renderScene = SceneMap<Route>({
  myResponses: () => <MyResponsesList />,
  pastResponses: () => <PastResponsesList />,
});

const ActivityScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const TAB_WIDTH = (layout.width - H_PADDING * 2) / TAB_COUNT;

  return (
    <PageContainer edges={[]} padded={false}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShown: true,
          headerBackVisible: false,
          headerShadowVisible: false,
          headerLeft: () => (
            <View style={{ paddingHorizontal: 16 }}>
              <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
                활동
              </AppText>
            </View>
          ),
        }}
      />
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
            const text =
              route.key === "myResponses" ? "내가 남긴 이야기" : "지난 이야기";
            const icon =
              route.key === "pastResponses" ? "time-sharp" : "pencil-sharp";
            return (
              <View style={styles.labelWrap}>
                <Ionicons name={icon as any} size={18} color={color} />
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
    </PageContainer>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    elevation: 0,
    shadowOpacity: 0,
    height: TAB_HEIGHT,
  },
  tab: {
    paddingHorizontal: 10,
    height: TAB_HEIGHT,
  },
  indicator: {
    backgroundColor: THEME,
    height: 3,
    borderRadius: 2,
  },
  labelWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 14, fontWeight: "bold", color: INACTIVE },
  labelActive: { color: THEME },
});
