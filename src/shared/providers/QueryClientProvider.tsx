"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from "@tanstack/react-query";

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export default function QueryClientProvider({
  children
}: QueryClientProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1분
          retry: 1,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 0,
        },
      },
    })
  );

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
}