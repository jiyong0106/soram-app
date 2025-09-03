// stores/ticketsStore.ts
import { create } from "zustand";
import type { getTicketsResponse, TicketKind } from "@/utils/types/auth";

type Counts = Record<TicketKind, number>;

type TicketsState = {
  counts: Counts;
  initialized: boolean;
  setFromResponse: (resp: getTicketsResponse) => void;
  has: (kind: TicketKind) => boolean;
  consumeLocal: (kind: TicketKind, n?: number) => void;
  restoreLocal: (kind: TicketKind, n?: number) => void;
  reset: () => void; // 👈 추가
};

export const useTicketsStore = create<TicketsState>((set, get) => ({
  counts: { CHAT: 0, NEW_RESPONSE: 0, MORE_RESPONSE: 0 },
  initialized: false,

  setFromResponse: (resp) =>
    set((s) => {
      const next: Counts = {
        CHAT: resp.CHAT?.totalQuantity ?? 0,
        NEW_RESPONSE: resp.NEW_RESPONSE?.totalQuantity ?? 0,
        MORE_RESPONSE: resp.MORE_RESPONSE?.totalQuantity ?? 0,
      };
      const same =
        s.counts.CHAT === next.CHAT &&
        s.counts.NEW_RESPONSE === next.NEW_RESPONSE &&
        s.counts.MORE_RESPONSE === next.MORE_RESPONSE;

      if (same && s.initialized) return s;
      return { counts: next, initialized: true };
    }),

  has: (kind) => get().counts[kind] > 0,

  consumeLocal: (kind, n = 1) =>
    set((s) => ({
      counts: { ...s.counts, [kind]: Math.max(0, s.counts[kind] - n) },
    })),

  restoreLocal: (kind, n = 1) =>
    set((s) => ({ counts: { ...s.counts, [kind]: s.counts[kind] + n } })),

  reset: () =>
    set({
      counts: { CHAT: 0, NEW_RESPONSE: 0, MORE_RESPONSE: 0 },
      initialized: false,
    }), // 👈
}));
