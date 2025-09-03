import QueryProvider from "@/utils/libs/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import TicketsBootstrap from "@/components/auth/TicketsBootstrap";
import { useAuthStore } from "@/utils/sotre/useAuthStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // 예시: Pretendard 패밀리
    nsReg: require("../assets/fonts/NanumSquareNeo-bRg.ttf"),
    nsBol: require("../assets/fonts/NanumSquareNeo-cBd.ttf"),
    // 필요하면 추가:
  });
  const [bootstrapped, setBootstrapped] = useState(false);

  // 폰트 로드 후 스플래시 종료
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      await useAuthStore.getState().bootstrap();
      setBootstrapped(true);
    })();
  }, []);

  // 폰트 로드 전엔 렌더링 보류
  if (!fontsLoaded || !bootstrapped) return null; // 토큰/폰트 준비 전 렌더 보류

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <QueryProvider>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <TicketsBootstrap />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(signup)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="topic" />
            </Stack>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
