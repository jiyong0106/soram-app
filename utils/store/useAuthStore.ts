// utils/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  isTokenExpired,
  setAuthToken,
  setRefreshToken,
  TOKEN_KEY,
} from "@/utils/util/auth";
import * as SecureStore from "expo-secure-store";
import { secureJSONStorage } from "./secureStore";

type AuthState = {
  // 호환용: 기존 코드가 참조하는 필드 (accessToken과 동일 의미)
  token: string | null;
  // 신규 필드: 명시적 구분
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean; // 복원 완료 플래그
  // 호환용: 액세스 토큰만 갱신
  setToken: (t: string | null) => void;
  // 신규: 두 토큰 동시 갱신
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      setToken: (t) => {
        // 액세스 토큰만 갱신 (기존 호환)
        setAuthToken(t);
        set({ token: t, accessToken: t });
      },
      setTokens: (accessToken, refreshToken) => {
        // 메모리 반영
        setAuthToken(accessToken);
        setRefreshToken(refreshToken);
        // 상태 저장 → persist
        set({ token: accessToken, accessToken, refreshToken });
      },
      logout: () => {
        setAuthToken(null);
        setRefreshToken(null);
        set({ token: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "auth-store",
      storage: secureJSONStorage, // SecureStore 기반 저장
      partialize: (s) => ({
        token: s.token,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
      version: 3,
      // 복원(리하이드레이트) 전/후 훅
      onRehydrateStorage: () => (state, err) => {
        if (err) {
          // 저장 손상 등 에러면 안전 초기화
          setAuthToken(null);
          setRefreshToken(null);
          useAuthStore.setState({
            token: null,
            accessToken: null,
            refreshToken: null,
            hydrated: true,
          });
          return;
        }
        const accessToken = state?.accessToken ?? state?.token ?? null;
        const refreshToken = state?.refreshToken ?? null;

        // 메모리 주입
        if (!accessToken || isTokenExpired(accessToken)) {
          setAuthToken(null);
        } else {
          setAuthToken(accessToken);
        }
        setRefreshToken(refreshToken ?? null);

        // 하이드레이션 완료 플래그
        useAuthStore.setState({ hydrated: true, token: accessToken ?? null });
      },
      // (선택) 레거시 단일 키 'access_token'을 새 구조로 1회 이관
      migrate: async (persisted, fromVersion) => {
        // v2 -> v3 마이그레이션: token만 있는 경우 accessToken으로 복사, refreshToken은 없음
        const p: any = { ...(persisted as any) };
        if (fromVersion < 3) {
          if (!p.accessToken && p.token) p.accessToken = p.token;
          if (!("refreshToken" in p)) p.refreshToken = null;
        }
        // v1 레거시 단일 키 → token으로 이동
        if (!p.token) {
          const legacy = await SecureStore.getItemAsync(TOKEN_KEY);
          if (legacy) {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            p.token = legacy;
            if (!p.accessToken) p.accessToken = legacy;
          }
        }
        return p;
      },
    }
  )
);
