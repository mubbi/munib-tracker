import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

/** Shared query client — cancelled before native JS reloads. */
export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      // Foreground/reconnect work is explicitly coordinated by the app. Avoid
      // surprise refetches from generated hooks when a browser tab is reopened.
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export function ApiQueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={appQueryClient}>{children}</QueryClientProvider>;
}
