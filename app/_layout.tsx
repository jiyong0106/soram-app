import QueryProvider from "@/utils/libs/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // 예시: Pretendard 패밀리
    nsnReg: require("../assets/fonts/NanumSquareNeo-bRg.ttf"),
    nsnbol: require("../assets/fonts/NanumSquareNeo-cBd.ttf"),
    // 필요하면 추가:
  });

  // 폰트 로드 후 스플래시 종료
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 폰트 로드 전엔 렌더링 보류
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
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
