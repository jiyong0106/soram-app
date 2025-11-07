import { useEffect, useMemo } from "react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { connectSocket } from "../libs/getSocket";
import { ChatItemType, GetChatResponse, ChatMessageType } from "../types/chat";
import { useChatUnreadStore } from "../store/useChatUnreadStore";
import { getUserIdFromJWT } from "../util/getUserIdFromJWT";

/**
 * 채팅 목록(대화방 리스트)을 소켓 이벤트로 실시간 업데이트하는 훅
 * - 개인 채널 이벤트 수신(updateChatList): 해당 대화 아이템의 lastMessage를 갱신하고 리스트 최상단으로 이동
 */
export function useChatListRealtime(jwt: string) {
  const queryClient = useQueryClient();
  const myUserId = useMemo(() => getUserIdFromJWT(jwt) ?? undefined, [jwt]);

  useEffect(() => {
    if (!jwt) return;

    // 소켓 연결 (이미 연결되어 있으면 재사용)
    const socket = connectSocket(jwt);

    // 개인 채널(user-<id>)에서 수신되는 목록 갱신 신호
    const onUpdateChatList = (msg: ChatMessageType) => {
      const { connectionId, content, createdAt } = msg || {};
      if (!connectionId) return;

      // 목록 캐시 갱신
      queryClient.setQueryData<InfiniteData<GetChatResponse>>(
        ["getChatKey"],
        (old) => {
          if (!old) return old as any;

          // 페이지들에서 해당 아이템을 찾아 제거하고 업데이트된 아이템 생성
          let updatedItem: ChatItemType | null = null;
          const newPages = old.pages.map((page) => {
            const rest: ChatItemType[] = [];
            for (const it of page.data) {
              if (it.id === connectionId) {
                updatedItem = {
                  ...it,
                  lastMessage: { content, createdAt },
                } as ChatItemType;
              } else {
                rest.push(it);
              }
            }
            return { ...page, data: rest };
          });

          // 목록에 해당 아이템이 없으면 서버 데이터 최신화를 유도
          if (!updatedItem) {
            // 비동기로 무효화 트리거 (setQueryData 내부에서 바로 호출 지양)
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ["getChatKey"] });
            }, 0);
            return old;
          }

          // 첫 페이지 맨 앞에 삽입 (일반 채팅 앱 동작)
          if (newPages.length === 0) return old; // 방어로직
          newPages[0] = {
            ...newPages[0],
            data: [updatedItem, ...newPages[0].data],
          };

          return { ...old, pages: newPages };
        }
      );

      // 안읽은 카운트 증가: 활성 방이 아니고, 내가 보낸 메시지가 아닐 때만 증가
      try {
        if (!myUserId || msg.senderId !== myUserId) {
          useChatUnreadStore
            .getState()
            .incrementUnread(connectionId, msg.id, myUserId);
        }
      } catch {}
    };

    socket.on("updateChatList", onUpdateChatList);

    return () => {
      socket.off("updateChatList", onUpdateChatList);
    };
  }, [jwt, queryClient]);
}
