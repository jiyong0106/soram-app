import { useAuthStore } from "@/utils/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

const TabLayout = () => {
  const token = useAuthStore((s) => s.token);

  if (!token) return <Redirect href="/" />;

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
        name="profile/index"
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
