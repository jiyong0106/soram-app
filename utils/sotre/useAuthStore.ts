// utils/store/useAuthStore.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { setAuthToken, TOKEN_KEY } from "@/utils/util/auth";

//토큰값 전역으로 관리하는 스토어
type AuthState = {
  token: string | null;
  setToken: (t: string | null) => Promise<void>;
  bootstrap: () => Promise<void>;
};

//전역 상태로 token을 들고 UI와 반응형으로 연결
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: async (t) => {
    // 1) axios Authorization 헤더 동기화
    await setAuthToken(t);

    // 2) 메모리 반영(반응형)
    set({ token: t });
  },
  bootstrap: async () => {
    const t = await SecureStore.getItemAsync(TOKEN_KEY);
    await setAuthToken(t);
    set({ token: t });
  },
}));
