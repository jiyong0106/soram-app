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
