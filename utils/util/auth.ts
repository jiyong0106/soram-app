// app/utils/auth/token.ts
import * as SecureStore from "expo-secure-store";

// 저장 키
export const TOKEN_KEY = "access_token";

// 메모리 캐시(빠른 접근)
let memToken: string | null = null;

export const setAuthToken = async (t: string | null) => {
  memToken = t;
  if (t) await SecureStore.setItemAsync(TOKEN_KEY, t);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const getAuthToken = () => memToken;

export const bootstrapAuthToken = async () => {
  memToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return memToken;
};

// JWT exp 만료 여부
export const isTokenExpired = (t?: string | null) => {
  if (!t) return true;
  try {
    const [, payload] = t.split(".");
    // base64url → base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(
      // RN에는 atob가 없을 수 있으니 Buffer 사용
      Buffer.from(base64, "base64").toString("utf-8")
    );
    const expMs = Number(json?.exp) * 1000;
    if (!expMs) return true;
    return expMs <= Date.now();
  } catch {
    return true;
  }
};
