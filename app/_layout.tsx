import QueryProvider from "@/libs/QueryProvider";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(signUp)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryProvider>
  );
}
