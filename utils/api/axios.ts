// api.ts
import axios, { AxiosHeaders } from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "access_token";
let memToken: string | null = null; // 빠른 접근을 위한 메모리 캐시

export const setAuthToken = async (t: string | null) => {
  memToken = t;
  if (t) await SecureStore.setItemAsync(TOKEN_KEY, t);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const bootstrapAuthToken = async () => {
  // 앱 시작 시 1회 로드
  memToken = await SecureStore.getItemAsync(TOKEN_KEY);
};

// Axios v1은 headers가 AxiosHeaders(객체)일 수도 있고 POJO일 수도 있음
const setHeader = (headers: any, key: string, val?: string) => {
  if (!val) return;
  if (headers && typeof headers.set === "function") headers.set(key, val);
  else headers[key] = val;
};

const instance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
  withCredentials: true, // 서버가 refresh httpOnly 쿠키를 쓴다면 유지
});

// 요청 인터셉터: 토큰 주입 + Content-Type 최소 설정
instance.interceptors.request.use(async (config) => {
  // headers가 비어있으면 안전하게 초기화
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (memToken) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${memToken}`);
    } else {
      (config.headers as any)["Authorization"] = `Bearer ${memToken}`;
    }
  }

  // JSON 바디일 때만 Content-Type 지정
  if (
    config.data &&
    !(config.data instanceof FormData) &&
    !config.headers.get?.("Content-Type")
  ) {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});

// ===== (선택) 401 자동 리프레시 큐잉 처리 =====
let refreshing: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newToken: string | undefined = res.data?.accessToken;
    await setAuthToken(newToken ?? null);
    return newToken ?? null;
  } catch {
    await setAuthToken(null);
    return null;
  } finally {
    refreshing = null;
  }
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (response?.status === 401 && config && !config._retry) {
      (config as any)._retry = true;

      // 동시 401들 한 번만 리프레시
      refreshing = refreshing ?? refreshToken();
      const newToken = await refreshing;

      if (!newToken) {
        // 필요 시: 여기서 로그아웃 처리/로그인 화면 이동 트리거
        return Promise.reject(error);
      }

      // 새 토큰으로 원 요청 재시도
      if (!config.headers) config.headers = {};
      setHeader(config.headers, "Authorization", `Bearer ${newToken}`);
      return instance(config);
    }
    return Promise.reject(error);
  }
);

export default instance;
