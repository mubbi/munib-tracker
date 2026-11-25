import { useTranslation } from "react-i18next";

import { RetryCard } from "@/components/ui/retry-card";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";

/**
 * Loading / failed states shared by every circles screen (family, partner,
 * khatm groups, kids, join). Each feature passes its own copy; the defaults are
 * the generic `circles.common.*` strings.
 */
export function CircleLoading({ label, count = 3 }: { label?: string; count?: number }) {
  const { t } = useTranslation();
  // Skeleton rows keep the layout from jumping; the label is what a screen reader hears.
  return (
    <SkeletonPlaceholder
      preset="rows"
      count={count}
      accessibilityLabel={label ?? t("circles.common.loading")}
    />
  );
}

/**
 * "Couldn't load — Try again" card (a failed read is never a blank screen):
 * the shared `RetryCard` with the generic circles copy as defaults.
 */
export function CircleRetryCard({
  message,
  retryLabel,
  onRetry,
}: {
  message?: string;
  retryLabel?: string;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  return (
    <RetryCard
      message={message ?? t("circles.common.offline")}
      retryLabel={retryLabel ?? t("circles.common.retry")}
      onRetry={onRetry}
    />
  );
}
