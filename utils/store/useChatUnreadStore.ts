import { create } from "zustand";
import { persist } from "zustand/middleware";

type UnreadState = {
  // 현재 사용자가 보고 있는 방 id (읽음 처리 기준)
  activeConnectionId: number | null;
  // 방별 안읽은 수
  unreadCountByConnectionId: Record<number, number>;
  // 방별 마지막으로 처리한 메시지 id (중복 증가 방지)
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
        // 현재 보고있는 방이면 증가하지 않음
        if (connectionId === activeConnectionId) return;
        // 같은 메시지를 두 번 처리하지 않음
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

      resetAll: () => set({ unreadCountByConnectionId: {} }),
    }),
    {
      name: "chat-unread-store",
      partialize: (s) => ({
        unreadCountByConnectionId: s.unreadCountByConnectionId,
        lastSeenMessageIdByConnectionId: s.lastSeenMessageIdByConnectionId,
      }),
      version: 1,
    }
  )
);
