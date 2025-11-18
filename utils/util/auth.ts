// app/utils/auth/token.ts
// “토큰 저장·복원·만료확인” 유틸 모듈
import { Buffer } from "buffer"; // RN 환경에서 base64 디코딩용

export const TOKEN_KEY = "access_token"; // (레거시 키, migrate에 활용 가능)
let memAccessToken: string | null = null; // 액세스 토큰(메모리)
let memRefreshToken: string | null = null; // 리프레시 토큰(메모리)

// 액세스 토큰 설정/조회 (요청 헤더 주입은 axios 인터셉터 담당)
export const setAuthToken = (t: string | null) => {
  memAccessToken = t;
};

// export const getAuthToken = () => memAccessToken; //axios.ts가 이제 사용 안하므로 주석처리

// 리프레시 토큰 설정/조회 (재발급 요청에만 사용)
export const setRefreshToken = (t: string | null) => {
  memRefreshToken = t;
};

// export const getRefreshToken = () => memRefreshToken; //axios.ts가 이제 사용 안하므로 주석처리

export const isTokenExpired = (t?: string | null) => {
  if (!t) return true;
  try {
    const [, payload] = t.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    const expMs = Number(json?.exp) * 1000;
    if (!expMs) return true;
    return expMs <= Date.now();
  } catch {
    return true;
  }
};
