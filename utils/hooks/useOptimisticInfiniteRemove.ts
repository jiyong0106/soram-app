// utils/reactQuery/useOptimisticInfiniteRemove.ts
import { useCallback } from "react";
import { InfiniteData, QueryKey, useQueryClient } from "@tanstack/react-query";

/** useInfiniteQuery 캐시에서 id가 같은 항목을 낙관적으로 제거 */
export function useOptimisticInfiniteRemove<
  TItem extends { id: number },
  TPage extends { data: TItem[] }
>(queryKey: QueryKey) {
  const qc = useQueryClient();

  return useCallback(
    async (id: number) => {
      await qc.cancelQueries({ queryKey });

      const prev = qc.getQueryData<InfiniteData<TPage>>(queryKey);

      if (prev) {
        const next: InfiniteData<TPage> = {
          pageParams: [...prev.pageParams],
          pages: prev.pages.map((p) => ({
            ...p,
            data: p.data.filter((x) => x.id !== id),
          })),
        };
        qc.setQueryData<InfiniteData<TPage>>(queryKey, next);
      }

      // onError에서 롤백할 수 있도록 컨텍스트로 이전 스냅샷 반환
      return { prev };
    },
    [qc, queryKey]
  );
}
