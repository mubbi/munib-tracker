import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type DimensionValue, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";

/** After this long the status line admits the upstream is slow (Overpass can take ~30 s). */
export const MASJID_SLOW_HINT_MS = 8_000;

/** Varied widths so the placeholder reads as a list of names, not a barcode. */
const ROWS: readonly { name: DimensionValue; detail: DimensionValue | null }[] = [
  { name: "62%", detail: "38%" },
  { name: "48%", detail: null },
  { name: "70%", detail: "30%" },
  { name: "54%", detail: null },
];

/** Later rows fade out, hinting the list continues without four equally loud blocks. */
const ROW_OPACITY = [1, 0.8, 0.6, 0.4] as const;

/**
 * Loading state for the masjid finder: a live status line plus placeholder
 * cards shaped like `MasjidRow` (name + distance, an optional Jumu'ah/badge
 * line, and the action buttons, which TV's read-only rows don't have).
 * Only the status line is exposed to screen readers.
 */
export function MasjidListSkeleton({ readOnly }: { readOnly: boolean }) {
  const { t } = useTranslation();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), MASJID_SLOW_HINT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.stack} testID="masjids-loading">
      <ThemedText
        type="small"
        themeColor="mutedForeground"
        accessibilityRole="progressbar"
        accessibilityLiveRegion="polite"
      >
        {slow ? t("masjids.loadingSlow") : t("masjids.loading")}
      </ThemedText>

      <View
        style={styles.stack}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.header}>
          <Skeleton width="44%" height={tvDp(18)} />
          <Skeleton width="64%" height={tvDp(12)} />
        </View>
        {ROWS.map((row, index) => (
          <View key={String(row.name)} style={{ opacity: ROW_OPACITY[index] }}>
            <Card style={styles.row}>
              <View style={styles.titleLine}>
                <Skeleton width={row.name} height={tvDp(16)} />
                <Skeleton width={tvDp(44)} height={tvDp(12)} />
              </View>
              {row.detail ? <Skeleton width={row.detail} height={tvDp(12)} /> : null}
              {readOnly ? null : (
                <View style={styles.actions}>
                  <Skeleton width={tvDp(116)} height={tvDp(32)} radius={Radius.pill} />
                  <Skeleton width={tvDp(84)} height={tvDp(32)} radius={Radius.pill} />
                </View>
              )}
            </Card>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  header: { gap: Spacing.oneHalf },
  row: { gap: Spacing.twoHalf },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  actions: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.half },
});
