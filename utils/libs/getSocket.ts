import { io, Socket } from "socket.io-client";
import { useAppInitStore } from "../store/useAppInitStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
const SOCKET_PATH = process.env.EXPO_PUBLIC_SOCKET_PATH || "/socket.io/";

let socket: Socket | null = null;
let isAuthenticated = false;
// 인증이 완료되기를 기다리는 Promise의 resolve 함수들을 저장하는 배열
let authPromiseResolvers: (() => void)[] = [];

/**
 * 소켓이 연결되고 서버로부터 'authenticated' 이벤트를 받을 때까지 기다리는 Promise를 반환합니다.
 * 이미 인증된 상태라면 즉시 resolve됩니다.
 */
export function ensureSocketAuthenticated(): Promise<void> {
  if (socket?.connected && isAuthenticated) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    authPromiseResolvers.push(resolve);
  });
}

export function connectSocket(jwt: string) {
  if (socket?.connected) return socket;

  useAppInitStore.getState().setSocketStatus("CONNECTING");
  const namespaceUrl = `${BASE_URL}/chat`;

  // 'const'로 새 소켓 인스턴스를 명시적으로 선언
  const newSocket = io(namespaceUrl, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    extraHeaders: { Authorization: `Bearer ${jwt}` },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
  });

  newSocket.on("authenticated", () => {
    console.log("[getSocket] 소켓 인증 성공. 대기열의 작업을 실행합니다.");
    isAuthenticated = true;
    useAppInitStore.getState().setSocketStatus("AUTHENTICATED");
    // 기다리고 있던 모든 Promise들을 resolve 해줌
    authPromiseResolvers.forEach((resolve) => resolve());
    authPromiseResolvers = []; // 배열 비우기
  });

  // 'newSocket'의 핸들러 등록합니다.
  newSocket.on("disconnect", (reason) => {
    console.warn(`[getSocket] [disconnect] 소켓 연결 끊김. 사유: ${reason}`);
    isAuthenticated = false;
    useAppInitStore.getState().setSocketStatus("DISCONNECTED");

    // 이 이벤트가 발생한 소켓(newSocket)이
    // 현재 '전역 socket' 변수와 동일한 인스턴스일 때만 null로 설정
    // 이렇게 하면 오래된 소켓의 disconnect 이벤트가
    // 새로 활성화된 소켓을 null로 만드는 버그를 원천 차단
    if (socket === newSocket) {
      socket = null;
    }
  });

  newSocket.on("connect_error", (err) => {
    if (__DEV__) console.error(`소켓 연결 실패.`);
  });

  socket = newSocket;
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  isAuthenticated = false;
  authPromiseResolvers = [];
  useAppInitStore.getState().setSocketStatus("DISCONNECTED");
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
