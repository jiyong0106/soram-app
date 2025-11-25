import axios, { AxiosHeaders } from "axios";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserBanStore } from "@/utils/store/useUserBanStore";

const instance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
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
  if (!config.headers) config.headers = new AxiosHeaders(); // Zustand 스토어에서 직접 토큰 조회

  const token = useAuthStore.getState().accessToken;
  if (token) {
    setHeader(config.headers, "Authorization", `Bearer ${token}`);
  } // JSON만 Content-Type 지정 (FormData는 건드리지 않음)

  const hasBody = config.data && !(config.data instanceof FormData);
  const ct =
    (config.headers as any).get?.("Content-Type") ??
    (config.headers as any)["Content-Type"];

  if (hasBody && !ct)
    setHeader(config.headers, "Content-Type", "application/json");

  return config;
});

// ===== 응답 인터셉터 (401 자동 갱신) =====
let refreshing: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
  try {
    // 스토어에서 RT를 직접 조회
    const rt = useAuthStore.getState().refreshToken; // [유지] RT가 없는 치명적 오류는 로그를 남기고 강제 로그아웃

    if (!rt) {
      // console.warn("[AUTH] RT가 없어 재발급을 중단하고 강제 로그아웃합니다.");
      useAuthStore.getState().logout();
      return null;
    }

    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
      undefined,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${rt}` }, // 리프레시 토큰을 Bearer로 전송
      }
    );
    const newAccessToken: string | undefined = res.data?.accessToken;
    const newRefreshToken: string | undefined = res.data?.refreshToken; // [유지] API는 성공했으나 서버가 토큰을 안 주는 '서버 오류' 경고

    if (!newAccessToken || !newRefreshToken) {
      console.warn(
        "[AUTH] API는 성공했으나, 응답 데이터에 토큰이 없습니다. 응답:"
      );
    } // Zustand 스토어에 새로운 토큰 저장

    useAuthStore
      .getState()
      .setTokens(newAccessToken ?? null, newRefreshToken ?? null);
    return newAccessToken ?? null;
  } catch (e: any) {
    // [유지] 404, 500 등 API 실패 시 오류 로그
    useAuthStore.getState().logout();
    return null;
  } finally {
    refreshing = null;
  }
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (response?.status === 401 && config && !(config as any)._retry) {
      (config as any)._retry = true;

      refreshing = refreshing ?? refreshToken();
      const newToken = await refreshing;

      if (!newToken) {
        // [유지] 토큰 갱신에 실패하여, 원래 요청도 최종 실패 처리됨을 알림

        return Promise.reject(error);
      }

      if (!config.headers) config.headers = new AxiosHeaders();
      setHeader(
        config.headers,
        "Authorization",
        `Bearer ${newToken}`
      ); /* // [제거] 성공적인 재시도 로그는 운영 환경에서 제거
      console.log(
        `[응답 인터셉터] 새 토큰으로 원래 요청을 재시도합니다: ${config.method?.toUpperCase()} ${
          config.url
        }`
      );
      */

      return instance(config);
    }
    if (
      response?.status === 403 &&
      response?.data?.errorCode === "USER_SUSPENDED"
    ) {
      // 전역 제재 모달 표시
      try {
        useUserBanStore.getState().show(response?.data?.message);
        useUserBanStore.getState().setExpiresAt(response?.data?.expiresAt);
      } catch {}
    }

    return Promise.reject(error);
  }
);

export default instance;
