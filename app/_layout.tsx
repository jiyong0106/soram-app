import QueryProvider from "@/utils/libs/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, usePathname, Redirect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import TicketsBootstrap from "@/components/auth/TicketsBootstrap";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useChatListRealtime } from "@/utils/hooks/useChatListRealtime";
import { useEffect as useReactEffect } from "react";
import { useChatUnreadStore } from "@/utils/store/useChatUnreadStore";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  // 한글 주석: Provider 내부에서 실행되도록 부트스트랩 컴포넌트를 사용합니다.
  const RealtimeBootstrap = ({ token }: { token: string | null }) => {
    useChatListRealtime(token ?? "");
    return null;
  };

  // 한글 주석: 토큰 변경 시 현재 사용자 ID를 안읽음 스토어에 설정하여 사용자별 버킷을 사용
  useReactEffect(() => {
    const uid = getUserIdFromJWT(token);
    useChatUnreadStore.getState().setCurrentUser(uid);
  }, [token]);

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

  // 전역 알림 핸들러(모듈 1회 설정)
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  useEffect(() => {
    // Android 채널
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then(() => {
        // 필요시 채널 생성/업데이트 로직 추가 가능
      });
    }

    // 수신 리스너
    const notificationListener = Notifications.addNotificationReceivedListener(
      () => {
        // 필요 시 전역 토스트/로깅 등
      }
    );

    // 응답(클릭) 리스너
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(() => {
        // 필요 시 딥링크 라우팅 처리
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // 폰트/스토어 로드 전엔 렌더링 보류
  if (!fontsLoaded || !hydrated) return null;
  if (needsRedirect) return <Redirect href="/topic" />;

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <QueryProvider>
        {/* 한글 주석: React Query 컨텍스트 안에서 소켓 구독을 시작 */}
        <RealtimeBootstrap token={token} />
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
              <Stack.Screen name="alerts/index" />
            </Stack>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
