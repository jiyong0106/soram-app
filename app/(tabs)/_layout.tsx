import { Tabs } from "expo-router";
import { View, Text } from "react-native";

const TabLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#FF6F3C" }}>
      <Tabs.Screen
        name="chatList"
        options={{
          title: "Home",
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="home" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          title: "Settings",
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="cog" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Settings",
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="cog" color={color} />
          // ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
