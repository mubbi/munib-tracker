import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { createContext, useContext } from "react";

export type ContentReportContextValue = {
  openReport: (ref: ContentReportReference) => void;
};

export const ContentReportContext = createContext<ContentReportContextValue | null>(null);

export function useContentReport(): ContentReportContextValue {
  const ctx = useContext(ContentReportContext);
  if (!ctx) {
    throw new Error("useContentReport must be used within ContentReportProvider");
  }
  return ctx;
}
