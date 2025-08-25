import QueryProvider from "@/utils/libs/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  // useEffect(() => { bootstrapAuthToken(); }, []);

  return (
    <GestureHandlerRootView>
      <QueryProvider>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(signup)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
