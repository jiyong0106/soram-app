import { create } from "zustand";

type SocketStatus = "DISCONNECTED" | "CONNECTING" | "AUTHENTICATED";

interface AppInitState {
  socketStatus: SocketStatus;
  pendingNavigation: string | null;
  setSocketStatus: (status: SocketStatus) => void;
  setPendingNavigation: (url: string) => void;
  consumePendingNavigation: () => string | null;
}

export const useAppInitStore = create<AppInitState>((set, get) => ({
  socketStatus: "DISCONNECTED",
  pendingNavigation: null,
  setSocketStatus: (status) => set({ socketStatus: status }),
  setPendingNavigation: (url) => set({ pendingNavigation: url }),
  consumePendingNavigation: () => {
    const url = get().pendingNavigation;
    if (url) {
      set({ pendingNavigation: null }); // 소비 후 즉시 초기화
    }
    return url;
  },
}));
