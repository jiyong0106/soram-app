import QueryProvider from "@/utils/libs/QueryProvider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack, usePathname, Redirect, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
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

// 💥 NEW: 앱 초기화 로직을 담당하는 컴포넌트
function AppSetup() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const { socketStatus, consumePendingNavigation } = useAppInitStore();

  // 알림 및 캐시 관리
  useEffect(() => {
    const handleNotificationNavigation = (data: any) => {
      if (data?.url && typeof data.url === "string") {
        const url = `${data.url}?peerUserName=${encodeURIComponent(
          data.peerUserName || ""
        )}`;
        const connectionId = Number(data.id);
        const peerUserId = Number(data.peerUserId);
        const peerUserName = data.peerUserName;

        if (connectionId && peerUserId && peerUserName) {
          // 🔻🔻🔻 FIX: currentUserId는 여기서 선언 🔻🔻🔻
          const currentUserId = getUserIdFromJWT(token);

          queryClient.setQueryData<InfiniteData<GetChatResponse>>(
            ["getChatKey"],
            (oldData) => {
              // 🔻🔻🔻 FIX: null 체크는 콜백 내부 최상단에서 수행 🔻🔻🔻
              if (currentUserId === null) {
                console.error(
                  "[AppSetup] 유효한 유저 ID가 없어 캐시를 업데이트할 수 없습니다."
                );
                return oldData; // ✅ 이제 'oldData'에 접근 가능
              }
              const now = new Date().toISOString();
              const newItem: ChatItemType = {
                id: connectionId,
                status: "ACCEPTED",
                addresseeId: peerUserId,
                requesterId: currentUserId, // 1번 Fix에서 가져온 ID
                createdAt: now,
                updatedAt: now,
                lastMessage: null,
                isBlocked: toBoolParam(data.isBlocked),
                isLeave: toBoolParam(data.isLeave),

                // --- chat.ts에 맞춰 추가된 속성 ---
                voiceResponseId: 0, // 🚨 기본값 (또는 data에서 받아야 함)
                isMuted: false, // 🚨 기본값 (또는 data에서 받아야 함)
                opponent: {
                  id: peerUserId,
                  nickname: peerUserName,
                  // 🚨 UserType에 필요한 다른 속성이 있다면 추가해야 함
                },
              };

              // 기존 데이터가 없으면 새로운 구조 생성
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

              // 기존 데이터가 있으면, 중복을 확인하고 맨 앞에 추가
              const itemExists = oldData.pages.some((page) =>
                page.data.some((item) => item.id === connectionId)
              );

              if (itemExists) {
                return oldData;
              }

              const newData = { ...oldData };
              // unshift는 배열 자체를 변경하므로, 새로운 배열을 만들어 불변성 유지
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
        console.log(
          "알림 응답 페이로드 (앱 실행 중):",
          JSON.stringify(res, null, 2)
        );
        const data = res.notification.request.content.data as any;
        const url = handleNotificationNavigation(data);
        if (url) router.push(url as any);
      });

    (async () => {
      const initial = await Notifications.getLastNotificationResponseAsync();
      if (initial) {
        console.log(
          "알림 응답 페이로드 (콜드 스타트):",
          JSON.stringify(initial, null, 2)
        );
        const data = initial?.notification.request.content.data as any;
        const url = handleNotificationNavigation(data);
        if (url) useAppInitStore.getState().setPendingNavigation(url);
      }
    })();

    return () => {
      responseListener.remove();
    };
  }, [token, queryClient, router]);

  // 보류된 내비게이션 실행
  useEffect(() => {
    if (socketStatus === "AUTHENTICATED") {
      const pendingUrl = consumePendingNavigation();
      if (pendingUrl) {
        console.log(
          `[Navigation] 소켓 인증 완료. 보류된 URL로 이동: ${pendingUrl}`
        );
        setTimeout(() => router.push(pendingUrl as any), 0);
      }
    }
  }, [socketStatus, consumePendingNavigation, router]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    nsReg: require("../assets/fonts/NanumSquareNeo-bRg.ttf"),
    nsBol: require("../assets/fonts/NanumSquareNeo-cBd.ttf"),
  });
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const token = useAuthStore((s) => s.token);
  const needsRedirect = !!token && (pathname === "/" || pathname === "/index");

  // 앱 레벨 소켓 생명주기 관리
  useEffect(() => {
    if (token) {
      console.log("[SocketManager] 토큰 확인, 소켓 연결을 시작합니다.");
      connectSocket(token);
    } else {
      console.log("[SocketManager] 토큰 없음, 소켓 연결을 해제합니다.");
      disconnectSocket();
    }
    return () => {
      console.log(
        "[SocketManager] RootLayout 언마운트, 소켓 연결을 해제합니다."
      );
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
  }, [token]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && hydrated) await SplashScreen.hideAsync();
  }, [fontsLoaded, hydrated]);

  useEffect(() => {
    if (fontsLoaded && hydrated) SplashScreen.hideAsync();
  }, [fontsLoaded, hydrated]);

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
