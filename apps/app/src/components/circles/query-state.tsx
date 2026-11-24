import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { RetryCard } from "@/components/ui/retry-card";

/**
 * Loading / failed states shared by every circles screen (family, partner,
 * khatm groups, kids, join). Each feature passes its own copy; the defaults are
 * the generic `circles.common.*` strings.
 */
export function CircleLoading({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <ThemedText type="small" themeColor="mutedForeground">
      {label ?? t("circles.common.loading")}
    </ThemedText>
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
