// utils/reactQuery/optimistic.ts
import { useCallback } from "react";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

/** 리스트 캐시에서 id가 같은 항목을 낙관적으로 제거 */
export function useOptimisticListRemove<T extends { id: number }>(
  queryKey: QueryKey
) {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: number) => {
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData<T[]>(queryKey);
      queryClient.setQueryData<T[]>(queryKey, (old) =>
        (old ?? []).filter((x) => x.id !== id)
      );
      return { prev };
    },
    [queryClient, JSON.stringify(queryKey)]
  );
}
