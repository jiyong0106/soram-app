import QueryProvider from "@/libs/QueryProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <QueryProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="signUp"
            options={{
              headerStyle: {
                backgroundColor: "white",
                
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="keyboard-backspace"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              ),
              headerTitle: "",
            }}
          />
        </Stack>
      </QueryProvider>
    </SafeAreaView>
  );
}
