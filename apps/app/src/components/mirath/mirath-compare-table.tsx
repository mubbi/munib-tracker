import { MADHHAB_IDS, type MadhhabId } from "@munib-tracker/shared/fiqh";
import { differingHeirs, type MirathResult } from "@munib-tracker/shared/mirath";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { BorderWidth, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { heirCountLabel } from "@/lib/mirath/explain";
import { compareCell, compareRowCount, compareTableHeirs } from "@/lib/mirath/results-view";

/** Side-by-side table of the four schools; differing rows are highlighted. */
export function MirathCompareTable({
  results,
  selected,
}: {
  results: Record<MadhhabId, MirathResult>;
  selected: MadhhabId | null;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const differ = differingHeirs(results);
  return (
    <Card>
      <SectionHeader
        title={t("mirath.compare.title")}
        icon={{ ios: "square.grid.2x2", android: "grid_view", web: "grid_view" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.compareHint}>
        {differ.length ? t("mirath.compare.differ") : t("mirath.compare.same")}
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table} accessibilityRole="summary">
          <View style={[styles.tr, { borderColor: tokens.hairline }]}>
            <ThemedText type="label" style={styles.thHeir}>
              {t("mirath.compare.heir")}
            </ThemedText>
            {MADHHAB_IDS.map((s) => (
              <ThemedText
                key={s}
                type="label"
                style={[styles.th, selected === s && { color: colors.accentText }]}
              >
                {t(`fiqh.school.${s}`)}
              </ThemedText>
            ))}
          </View>
          {compareTableHeirs(results).map((h) => {
            const label = heirCountLabel(t, h, compareRowCount(results, h));
            const diff = differ.includes(h);
            return (
              <View
                key={h}
                style={[
                  styles.tr,
                  { borderColor: tokens.hairline },
                  diff && { backgroundColor: tokens.accentSoft },
                ]}
                accessibilityLabel={
                  diff ? t("mirath.compare.rowDifferA11y", { heir: label }) : undefined
                }
              >
                <ThemedText type="small" style={styles.thHeir}>
                  {label}
                </ThemedText>
                {MADHHAB_IDS.map((s) => (
                  <ThemedText key={s} type={diff ? "smallBold" : "small"} style={styles.td}>
                    {compareCell(results, s, h)}
                  </ThemedText>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  compareHint: { marginTop: Spacing.one, marginBottom: Spacing.two },
  table: { minWidth: 520 },
  tr: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: BorderWidth.hairline,
    paddingVertical: Spacing.two,
  },
  thHeir: { width: 180, paddingHorizontal: Spacing.one },
  th: { width: 84, textAlign: "center" },
  td: { width: 84, textAlign: "center" },
});
