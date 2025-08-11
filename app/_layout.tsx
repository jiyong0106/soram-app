import QueryProvider from "@/libs/QueryProvider";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <QueryProvider>
        <KeyboardProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(signUp)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </KeyboardProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
