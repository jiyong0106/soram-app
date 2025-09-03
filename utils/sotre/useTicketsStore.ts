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
};

export const useTicketsStore = create<TicketsState>((set, get) => ({
  counts: { CHAT: 0, NEW_RESPONSE: 0, MORE_RESPONSE: 0 },
  initialized: false,

  // 동일 값이면 업데이트 생략(불필요한 리렌더/루프 방지)
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

      if (same && s.initialized) return s; // 변경 없음 → no-op
      return { counts: next, initialized: true };
    }),

  has: (kind) => get().counts[kind] > 0,

  consumeLocal: (kind, n = 1) =>
    set((s) => ({
      counts: { ...s.counts, [kind]: Math.max(0, s.counts[kind] - n) },
    })),

  restoreLocal: (kind, n = 1) =>
    set((s) => ({
      counts: { ...s.counts, [kind]: s.counts[kind] + n },
    })),
}));

// (선택) 읽기용 훅들
export const useTicketCount = (kind: TicketKind) =>
  useTicketsStore((s) => s.counts[kind]);
export const useTicketsAll = () => useTicketsStore((s) => s.counts);

// 상단에서 한 번만 fetch → (2) store에 동기화 →
// (3) 컴포넌트들은 store만 읽기 → (4) 가드는 onPress에서만 차감
