import { createContext, type ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";

import { ContentState } from "@/components/ui/content-state";
import type { SkeletonPreset } from "@/components/ui/skeleton";

/**
 * When true, nested {@link Stagger} skips opacity-0 entrances so learn body
 * content is fully visible on the first visit (not only after remount).
 */
const LearnBodyReadyContext = createContext(false);

/** True when rendering inside a ready {@link LearnContentGate}. */
export function useLearnBodyReady(): boolean {
  return useContext(LearnBodyReadyContext);
}

/**
 * Inline body placeholder while a learn corpus finishes lazy-loading: a
 * content-shaped skeleton (one `progressbar` for screen readers) — never a
 * spinner card with "still loading" copy (G-36, P8-04). Keeps ScreenLayout
 * chrome (title / back) mounted so navigation stays usable.
 */
export function LearnContentLoading({ skeleton = "card" }: { skeleton?: SkeletonPreset }) {
  const { t } = useTranslation();
  return (
    <ContentState
      status="loading"
      skeleton={skeleton}
      skeletonCount={skeleton === "card" ? 2 : undefined}
      loadingLabel={t("common.loadingContent")}
    />
  );
}

/**
 * Renders a skeleton until `ready`, a `RetryCard` when the load failed
 * (`error` + `onRetry`, from `useEnsureContent`), then children — use for learn
 * body content. Once ready, children mount with the corpus already warm (prefer
 * sync imports in `lib/*` learn modules) and nested Stagger skips opacity-0
 * entrances so the first visit paints the full hub.
 */
export function LearnContentGate({
  ready,
  error,
  onRetry,
  skeleton,
  children,
}: {
  ready: boolean;
  /** Truthy when the corpus failed to load (cold cache) — shows "Try again". */
  error?: unknown;
  onRetry?: () => void;
  /** Loading skeleton shape (default `card`). */
  skeleton?: SkeletonPreset;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  if (!ready && error) {
    return (
      <ContentState status="error" errorMessage={t("learnKit.loadFailed")} onRetry={onRetry} />
    );
  }
  if (!ready) return <LearnContentLoading skeleton={skeleton} />;
  return <LearnBodyReadyContext.Provider value={true}>{children}</LearnBodyReadyContext.Provider>;
}
