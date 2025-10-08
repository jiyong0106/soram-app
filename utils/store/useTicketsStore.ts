// stores/ticketsStore.ts
import { create } from "zustand";
import type {
  getTicketsResponse,
  TicketKind,
  TicketBreakdownItem,
  TicketSourceType,
} from "@/utils/types/auth";

type TicketData = getTicketsResponse[TicketKind];
type DataStore = Record<TicketKind, TicketData>;

type TicketsState = {
  data: DataStore;
  initialized: boolean;
  // 한글 주석: 낙관적 차감 시 어떤 항목에서 소모했는지 기록(복구용)
  consumedStack: Record<
    TicketKind,
    { sourceType: TicketSourceType; expiresAt: string | null }[]
  >;
  setFromResponse: (resp: getTicketsResponse) => void;
  has: (kind: TicketKind) => boolean;
  consumeLocal: (kind: TicketKind, n?: number) => void;
  restoreLocal: (kind: TicketKind, n?: number) => void;
  reset: () => void;
};

const initialState = {
  CHAT: { totalQuantity: 0, breakdown: [] },
  VIEW_RESPONSE: { totalQuantity: 0, breakdown: [] },
};

export const useTicketsStore = create<TicketsState>((set, get) => ({
  data: initialState,
  initialized: false,
  consumedStack: { CHAT: [], VIEW_RESPONSE: [] },

  setFromResponse: (resp) => {
    set((s) => {
      const responseData = resp || {};

      const next: DataStore = {
        CHAT: responseData.CHAT ?? initialState.CHAT,
        VIEW_RESPONSE: responseData.VIEW_RESPONSE ?? initialState.VIEW_RESPONSE,
      };

      if (JSON.stringify(s.data) === JSON.stringify(next) && s.initialized) {
        return s;
      }
      return { data: next, initialized: true };
    });
  },

  has: (kind) => (get().data[kind]?.totalQuantity ?? 0) > 0,

  consumeLocal: (kind, n = 1) =>
    set((state) => {
      const currentBundle = state.data[kind];
      if (!currentBundle) return state;

      // 총량 차감
      const nextTotal = Math.max(0, currentBundle.totalQuantity - n);

      // breakdown 차감 로직: 만료 임박 순(earliest expiresAt)으로 차감
      const nextBreakdown = [...(currentBundle.breakdown || [])];
      // null 만료일은 가장 뒤로 가도록 정렬
      const sortByExpiryAsc = (
        a: TicketBreakdownItem,
        b: TicketBreakdownItem
      ) => {
        const ax = a.expiresAt
          ? new Date(a.expiresAt).getTime()
          : Number.POSITIVE_INFINITY;
        const bx = b.expiresAt
          ? new Date(b.expiresAt).getTime()
          : Number.POSITIVE_INFINITY;
        if (ax !== bx) return ax - bx;
        // 만료일 동일 시 DAILY 우선 차감(소멸이 빠른 성격), 다음 EVENT, 마지막 PAID
        const priority: Record<TicketSourceType, number> = {
          DAILY: 0,
          EVENT: 1,
          PAID: 2,
        };
        return priority[a.sourceType] - priority[b.sourceType];
      };

      nextBreakdown.sort(sortByExpiryAsc);

      const consumed: {
        sourceType: TicketSourceType;
        expiresAt: string | null;
      }[] = [];
      let remain = n;
      for (let i = 0; i < nextBreakdown.length && remain > 0; i++) {
        const item = nextBreakdown[i];
        const useCount = Math.min(item.quantity, remain);
        if (useCount <= 0) continue;
        item.quantity -= useCount;
        remain -= useCount;
        // 기록(복구용). 개수만큼 스택에 푸시(수량이 작아 일반적으로 성능 OK)
        for (let c = 0; c < useCount; c++) {
          consumed.push({
            sourceType: item.sourceType,
            expiresAt: item.expiresAt || null,
          });
        }
      }
      // 수량 0인 항목 제거
      const cleanedBreakdown = nextBreakdown.filter((it) => it.quantity > 0);

      return {
        data: {
          ...state.data,
          [kind]: {
            ...currentBundle,
            totalQuantity: nextTotal,
            breakdown: cleanedBreakdown,
          },
        },
        consumedStack: {
          ...state.consumedStack,
          [kind]: [...state.consumedStack[kind], ...consumed],
        },
      };
    }),

  restoreLocal: (kind, n = 1) =>
    set((state) => {
      const currentBundle = state.data[kind];
      if (!currentBundle) return state;

      let remaining = n;
      const nextBreakdown = [...(currentBundle.breakdown || [])];
      const stack = [...state.consumedStack[kind]];

      // 최근 소비 항목부터 복구
      while (remaining > 0 && stack.length > 0) {
        const last = stack.pop()!;
        // 동일한 sourceType & expiresAt 항목 찾기
        const idx = nextBreakdown.findIndex(
          (it) =>
            it.sourceType === last.sourceType &&
            (it.expiresAt || null) === last.expiresAt
        );
        if (idx >= 0) {
          nextBreakdown[idx] = {
            ...nextBreakdown[idx],
            quantity: nextBreakdown[idx].quantity + 1,
          };
        } else {
          // 존재하지 않으면 새 항목 추가
          nextBreakdown.push({
            sourceType: last.sourceType,
            quantity: 1,
            expiresAt: last.expiresAt ?? new Date().toISOString(),
          });
        }
        remaining -= 1;
      }

      return {
        data: {
          ...state.data,
          [kind]: {
            ...currentBundle,
            totalQuantity: currentBundle.totalQuantity + n,
            breakdown: nextBreakdown,
          },
        },
        consumedStack: { ...state.consumedStack, [kind]: stack },
      };
    }),

  reset: () =>
    set({
      data: initialState,
      initialized: false,
      consumedStack: { CHAT: [], VIEW_RESPONSE: [] },
    }),
}));
