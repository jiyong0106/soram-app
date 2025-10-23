import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     refetchOnReconnect: true,
  //     retryDelay: 3000,
  //   },
  // },
  // });

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnReconnect: true,
            // 한글 주석: 기본적으로 포커스/마운트 자동 리페치를 끄고 캐시를 우선 사용합니다.
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: 30 * 1000,
            retryDelay: 3000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
