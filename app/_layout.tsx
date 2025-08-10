import QueryProvider from "@/libs/QueryProvider";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
    <QueryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(signUp)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryProvider>
    // </SafeAreaView>
  );
}
