// hooks/useChat.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { connectSocket, getSocket } from "../libs/getSocket";
import { ChatMessage } from "../types/chat";

export function useChat(jwt: string, connectionId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const joinedRef = useRef(false);

  useEffect(() => {
    const s = connectSocket(jwt);

    const onJoined = (payload: any) => {
      // { message, connectionId }
      joinedRef.current = true;
      console.log("[socket] joinedRoom:", payload);
    };

    const onNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    s.on("joinedRoom", onJoined);
    s.on("newMessage", onNewMessage);

    // 인증이 완료된 뒤 조인 시도(연결 직후엔 인증 이벤트가 먼저 옴)
    const tryJoin = () => {
      if (!joinedRef.current) {
        s.emit("joinRoom", { connectionId }); // 서버는 @MessageBody('connectionId')로 받음
      }
    };

    // 연결되면 조인
    if (s.connected) tryJoin();
    s.on("authenticated", tryJoin);
    s.on("connect", tryJoin);

    return () => {
      s.off("joinedRoom", onJoined);
      s.off("newMessage", onNewMessage);
    };
  }, [jwt, connectionId]);

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

  return { messages, sendMessage };
}
