import { useTranslation } from "react-i18next";

import { ScreenLayout } from "@/components/screen-layout";
import { ContentState } from "@/components/ui/content-state";

type TasbeehLoadingScreenProps = {
  onBack: () => void;
  /** Header title; defaults to "Tasbeeh". */
  title?: string;
  /** The corpus load rejected — shows a retry card instead of a blank screen. */
  failed?: boolean;
  onRetry?: () => void;
};

/**
 * Screen chrome (header + back) for a counter route whose corpus is still
 * loading or failed to load — never a blank screen with no way out (B-54).
 */
export function TasbeehLoadingScreen({
  onBack,
  title,
  failed = false,
  onRetry,
}: TasbeehLoadingScreenProps) {
  const { t } = useTranslation();
  return (
    <ScreenLayout title={title ?? t("tasbeeh.eyebrow")} onBack={onBack}>
      <ContentState
        status={failed ? "error" : "loading"}
        skeleton="card"
        loadingLabel={t("tasbeeh.loading")}
        errorMessage={t("tasbeeh.loadFailed")}
        onRetry={onRetry}
      />
    </ScreenLayout>
  );
}
