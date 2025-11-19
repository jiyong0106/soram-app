import { create } from "zustand";

type UserBanState = {
  isVisible: boolean;
  show: (message: string) => void;
  hide: () => void;
  message: string;
};

export const useUserBanStore = create<UserBanState>((set) => ({
  isVisible: false,
  message: "",
  show: (message: string) => set({ isVisible: true, message }),
  hide: () => set({ isVisible: false }),
}));
