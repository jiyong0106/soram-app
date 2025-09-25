import { useAuthStore } from "@/utils/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

const TabLayout = () => {
  const token = useAuthStore((s) => s.token);

  if (!token) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF7D4A",
        headerShown: false,
        tabBarLabelStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: "대화",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="connection"
        options={{
          title: "요청",
          tabBarIcon: ({ color }) => (
            <Ionicons name="send" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="topic"
        options={{
          title: "주제",
          tabBarIcon: ({ color }) => (
            <Ionicons name="flame" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "활동",
          tabBarIcon: ({ color }) => (
            <Ionicons name="compass-sharp" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "프로필",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
