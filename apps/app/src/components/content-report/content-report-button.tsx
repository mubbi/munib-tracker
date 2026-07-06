import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { useTranslation } from "react-i18next";
import { useContentReport } from "@/components/content-report/content-report-context";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const REPORT_FLAG = { ios: "flag", android: "flag", web: "flag" } as const;

export function ContentReportButton({
  contentRef,
  size = 18,
}: {
  contentRef: ContentReportReference;
  size?: number;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { openReport } = useContentReport();

  return (
    <LabeledIconButton
      name={REPORT_FLAG}
      label={t("contentReport.short", { defaultValue: "Report" })}
      iconSize={size}
      tintColor={colors.mutedForeground}
      accessibilityLabel={t("contentReport.reportIssue")}
      haptic="light"
      onPress={() => openReport(contentRef)}
    />
  );
}
