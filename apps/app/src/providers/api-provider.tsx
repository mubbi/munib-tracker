import { ApiQueryProvider } from "@munib-tracker/api-client/provider";
import type { ReactNode } from "react";

export function AppApiProvider({ children }: { children: ReactNode }) {
  return <ApiQueryProvider>{children}</ApiQueryProvider>;
}
