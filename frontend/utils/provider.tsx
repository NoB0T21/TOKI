"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClientRef.current}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}