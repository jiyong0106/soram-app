import { Stack } from "expo-router";

const ChatListLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};
export default ChatListLayout;
