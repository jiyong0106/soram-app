import { useCallback } from "react";
import type { TicketKind } from "@/utils/types/auth";
import { useTicketsStore } from "../store/useTicketsStore";

type Options = {
  amount?: number;
  optimistic?: boolean;
  onInsufficient?: () => void;
};

const useTicketGuard = (kind: TicketKind, opts?: Options) => {
  const amount = opts?.amount ?? 1;
  const optimistic = opts?.optimistic ?? true;
  const onInsufficient = opts?.onInsufficient;

  // 변경점: s.counts[kind] -> s.data[kind]?.totalQuantity ?? 0
  // 새로운 데이터 구조에서 totalQuantity를 읽어오도록 수정합니다.
  // 옵셔널 체이닝(?.)과 nullish coalescing(??)으로 안전하게 접근합니다.
  const available = useTicketsStore((s) => s.data[kind]?.totalQuantity ?? 0);
  const consumeLocal = useTicketsStore((s) => s.consumeLocal);
  const restoreLocal = useTicketsStore((s) => s.restoreLocal);

  // 아래 로직은 변경할 필요 없습니다.
  const ensure = useCallback(
    (onPass: () => void) => {
      if (amount <= 0 || available < amount) {
        onInsufficient?.();
        return;
      }
      if (optimistic) consumeLocal(kind, amount);

      try {
        onPass();
        // 비관적 모드: 성공 이후에만 차감
        if (!optimistic) consumeLocal(kind, amount);
        // TODO: 서버 차감 API가 있다면 여기서 mutate 후 실패 시 restoreLocal 호출
        // await mutateAsync({ kind, amount });
      } catch (e) {
        if (optimistic) restoreLocal(kind, amount);
        throw e;
      }
    },
    [
      available,
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
