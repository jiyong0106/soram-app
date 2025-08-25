// app/utils/api/api.ts (refactor)
import axios, { AxiosHeaders } from "axios";
import {
  bootstrapAuthToken,
  getAuthToken,
  setAuthToken,
} from "@/utils/util/auth";

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
instance.interceptors.request.use(async (config) => {
  if (!config.headers) config.headers = new AxiosHeaders();

  // 1) 메모리 토큰
  let token = getAuthToken();

  // 2) 부트스트랩 누락 보정 (필요 시 1회 SecureStore 로드)
  if (!token) {
    token = await bootstrapAuthToken();
    console.log(
      "[req] memToken was empty, loaded from SecureStore ->",
      !!token
    );
  }

  // 3) Authorization 주입
  if (token) {
    setHeader(config.headers, "Authorization", `Bearer ${token}`);
  }

  // 4) JSON만 Content-Type 지정 (FormData는 건드리지 않음)
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

// app/utils/api/api.ts (refactor-safe)
// import axios, { AxiosHeaders } from "axios";
// import { getAuthToken, setAuthToken } from "@/utils/util/auth";

// // ─────────────────────────────────────────────────────────────────────────────
// // Axios 인스턴스
// // ─────────────────────────────────────────────────────────────────────────────
// const instance = axios.create({
//   baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
//   withCredentials: true, // refresh 쿠키 사용 시 필요
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // 유틸: 공통 헤더 세터 (AxiosHeaders/POJO 모두 지원)
// // ─────────────────────────────────────────────────────────────────────────────
// const setHeader = (headers: any, key: string, val?: string) => {
//   if (!val) return;
//   if (headers && typeof headers.set === "function") headers.set(key, val);
//   else headers[key] = val;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // 세션 상태 가드
// //  - isLoggedOut: 로그아웃 플래그 (로그아웃 시 true)
// //  - authEpoch: 세션 버전 (로그아웃마다 증가 → refresh 경합 무효화)
// // ─────────────────────────────────────────────────────────────────────────────
// let isLoggedOut = false;
// let authEpoch = 0;

// export const markLoggedOut = () => {
//   isLoggedOut = true;
//   authEpoch += 1;
// };

// export const markLoggedIn = () => {
//   isLoggedOut = false;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // 요청 인터셉터
// //  - ✅ 매요청 SecureStore 부트스트랩 금지 (메모리 토큰만 사용)
// //  - ✅ JSON만 Content-Type 지정 (FormData는 건드리지 않음)
// // ─────────────────────────────────────────────────────────────────────────────
// instance.interceptors.request.use(async (config) => {
//   if (!config.headers) config.headers = new AxiosHeaders();

//   // 메모리 토큰만 신뢰
//   const token = getAuthToken();
//   if (token) {
//     setHeader(config.headers, "Authorization", `Bearer ${token}`);
//   }

//   // JSON만 Content-Type 자동 지정
//   const hasBody = config.data && !(config.data instanceof FormData);
//   const ct =
//     (config.headers as any).get?.("Content-Type") ??
//     (config.headers as any)["Content-Type"];
//   if (hasBody && !ct) {
//     setHeader(config.headers, "Content-Type", "application/json");
//   }

//   // 디버깅
//   const url = (config.baseURL ?? "") + (config.url ?? "");
//   const authHeader =
//     (config.headers as any).get?.("Authorization") ??
//     (config.headers as any)["Authorization"];
//   console.log("[req]", config.method?.toUpperCase(), url);
//   console.log("[req] Authorization present? ->", !!authHeader);

//   return config;
// });

// // ─────────────────────────────────────────────────────────────────────────────
// // 응답 인터셉터 (401 자동 갱신)
// //  - ✅ 로그아웃 상태면 절대 재발급 금지
// //  - ✅ memToken 없으면 재발급 금지
// //  - ✅ authEpoch로 경합/되살아남 방지
// // ─────────────────────────────────────────────────────────────────────────────
// let refreshing: Promise<string | null> | null = null;

// const refreshToken = async (): Promise<string | null> => {
//   const myEpoch = authEpoch; // 경합 스냅샷
//   try {
//     console.log("[refresh] try refresh…");
//     const res = await axios.post(
//       `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/refresh`,
//       {},
//       { withCredentials: true }
//     );
//     // 로그아웃 이후면 무효화
//     if (authEpoch !== myEpoch) {
//       console.log("[refresh] epoch changed, discard");
//       return null;
//     }

//     const newToken: string | undefined = res.data?.accessToken;
//     console.log("[refresh] success? ->", !!newToken);
//     await setAuthToken(newToken ?? null);
//     if (newToken) markLoggedIn();
//     return newToken ?? null;
//   } catch (e) {
//     await setAuthToken(null);
//     return null;
//   } finally {
//     refreshing = null;
//   }
// };

// instance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const { response, config } = error || {};
//     console.log(
//       "[res] error status ->",
//       response?.status,
//       "url ->",
//       config?.url
//     );

//     const hasToken = !!getAuthToken();

//     // 401 처리 조건:
//     // - 요청 config 존재
//     // - 아직 리트라이 안 함
//     // - 메모리 토큰이 존재
//     // - 로그아웃 상태가 아님
//     if (
//       response?.status === 401 &&
//       config &&
//       !(config as any)._retry &&
//       hasToken &&
//       !isLoggedOut
//     ) {
//       (config as any)._retry = true;

//       refreshing = refreshing ?? refreshToken();
//       const newToken = await refreshing;

//       if (!newToken) {
//         console.log("[res] no new token, reject.");
//         return Promise.reject(error);
//       }

//       if (!config.headers) config.headers = new AxiosHeaders();
//       setHeader(config.headers, "Authorization", `Bearer ${newToken}`);

//       console.log("[res] retrying:", config.method?.toUpperCase(), config.url);
//       return instance(config);
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
