import { useAppInitStore } from "@/utils/store/useAppInitStore";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { ChatItemType, GetChatResponse } from "@/utils/types/chat";
import { getUserIdFromJWT } from "@/utils/util/getUserIdFromJWT";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

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

export default AppSetup;
