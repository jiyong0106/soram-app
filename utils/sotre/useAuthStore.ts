// utils/store/useAuthStore.ts
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { setAuthToken, TOKEN_KEY } from "@/utils/util/auth"; // axios 헤더 세팅 유틸

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => Promise<void>;
  bootstrap: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: async (t) => {
    // 1) axios Authorization 헤더 동기화
    await setAuthToken(t);
    // 2) SecureStore 동기화
    if (t) await SecureStore.setItemAsync(TOKEN_KEY, t);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
    // 3) 메모리 반영(반응형)
    set({ token: t });
  },
  bootstrap: async () => {
    const t = await SecureStore.getItemAsync(TOKEN_KEY);
    await setAuthToken(t);
    set({ token: t });
  },
}));
