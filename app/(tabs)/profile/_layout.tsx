import { Stack } from "expo-router";

const ProfileLayout = () => {
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
export default ProfileLayout;
