import { create } from "zustand";

type NotificationState = {
  hasUnread: boolean;
  setHasUnread: (hasUnread: boolean) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  hasUnread: false,
  setHasUnread: (hasUnread) => set({ hasUnread }),
}));
