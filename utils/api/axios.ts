// app/utils/api/api.ts (refactor)
import axios, { AxiosHeaders } from "axios";
import { getAuthToken, setAuthToken } from "@/utils/util/auth";

const instance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
});

// 공통 헤더 세터 (AxiosHeaders/POJO 모두 지원)
const setHeader = (headers: any, key: string, val?: string) => {
  if (!val) return;
  if (headers && typeof headers.set === "function") headers.set(key, val);
  else headers[key] = val;
};

// ===== 요청 인터셉터 =====
instance.interceptors.request.use((config) => {
  if (!config.headers) config.headers = new AxiosHeaders();

  // 메모리 토큰만 신뢰
  const token = getAuthToken();
  if (token) {
    setHeader(config.headers, "Authorization", `Bearer ${token}`);
  }

  // JSON만 Content-Type 지정 (FormData는 건드리지 않음)
  const hasBody = config.data && !(config.data instanceof FormData);
  const ct =
    (config.headers as any).get?.("Content-Type") ??
    (config.headers as any)["Content-Type"];

  if (hasBody && !ct)
    setHeader(config.headers, "Content-Type", "application/json");

  // 디버깅
  const url = (config.baseURL ?? "") + (config.url ?? "");
  const authHeader =
    (config.headers as any).get?.("Authorization") ??
    (config.headers as any)["Authorization"];
  console.log("[req]", config.method?.toUpperCase(), url);
  console.log("[req] Authorization present? ->", !!authHeader);

  return config;
});

// ===== 응답 인터셉터 (401 자동 갱신) =====
let refreshing: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
  try {
    console.log("[refresh] try refresh…");
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newToken: string | undefined = res.data?.accessToken;
    console.log("[refresh] success? ->", !!newToken);
    await setAuthToken(newToken ?? null);
    return newToken ?? null;
  } catch (e) {
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
    console.log(
      "[res] error status ->",
      response?.status,
      "url ->",
      config?.url
    );

    // 401이면 1회만 리프레시 시도 후 재요청
    if (response?.status === 401 && config && !(config as any)._retry) {
      (config as any)._retry = true;

      refreshing = refreshing ?? refreshToken();
      const newToken = await refreshing;

      if (!newToken) {
        console.log("[res] no new token, reject.");
        return Promise.reject(error);
      }

      if (!config.headers) config.headers = new AxiosHeaders();
      setHeader(config.headers, "Authorization", `Bearer ${newToken}`);

      console.log("[res] retrying:", config.method?.toUpperCase(), config.url);
      return instance(config);
    }

    return Promise.reject(error);
  }
);

export default instance;
