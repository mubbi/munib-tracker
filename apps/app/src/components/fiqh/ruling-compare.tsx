import {
  type FiqhDifferenceId,
  getFiqhDifference,
  MADHHAB_IDS,
  type MadhhabId,
} from "@munib-tracker/shared/fiqh";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { groupPositions } from "@/lib/fiqh/position-groups";
import { isTV } from "@/lib/platform/is-tv";

/** Below this window width the four columns stack into rows (phones, split view). */
export const RULING_COMPARE_COLUMNS_MIN_WIDTH = 720;

type RulingCompareProps = {
  id: FiqhDifferenceId;
  /** Highlight one school's cell (e.g. a domain override shown next to all views). */
  highlight?: MadhhabId | null;
  /** Hide the title row when the host already shows it. */
  hideTitle?: boolean;
  /** Restrict to some schools (default: all four, in catalog order). */
  schools?: readonly MadhhabId[];
};

/**
 * Side-by-side view of how the four schools differ on one ruling (NF-3.0a).
 * Schools holding the same position share one cell ("Shafi'i · Maliki ·
 * Hanbali"). Columns on wide screens and TV; stacked rows on narrow screens. Layout
 * is flexbox with logical props only, so it mirrors correctly in RTL.
 */
export function RulingCompare({
  id,
  highlight = null,
  hideTitle = false,
  schools = MADHHAB_IDS,
}: RulingCompareProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { width } = useWindowDimensions();
  const diff = getFiqhDifference(id);
  // Schools that agree share one cell, so the reader sees how many views there really are.
  const groups = groupPositions(diff, schools);
  const columns = isTV() || width >= RULING_COMPARE_COLUMNS_MIN_WIDTH;
  const title = t(diff.titleKey);

  return (
    <View accessibilityLabel={t("fiqh.compare.a11y", { title })} style={styles.root}>
      {hideTitle ? null : (
        <ThemedText type="smallBold" heading={4}>
          {title}
        </ThemedText>
      )}
      <View style={[styles.grid, columns ? styles.gridColumns : styles.gridRows]}>
        {groups.map((group) => {
          const names = group.schools.map((school) => t(`fiqh.school.${school}`)).join(" · ");
          const position = t(group.summaryKey);
          const isHighlighted = highlight != null && group.schools.includes(highlight);
          return (
            <View
              key={group.summaryKey}
              accessible
              accessibilityLabel={t("fiqh.note.positionA11y", { school: names, position })}
              testID={`ruling-compare-${group.schools.join("-")}`}
              style={[
                styles.cell,
                columns && styles.cellColumn,
                {
                  backgroundColor: isHighlighted ? tokens.accentSoft : colors.muted,
                  borderColor: isHighlighted ? tokens.accentBorder : colors.border,
                },
              ]}
            >
              <ThemedText
                type="label"
                style={{ color: isHighlighted ? colors.accentText : colors.foreground }}
              >
                {names}
              </ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {position}
              </ThemedText>
            </View>
          );
        })}
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("fiqh.note.validViews")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.two },
  grid: { gap: Spacing.two },
  gridColumns: { flexDirection: "row", alignItems: "stretch" },
  gridRows: { flexDirection: "column" },
  cell: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  cellColumn: { flex: 1, flexBasis: 0 },
});
