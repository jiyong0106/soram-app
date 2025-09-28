import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getTickets } from "@/utils/api/authPageApi";
import type { getTicketsResponse } from "@/utils/types/auth";
import { useTicketsStore } from "@/utils/store/useTicketsStore";
import { useAuthStore } from "@/utils/store/useAuthStore";

const TicketsBootstrap = () => {
  const queryClient = useQueryClient();
  const setFromResponse = useTicketsStore((s) => s.setFromResponse);
  const token = useAuthStore((s) => s.token);

  const { data, error } = useQuery<
    getTicketsResponse,
    AxiosError<{ message?: string }>
  >({
    // 민감정보(토큰)를 쿼리키에 넣지 않음
    queryKey: ["getTicketsKey"],
    queryFn: getTickets,
    enabled: !!token,
    staleTime: 60_000,
    retry: (count, err) => {
      const s = err.response?.status;
      if (s && s >= 400 && s < 500) return false;
      return count < 2;
    },
  });

  useEffect(() => {
    if (data) setFromResponse(data);
  }, [data, setFromResponse]);

  // 토큰이 변경되면 안전하게 캐시를 동기화
  useEffect(() => {
    if (token) {
      // 동일 키로 강제 최신화
      queryClient.invalidateQueries({ queryKey: ["getTicketsKey"] });
    } else {
      // 로그아웃 등 토큰 소실 시 관련 캐시 제거
      queryClient.removeQueries({ queryKey: ["getTicketsKey"] });
    }
  }, [token, queryClient]);

  return null;
};

export default TicketsBootstrap;
