import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { useContentReport } from "@/components/content-report/content-report-context";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Inline row for screen footers — text link + flag icon. */
export function ContentReportFooterLink({ contentRef }: { contentRef: ContentReportReference }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { openReport } = useContentReport();

  return (
    <View style={styles.row}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("contentReport.reportIssue")}
        onPress={() => openReport(contentRef)}
        style={styles.linkWrap}
      >
        <ThemedText type="caption" style={{ color: colors.mutedForeground }}>
          {t("contentReport.reportIssue")}
        </ThemedText>
      </PressableScale>
      <ContentReportButton contentRef={contentRef} size={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  linkWrap: {
    paddingVertical: Spacing.one,
  },
});
