import QueryProvider from "@/utils/libs/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, usePathname, Redirect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import TicketsBootstrap from "@/components/auth/TicketsBootstrap";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { registerForPushNotificationsAsync } from "@/utils/util/notificatoions";
import { usePushTokenStore } from "@/utils/store/usePushTokenStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setPushToken = usePushTokenStore((s) => s.setPushToken);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setPushToken(token);
        }
      })
      .catch((error) => {
        console.error("Failed to get push token", error);
      });
  }, []);

  const [fontsLoaded] = useFonts({
    // 예시: Pretendard 패밀리
    nsReg: require("../assets/fonts/NanumSquareNeo-bRg.ttf"),
    nsBol: require("../assets/fonts/NanumSquareNeo-cBd.ttf"),
    // 필요하면 추가:
  });
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);
  const needsRedirect = !!token && (pathname === "/" || pathname === "/index");

  // 폰트 로드 후 스플래시 종료
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && hydrated) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated]);

  // 준비 완료 시 스플래시 안전하게 해제 (Redirect 경로에서도 보장)
  useEffect(() => {
    if (fontsLoaded && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated]);

  // 폰트/스토어 로드 전엔 렌더링 보류
  if (!fontsLoaded || !hydrated) return null;
  if (needsRedirect) return <Redirect href="/topic" />;

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
