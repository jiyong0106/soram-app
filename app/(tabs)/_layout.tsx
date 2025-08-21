import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "#ff6b6b", headerShown: false }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: "대화",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="connection"
        options={{
          title: "요청",
          tabBarIcon: ({ color }) => (
            <Ionicons name="happy-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="topic"
        options={{
          title: "주제",
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
  );
};

export default TabLayout;
