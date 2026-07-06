import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { useTranslation } from "react-i18next";
import { useContentReport } from "@/components/content-report/content-report-context";
import { IconButton } from "@/components/ui/icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

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
    <IconButton
      name={{ ios: "flag", android: "flag", web: "flag" }}
      size={size}
      tintColor={colors.mutedForeground}
      accessibilityLabel={t("contentReport.reportIssue")}
      haptic="light"
      onPress={() => openReport(contentRef)}
    />
  );
}
