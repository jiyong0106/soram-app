// utils/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isTokenExpired, setAuthToken, TOKEN_KEY } from "@/utils/util/auth";
import * as SecureStore from "expo-secure-store";
import { secureJSONStorage } from "./secureStore";

type AuthState = {
  token: string | null;
  hydrated: boolean; // 복원 완료 플래그
  setToken: (t: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      hydrated: false,
      setToken: (t) => {
        setAuthToken(t); // 헤더 + 메모리
        set({ token: t }); // 상태 변경 → persist가 자동 저장
      },
      logout: () => {
        setAuthToken(null);
        set({ token: null });
      },
    }),
    {
      name: "auth-store", // 새로운 persist 키(JSON 구조)
      storage: secureJSONStorage, // SecureStore 기반 저장
      partialize: (s) => ({ token: s.token }), // 토큰만 저장
      version: 2,
      // 복원(리하이드레이트) 전/후 훅
      onRehydrateStorage: () => (state, err) => {
        if (err) {
          // 저장 손상 등 에러면 안전 초기화
          setAuthToken(null);
          useAuthStore.setState({ token: null, hydrated: true });
          return;
        }
        const t = state?.token ?? null;
        if (!t || isTokenExpired(t)) {
          setAuthToken(null);
          useAuthStore.setState({ token: null, hydrated: true });
        } else {
          setAuthToken(t);
          useAuthStore.setState({ hydrated: true });
        }
      },
      // (선택) 레거시 단일 키 'access_token'을 새 구조로 1회 이관
      migrate: async (persisted, fromVersion) => {
        if ((persisted as any)?.token) return persisted;
        const legacy = await SecureStore.getItemAsync(TOKEN_KEY);
        if (legacy) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          return { ...(persisted as any), token: legacy };
        }
        return persisted as any;
      },
    }
  )
);
