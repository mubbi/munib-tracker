import type { ErrorBoundaryProps } from "expo-router";
import { useEffect } from "react";

import { ErrorFallback } from "@/components/error-boundary";
import { captureAppException } from "@/lib/sentry";

/**
 * Per-screen error boundary (Expo Router SDK 58 `unstable_screenErrorBoundary`).
 * One failing screen shows the themed fallback with a retry instead of taking the
 * whole navigator down to the root `Sentry.GlobalErrorBoundary`.
 */
export function ScreenErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    captureAppException(error, { tags: { boundary: "screen" } });
  }, [error]);

  return <ErrorFallback onReset={() => void retry()} />;
}
