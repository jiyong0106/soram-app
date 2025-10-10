import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/utils/store/mmkv";

interface PushTokenState {
  pushToken: string | null;
  setPushToken: (token: string | null) => void;
  clear: () => void;
}

export const usePushTokenStore = create<PushTokenState>()(
  persist(
    (set) => ({
      pushToken: null,
      setPushToken: (token) => set({ pushToken: token }),
      clear: () => set({ pushToken: null }),
    }),
    {
      name: "push-token-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
