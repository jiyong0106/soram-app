import { io, Socket } from "socket.io-client";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
// 환경 변수에서 API 접두사와 소켓 경로 읽어오기
const SOCKET_PATH = process.env.EXPO_PUBLIC_SOCKET_PATH || "/socket.io/"; // 기본값 /socket.io/

let socket: Socket | null = null;

export function connectSocket(jwt: string) {
  if (socket?.connected) return socket; // API_PREFIX를 네임스페이스에 동적으로 적용

  const namespaceUrl = `${BASE_URL}/chat`;

  socket = io(namespaceUrl, {
    path: SOCKET_PATH,
    transports: ["websocket"], // 서버가 headers.authorization만 읽으므로 헤더로 전달해야 함
    extraHeaders: { Authorization: `Bearer ${jwt}` },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500, // 필요시 조절
  });

  socket.on("disconnect", (reason) => {
    console.warn(`[getSocket] [disconnect] 소켓 연결 끊김. 사유: ${reason}`);
    // 연결이 끊겼으므로 전역 소켓 변수를 null로 설정
    if (socket?.id === (socket as any).id) {
      socket = null;
    }
  });

  socket.on("connect_error", (err) => {
    console.error(`[getSocket] [connect_error] 소켓 연결 실패.`, err);
  });

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
