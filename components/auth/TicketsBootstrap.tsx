import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getTickets } from "@/utils/api/authPageApi";
import type { getTicketsResponse } from "@/utils/types/auth";
import { useTicketsStore } from "@/utils/store/useTicketsStore";
import { useAuthStore } from "@/utils/store/useAuthStore";

const TicketsBootstrap = () => {
  const setFromResponse = useTicketsStore((s) => s.setFromResponse);
  const token = useAuthStore((s) => s.token);

  const { data, error } = useQuery<
    getTicketsResponse,
    AxiosError<{ message?: string }>
  >({
    queryKey: ["getTicketsKey", token],
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

  return null;
};

export default TicketsBootstrap;
