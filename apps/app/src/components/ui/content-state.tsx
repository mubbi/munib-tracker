import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { RetryCard } from "@/components/ui/retry-card";
import { SkeletonPlaceholder, type SkeletonPreset } from "@/components/ui/skeleton";

export type ContentStatus = "loading" | "empty" | "error" | "offline" | "ready";

type EmptyContent = Parameters<typeof EmptyState>[0];

export type ContentStateProps = {
  status: ContentStatus;
  /** The loaded content — rendered for `ready`, and below the offline card when `cached`. */
  children?: ReactNode;
  /** Loading skeleton shaped like the content (default `rows`). */
  skeleton?: SkeletonPreset;
  /** Rows / tiles / cards in the skeleton. */
  skeletonCount?: number;
  /** Spoken loading label ("Loading duas…"); defaults to "Loading…". */
  loadingLabel?: string;
  /** Required for `status="empty"`: what to show and the one next step. */
  empty?: EmptyContent;
  /** `error` / `offline`: "Couldn't load {object}. {cause}" — defaults to a generic line. */
  errorMessage?: string;
  retryLabel?: string;
  /** `error` / `offline`: the Try again action. */
  onRetry?: () => void;
  /**
   * `offline` with content still available: shows "Showing saved copy" and
   * renders `children` under the retry card instead of hiding them.
   */
  cached?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The one way to show a screen body that is loading, empty, failed, offline or
 * ready (design-system § Empty, loading, error, offline). Screen chrome renders
 * immediately; the body goes through this — never `return null`, never a bare
 * spinner, never a failed load disguised as an empty state.
 */
export function ContentState({
  status,
  children,
  skeleton = "rows",
  skeletonCount,
  loadingLabel,
  empty,
  errorMessage,
  retryLabel,
  onRetry,
  cached = false,
  style,
}: ContentStateProps) {
  switch (status) {
    case "loading":
      return (
        <SkeletonPlaceholder
          preset={skeleton}
          count={skeletonCount}
          accessibilityLabel={loadingLabel}
          style={style}
        />
      );
    case "empty":
      return empty ? <EmptyState {...empty} style={[empty.style, style]} /> : null;
    case "error":
    case "offline": {
      const offline = status === "offline";
      const card = (
        <RetryCard
          message={errorMessage}
          retryLabel={retryLabel}
          onRetry={onRetry ?? noop}
          offline={offline}
          showingSavedCopy={offline && cached}
          style={style}
        />
      );
      if (offline && cached) {
        return (
          <>
            {card}
            {children}
          </>
        );
      }
      return card;
    }
    default:
      return <>{children}</>;
  }
}

function noop() {}
