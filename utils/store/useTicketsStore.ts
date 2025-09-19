// stores/ticketsStore.ts
import { create } from "zustand";
import type { getTicketsResponse, TicketKind } from "@/utils/types/auth";

type TicketData = getTicketsResponse[TicketKind];
type DataStore = Record<TicketKind, TicketData>;

type TicketsState = {
  data: DataStore;
  initialized: boolean;
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
    set((s) => {
      const currentTicket = s.data[kind];
      if (!currentTicket) return s;
      const nextQuantity = Math.max(0, currentTicket.totalQuantity - n);
      return {
        data: {
          ...s.data,
          [kind]: { ...currentTicket, totalQuantity: nextQuantity },
        },
      };
    }),

  restoreLocal: (kind, n = 1) =>
    set((s) => {
      const currentTicket = s.data[kind];
      if (!currentTicket) return s;
      const nextQuantity = currentTicket.totalQuantity + n;
      return {
        data: {
          ...s.data,
          [kind]: { ...currentTicket, totalQuantity: nextQuantity },
        },
      };
    }),

  reset: () =>
    set({
      data: initialState,
      initialized: false,
    }),
}));
