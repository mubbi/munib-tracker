import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const RING_SIZE = 56;
const RING_STROKE = 6;

export type TrackerProgressRingItem = {
  id: string;
  /** Short label rendered under the ring. */
  label: string;
  /** Progress from 0 to 1. */
  progress: number;
  /** Compact "done / total" detail line (e.g. "2/6"). */
  detail: string;
  /** Ring fill color — defaults to the accent. */
  color?: string;
  /** Full accessibility label for the whole cell. */
  accessibilityLabel: string;
  /** Optional tap handler (e.g. deep-link to the related section). */
  onPress?: () => void;
};

function RingCell({ item, surfaceColor }: { item: TrackerProgressRingItem; surfaceColor: string }) {
  const { colors } = useThemeTokens();

  const content: ReactNode = (
    <>
      <ProgressRing
        progress={item.progress}
        size={RING_SIZE}
        stroke={RING_STROKE}
        color={item.color}
        surfaceColor={surfaceColor}
        valueFontSize={14}
      />
      <ThemedText type="caption" numberOfLines={1} style={styles.label}>
        {item.label}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
        {item.detail}
      </ThemedText>
    </>
  );

  const tileStyle = [styles.cell, { backgroundColor: surfaceColor, borderColor: colors.border }];

  if (item.onPress) {
    return (
      <PressableScale
        style={tileStyle}
        haptic="light"
        scaleTo={0.97}
        accessibilityRole="button"
        accessibilityLabel={item.accessibilityLabel}
        onPress={item.onPress}
      >
        {content}
      </PressableScale>
    );
  }

  return (
    <View style={tileStyle} accessible accessibilityLabel={item.accessibilityLabel}>
      {content}
    </View>
  );
}

/**
 * A row of compact completion-ring tiles giving an at-a-glance view of every
 * daily tracking group (sunnah, witr, adhkar, qaza). Each tile shares the row
 * width evenly so the row adapts to however many groups are active today, and
 * the ring centre matches the tile fill so the discs read as one panel.
 */
export function TrackerProgressRings({ items }: { items: TrackerProgressRingItem[] }) {
  const { colors } = useThemeTokens();
  if (items.length === 0) return null;

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <RingCell key={item.id} item={item} surfaceColor={colors.muted} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing.two,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 2,
  },
});
