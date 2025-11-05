// utils/socket.ts
import { io, Socket } from "socket.io-client";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!; // "https://soram.team"
let socket: Socket | null = null;

export function connectSocket(jwt: string) {
  if (socket?.connected) return socket;

  // 네임스페이스 URL에 '/api/v1' 접두사 포함
  const namespaceUrl = `${BASE_URL}/api/v1/chat`;

  socket = io(namespaceUrl, {
    // socket.io 핸드셰이크 경로에도 '/api/v1' 접두사 알려주기
    path: "/api/v1/socket.io/",

    // ✅ 서버가 headers.authorization만 읽으므로 헤더로 전달해야 함
    extraHeaders: { Authorization: `Bearer ${jwt}` },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500, // 필요시 조절
  });

  // 디버깅/로그
  // socket.on("connect", () => console.log("[socket] connected:", socket?.id));
  // socket.on("disconnect", (reason) =>
  //   console.log("[socket] disconnected:", reason)
  // );
  // socket.on("connect_error", (err) =>
  //   console.log("[socket] connect_error:", err.message)
  // );

  // 서버가 인증완료 시 내려줌
  socket.on("authenticated", () => console.log("[socket] authenticated"));

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
