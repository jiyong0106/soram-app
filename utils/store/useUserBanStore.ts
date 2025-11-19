import { create } from "zustand";

type UserBanState = {
  isVisible: boolean;
  show: (message: string) => void;
  hide: () => void;
  message: string;
  expiresAt: Date;
  setExpiresAt: (expiresAt: Date) => void;
};

export const useUserBanStore = create<UserBanState>((set) => ({
  isVisible: false,
  message: "",
  expiresAt: new Date(),
  setExpiresAt: (expiresAt: Date) => set({ expiresAt }),
  show: (message: string) => set({ isVisible: true, message }),
  hide: () => set({ isVisible: false }),
}));
