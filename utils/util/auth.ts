// app/utils/auth/token.ts
// “토큰 저장·복원·만료확인” 유틸 모듈
import { Buffer } from "buffer"; // RN 환경에서 base64 디코딩용

export const TOKEN_KEY = "access_token"; // (레거시 키, migrate에 활용 가능)
let memToken: string | null = null;

export const setAuthToken = (t: string | null) => {
  // 메모리만 갱신 (헤더 주입은 axios 요청 인터셉터가 담당)
  memToken = t;
};

export const getAuthToken = () => memToken;

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
