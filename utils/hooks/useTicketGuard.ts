// utils/hooks/useTicketGuard.ts
import { useCallback } from "react";
import type { TicketKind } from "@/utils/types/auth";
import { useTicketsStore } from "../sotre/useTicketsStore";

type Options = {
  amount?: number;
  optimistic?: boolean;
  onInsufficient?: () => void;
};

const useTicketGuard = (kind: TicketKind, opts?: Options) => {
  const amount = opts?.amount ?? 1;
  const optimistic = opts?.optimistic ?? true;
  const onInsufficient = opts?.onInsufficient;

  // 렌더 중에는 "읽기"만
  const hasTicket = useTicketsStore((s) => s.counts[kind] > 0);
  const consumeLocal = useTicketsStore((s) => s.consumeLocal);
  const restoreLocal = useTicketsStore((s) => s.restoreLocal);

  // 상태 변경은 onPress 시점에만
  const ensure = useCallback(
    (onPass: () => void) => {
      if (!hasTicket || amount <= 0) {
        onInsufficient?.() ?? console.log("");
        return;
      }
      if (optimistic) consumeLocal(kind, amount);

      try {
        onPass();
        // TODO: 서버 차감 API가 있다면 여기서 mutate 후 실패 시 restoreLocal 호출
        // await mutateAsync({ kind, amount });
      } catch (e) {
        if (optimistic) restoreLocal(kind, amount);
        throw e;
      }
    },
    [
      hasTicket,
      amount,
      optimistic,
      onInsufficient,
      consumeLocal,
      restoreLocal,
      kind,
    ]
  );

  return { ensure };
};
export default useTicketGuard;
