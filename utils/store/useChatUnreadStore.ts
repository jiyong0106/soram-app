import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { debouncedAsyncStorage } from "./debouncedAsyncStorage";

type UnreadState = {
  activeConnectionId: number | null;
  unreadCountByConnectionId: Record<number, number>;
  // 메모리 전용(영속화하지 않음): 중복 증가 방지용
  lastSeenMessageIdByConnectionId: Record<number, number>;

  setActiveConnection: (id: number | null) => void;
  incrementUnread: (connectionId: number, messageId: number) => void;
  resetUnread: (connectionId: number) => void;
  resetAll: () => void;
};

export const useChatUnreadStore = create<UnreadState>()(
  persist(
    (set, get) => ({
      activeConnectionId: null,
      unreadCountByConnectionId: {},
      lastSeenMessageIdByConnectionId: {},

      setActiveConnection: (id) => set({ activeConnectionId: id }),

      incrementUnread: (connectionId, messageId) => {
        const { activeConnectionId, lastSeenMessageIdByConnectionId } = get();
        if (connectionId === activeConnectionId) return;
        if (lastSeenMessageIdByConnectionId[connectionId] === messageId) return;

        set((state) => {
          const prev = state.unreadCountByConnectionId[connectionId] ?? 0;
          return {
            unreadCountByConnectionId: {
              ...state.unreadCountByConnectionId,
              [connectionId]: prev + 1,
            },
            lastSeenMessageIdByConnectionId: {
              ...state.lastSeenMessageIdByConnectionId,
              [connectionId]: messageId,
            },
          };
        });
      },

      resetUnread: (connectionId) =>
        set((state) => ({
          unreadCountByConnectionId: {
            ...state.unreadCountByConnectionId,
            [connectionId]: 0,
          },
        })),

      resetAll: () =>
        set({
          unreadCountByConnectionId: {},
        }),
    }),
    {
      name: "chat-unread-store",
      storage: createJSONStorage(() => debouncedAsyncStorage as any),
      partialize: (s) => ({
        unreadCountByConnectionId: s.unreadCountByConnectionId,
      }),
      version: 1,
      // 선택: 하이드레이션 제어
      // skipHydration: true,
      // onRehydrateStorage: () => (state) => { ... },
    }
  )
);
