import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const TabLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <Tabs
        screenOptions={{ tabBarActiveTintColor: "#FF6F3C", headerShown: false }}
      >
        <Tabs.Screen
          name="chatList"
          options={{
            title: "채팅",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="connect"
          options={{
            title: "연결",
            tabBarIcon: ({ color }) => (
              <Ionicons name="rocket-outline" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "프로필",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabLayout;
