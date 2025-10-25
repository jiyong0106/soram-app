import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { debouncedAsyncStorage } from "./debouncedAsyncStorage";

type UnreadState = {
  // 현재 로그인한 사용자 ID (토큰에서 설정). null이면 동작하지 않음
  currentUserId: number | null;
  activeConnectionId: number | null;

  // 사용자별 → 대화방별 안읽음 카운트 (영속화 대상)
  unreadCountByUserId: Record<number, Record<number, number>>;

  // 사용자별 → 대화방별 마지막 처리 메시지 ID (메모리 전용)
  lastSeenMessageIdByUserId: Record<number, Record<number, number>>;

  setCurrentUser: (userId: number | null) => void;
  setActiveConnection: (id: number | null) => void;
  incrementUnread: (
    connectionId: number,
    messageId: number,
    userId?: number
  ) => void;
  resetUnread: (connectionId: number, userId?: number) => void;
  resetAllForUser: (userId?: number) => void;
};

export const useChatUnreadStore = create<UnreadState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      activeConnectionId: null,
      unreadCountByUserId: {},
      lastSeenMessageIdByUserId: {},

      setCurrentUser: (userId) =>
        set((state) => {
          // 레거시 마이그레이션: 임시 버킷(0번 키)이 있고, 새 유저 버킷이 없으면 이동
          const legacy = (state as any).unreadCountByConnectionId as
            | Record<number, number>
            | undefined;
          const nextUnread = { ...state.unreadCountByUserId };
          if (legacy && userId != null && nextUnread[userId] == null) {
            nextUnread[userId] = { ...legacy };
            // @ts-expect-error legacy 필드는 더 이상 사용하지 않음
            (state as any).unreadCountByConnectionId = undefined;
          }
          return { currentUserId: userId, unreadCountByUserId: nextUnread };
        }),

      setActiveConnection: (id) => set({ activeConnectionId: id }),

      incrementUnread: (connectionId, messageId, userIdArg) => {
        const { activeConnectionId, currentUserId, lastSeenMessageIdByUserId } =
          get();
        const userId = userIdArg ?? currentUserId;
        if (userId == null) return;
        if (connectionId === activeConnectionId) return;

        const lastSeenByConn = lastSeenMessageIdByUserId[userId] ?? {};
        if (lastSeenByConn[connectionId] === messageId) return;

        set((state) => {
          const perUser = state.unreadCountByUserId[userId] ?? {};
          const prev = perUser[connectionId] ?? 0;
          const nextPerUser = { ...perUser, [connectionId]: prev + 1 };
          const nextUnread = {
            ...state.unreadCountByUserId,
            [userId]: nextPerUser,
          };

          const nextLastSeenByConn = {
            ...(state.lastSeenMessageIdByUserId[userId] ?? {}),
            [connectionId]: messageId,
          };
          const nextLastSeen = {
            ...state.lastSeenMessageIdByUserId,
            [userId]: nextLastSeenByConn,
          };

          return {
            unreadCountByUserId: nextUnread,
            lastSeenMessageIdByUserId: nextLastSeen,
          };
        });
      },

      resetUnread: (connectionId, userIdArg) =>
        set((state) => {
          const userId = userIdArg ?? state.currentUserId;
          if (userId == null) return {} as any;
          const perUser = state.unreadCountByUserId[userId] ?? {};
          const nextPerUser = { ...perUser, [connectionId]: 0 };
          return {
            unreadCountByUserId: {
              ...state.unreadCountByUserId,
              [userId]: nextPerUser,
            },
          };
        }),

      resetAllForUser: (userIdArg) =>
        set((state) => {
          const userId = userIdArg ?? state.currentUserId;
          if (userId == null) return {} as any;
          return {
            unreadCountByUserId: {
              ...state.unreadCountByUserId,
              [userId]: {},
            },
          };
        }),
    }),
    {
      name: "chat-unread-store",
      storage: createJSONStorage(() => debouncedAsyncStorage as any),
      partialize: (s) => ({
        unreadCountByUserId: s.unreadCountByUserId,
      }),
      version: 2,
      migrate: async (persisted: any, fromVersion: number) => {
        if (fromVersion < 2) {
          const legacy = persisted?.unreadCountByConnectionId ?? {};
          const unreadCountByUserId = Object.keys(legacy).length
            ? { 0: legacy }
            : {};
          return { unreadCountByUserId };
        }
        return persisted as any;
      },
    }
  )
);
