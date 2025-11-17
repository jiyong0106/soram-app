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
import { useAppInitStore } from "@/utils/store/useAppInitStore";
import { connectSocket, disconnectSocket } from "@/utils/libs/getSocket";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { GetChatResponse, ChatItemType } from "@/utils/types/chat";

SplashScreen.preventAutoHideAsync();

// 앱 초기화 로직을 담당하는 컴포넌트
function AppSetup() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const { socketStatus, consumePendingNavigation } = useAppInitStore(); // 알림 및 캐시 관리

  useEffect(() => {
    const handleNotificationNavigation = (data: any) => {
      if (data?.url && typeof data.url === "string") {
        const url = `${data.url}?peerUserId=${
          data.peerUserId
        }&peerUserName=${encodeURIComponent(data.peerUserName || "")}`;
        const connectionId = Number(data.id);
        const peerUserId = Number(data.peerUserId);
        const peerUserName = data.peerUserName;

        if (connectionId && peerUserId && peerUserName) {
          const currentUserId = getUserIdFromJWT(token);

          queryClient.setQueryData<InfiniteData<GetChatResponse>>(
            ["getChatKey"],
            (oldData) => {
              // [유지] 캐시 업데이트 실패는 중요한 오류 로그
              if (currentUserId === null) {
                return oldData;
              }
              const now = new Date().toISOString();
              const newItem: ChatItemType = {
                id: connectionId,
                status: data.status,
                addresseeId: currentUserId,
                requesterId: peerUserId,
                createdAt: now,
                updatedAt: now,
                lastMessage: null,
                isBlocked: toBoolParam(data.isBlocked),
                isLeave: toBoolParam(data.isLeave),
                voiceResponseId: 0,
                isMuted: false,
                opponent: {
                  id: peerUserId,
                  nickname: peerUserName,
                },
              };

              if (!oldData) {
                return {
                  pageParams: [undefined],
                  pages: [
                    {
                      data: [newItem],
                      meta: {
                        totalCount: 1,
                        hasNextPage: false,
                        take: 10,
                        endCursor: connectionId,
                      },
                    },
                  ],
                };
              }

              const itemExists = oldData.pages.some((page) =>
                page.data.some((item) => item.id === connectionId)
              );

              if (itemExists) {
                return oldData;
              }

              const newData = { ...oldData };
              const firstPageData = [newItem, ...newData.pages[0].data];
              newData.pages[0] = { ...newData.pages[0], data: firstPageData };

              return newData;
            }
          );
        }
        return url;
      }
      return null;
    };

    const toBoolParam = (param: string | undefined): boolean => {
      if (!param) return false;
      return ["true", "1", "yes"].includes(String(param).trim().toLowerCase());
    };

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((res) => {
        // console.log(
        //   "알림 응답 페이로드 (앱 실행 중):",
        //   JSON.stringify(res, null, 2)
        // );
        const data = res.notification.request.content.data as any;
        const url = handleNotificationNavigation(data);
        if (url) router.push(url as any);
      });

    (async () => {
      const initial = await Notifications.getLastNotificationResponseAsync();
      if (initial) {
        // console.log(
        //   "알림 응답 페이로드 (콜드 스타트):",
        //   JSON.stringify(initial, null, 2)
        // );
        const data = initial?.notification.request.content.data as any;
        const url = handleNotificationNavigation(data);
        if (url) useAppInitStore.getState().setPendingNavigation(url);
      }
    })();

    return () => {
      responseListener.remove();
    };
  }, [token, queryClient, router]); // 보류된 내비게이션 실행

  useEffect(() => {
    if (socketStatus === "AUTHENTICATED") {
      const pendingUrl = consumePendingNavigation();
      if (pendingUrl) {
        // console.log(
        //   `[Navigation] 소켓 인증 완료. 보류된 URL로 이동: ${pendingUrl}`
        // );
        setTimeout(() => router.push(pendingUrl as any), 0);
      }
    }
  }, [socketStatus, consumePendingNavigation, router]);

  return null;
}

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
