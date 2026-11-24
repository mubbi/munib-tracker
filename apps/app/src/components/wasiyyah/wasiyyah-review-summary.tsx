import type { WasiyyahData } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type WasiyyahSummaryStep, wasiyyahSummaryLine } from "@/lib/wasiyyah/review-summary";

/**
 * Review step: every section in one scannable list, each with "Edit" to jump
 * straight back to it (long legal form — check before saving, fix in place).
 */
export function WasiyyahReviewSummary({
  data,
  steps,
  onEdit,
}: {
  data: WasiyyahData;
  steps: readonly WasiyyahSummaryStep[];
  onEdit: (step: WasiyyahSummaryStep) => void;
}) {
  const { t } = useTranslation();
  const { tokens, colors } = useThemeTokens();
  return (
    <View style={styles.list}>
      <ThemedText type="smallBold" heading={3}>
        {t("privateUx.wasiyyah.reviewTitle")}
      </ThemedText>
      {steps.map((step) => {
        const line = wasiyyahSummaryLine(step, data);
        const title = t(`wasiyyah.step.${step}`);
        return (
          <View key={step} style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={styles.text}>
              <ThemedText type="small">{title}</ThemedText>
              <ThemedText
                type="caption"
                themeColor={line.missing ? undefined : "mutedForeground"}
                style={line.missing ? { color: tokens.status.warning.text } : undefined}
                numberOfLines={2}
              >
                {line.key ? t(line.key, line.values ?? {}) : line.text}
              </ThemedText>
            </View>
            <Button
              label={t("common.edit")}
              variant="ghost"
              size="sm"
              accessibilityHint={title}
              onPress={() => onEdit(step)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.one },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
});
