// app/utils/hooks/useChat.ts

import { useEffect, useRef, useState, useCallback } from "react";
import { connectSocket, getSocket } from "../libs/getSocket";
import { ChatMessageType } from "../types/chat";
import { useChatUnreadStore } from "../store/useChatUnreadStore";

// 🔧 MODIFIED: myUserId를 인자로 받도록 수정
export function useChat(
  jwt: string,
  connectionId: number,
  myUserId: number | undefined
) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const joinedRef = useRef(false);
  const lastReadMessageIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 🔧 MODIFIED: myUserId가 없을 경우를 대비한 방어 로직
    if (!jwt || !connectionId || !myUserId) return;

    const s = connectSocket(jwt);

    useChatUnreadStore.getState().resetUnread(connectionId);

    const onJoined = (payload: any) => {
      joinedRef.current = true;
      // console.log("[socket] joinedRoom:", payload);
    };

    const onNewMessage = (msg: ChatMessageType) => {
      // 🔧 MODIFIED: 새 메시지의 isRead 상태를 명확하게 처리
      const messageWithReadStatus = {
        ...msg,
        // 내가 보낸 메시지(서버 에코)는 항상 '안읽음' 상태로 추가합니다.
        // 상대가 보낸 메시지는 서버에서 온 isRead 값을 존중하거나, 없다면 true로 설정합니다.
        isRead: msg.senderId === myUserId ? false : msg.isRead ?? true,
      };
      setMessages((prev) => [...prev, messageWithReadStatus]);

      useChatUnreadStore.getState().resetUnread(connectionId);
    };

    const onMessagesRead = (payload: {
      connectionId: number;
      lastReadMessageId: number;
    }) => {
      if (payload.connectionId !== connectionId) return;
      if (!myUserId) return; // 방어 로직

      setMessages((prev) =>
        prev.map((msg) => {
          if (
            msg.senderId === myUserId &&
            msg.id <= payload.lastReadMessageId &&
            !msg.isRead
          ) {
            return { ...msg, isRead: true };
          }
          return msg;
        })
      );
    };

    s.on("joinedRoom", onJoined);
    s.on("newMessage", onNewMessage);
    s.on("chat:messages_read", onMessagesRead);

    const tryJoin = () => {
      if (!joinedRef.current) {
        s.emit("joinRoom", { connectionId });
      }
    };

    if (s.connected) tryJoin();
    s.on("authenticated", tryJoin);
    s.on("connect", tryJoin);

    return () => {
      s.off("joinedRoom", onJoined);
      s.off("newMessage", onNewMessage);
      s.off("chat:messages_read", onMessagesRead);
      s.emit("leaveRoom", { connectionId });
      // console.log("[socket] leaveRoom:", { connectionId });
    };
  }, [jwt, connectionId, myUserId]); // 🔧 MODIFIED: 의존성 배열에 myUserId 추가

  const sendMessage = useCallback(
    (content: string) => {
      const s = getSocket();
      if (!s?.connected) {
        console.warn("socket not connected");
        return;
      }
      s.emit("sendMessage", { connectionId, content });
    },
    [connectionId]
  );

  const readUpTo = useCallback(
    (lastMessageId: number) => {
      if (lastReadMessageIdRef.current === lastMessageId) return;

      const s = getSocket();
      if (!s?.connected) {
        console.warn("socket not connected for read event");
        return;
      }

      lastReadMessageIdRef.current = lastMessageId;
      s.emit("chat:read_up_to", { connectionId, lastMessageId });
    },
    [connectionId]
  );

  return { messages, sendMessage, readUpTo };
}
