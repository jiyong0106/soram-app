import { Stack } from "expo-router";

const ConnectLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};
export default ConnectLayout;
