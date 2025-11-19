import QueryProvider from "@/utils/libs/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, usePathname, Redirect, useRouter } from "expo-router";
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
import { connectSocket, disconnectSocket } from "@/utils/libs/getSocket";
import UserBanModal from "@/components/common/UserBanModal";
import AppSetup from "@/components/common/AppStepup";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const MIN_SPLASH_MS = 2000; // ***** 스플래시 최소 노출 시간(ms)
  const [fontsLoaded] = useFonts({
    nsReg: require("../assets/fonts/NanumSquareNeo-bRg.ttf"),
    nsBol: require("../assets/fonts/NanumSquareNeo-cBd.ttf"),
  });
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);
  const [minDelayPassed, setMinDelayPassed] = useState(false); // [제거] 렌더링, Hydration 완료 로그 등 디버깅 로그 모두 제거
  // 제재 모달 표시 상태

  const needsRedirect = !!token && (pathname === "/" || pathname === "/index"); // 스플래시 최소 2초 유지

  // ***** 앱 시작 후 스플래시 최소 2초 유지
  useEffect(() => {
    const t = setTimeout(() => setMinDelayPassed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []); // 앱 레벨 소켓 생명주기 관리

  useEffect(() => {
    if (token) {
      // [제거] 소켓 연결 시도/해제는 정상 흐름이므로 로그 제거
      connectSocket(token);
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  const RealtimeBootstrap = ({ token }: { token: string | null }) => {
    useChatListRealtime(token ?? "");
    return null;
  };

  useReactEffect(() => {
    const uid = getUserIdFromJWT(token);
    useChatUnreadStore.getState().setCurrentUser(uid);
  }, [token]); // 스플래시 숨기기(minDelayPassed 조건 충족 시)

  // ***** 스플래시 숨기기(minDelayPassed 조건 충족 시)
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && hydrated && minDelayPassed) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated, minDelayPassed]);

  // 한글 주석: onLayout 이전에도 모든 조건이 충족되면 안전하게 숨김 시도
  useEffect(() => {
    if (fontsLoaded && hydrated && minDelayPassed) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hydrated, minDelayPassed]); // 알림 핸들러 설정

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync();
    }
    const sub = Notifications.addNotificationReceivedListener(() => {});
    return () => sub.remove();
  }, []);

  if (!fontsLoaded || !hydrated) return null;

  if (needsRedirect) return <Redirect href="/topic" />;

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <QueryProvider>
        <AppSetup />
        <RealtimeBootstrap token={token} />
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <TicketsBootstrap />
            <UserBanModal />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(signup)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="topic/[topicId]" />
              <Stack.Screen name="alerts/index" />
            </Stack>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
