import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressRing } from "@/components/ui/progress-ring";
import { MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const ROW_GAP = Spacing.two;
/** ScreenLayout horizontal pad + Card default `padding="four"` on both sides. */
const OUTER_HORIZONTAL_PAD = Spacing.four * 4;

/**
 * Column count for the glance grid. Caps at 3 so longer labels (e.g. "Optional
 * Salah") stay readable when qaza / khatm rings appear; 4 items use a balanced
 * 2×2 instead of a cramped four-across row.
 */
function columnsForCount(count: number): number {
  if (count <= 3) return count;
  if (count === 4) return 2;
  return 3;
}

function ringMetrics(cellWidth: number) {
  const ringSize = Math.max(44, Math.min(56, Math.floor(cellWidth * 0.52)));
  const stroke = ringSize < 50 ? 5 : 6;
  const valueFontSize = ringSize < 50 ? 12 : 14;
  return { ringSize, stroke, valueFontSize };
}

function estimateRowWidth(viewportWidth: number): number {
  return Math.max(0, Math.min(viewportWidth, MaxContentWidth) - OUTER_HORIZONTAL_PAD);
}

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

function RingCell({
  item,
  surfaceColor,
  ringSize,
  stroke,
  valueFontSize,
  cellWidth,
}: {
  item: TrackerProgressRingItem;
  surfaceColor: string;
  ringSize: number;
  stroke: number;
  valueFontSize: number;
  cellWidth: number;
}) {
  const { colors } = useThemeTokens();

  const content: ReactNode = (
    <>
      <ProgressRing
        progress={item.progress}
        size={ringSize}
        stroke={stroke}
        color={item.color}
        surfaceColor={surfaceColor}
        valueFontSize={valueFontSize}
      />
      <ThemedText
        type="caption"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={styles.label}
      >
        {item.label}
      </ThemedText>
      <ThemedText
        type="caption"
        themeColor="mutedForeground"
        numberOfLines={1}
        style={styles.detail}
      >
        {item.detail}
      </ThemedText>
    </>
  );

  const tileStyle = [
    styles.cell,
    {
      width: cellWidth,
      backgroundColor: surfaceColor,
      borderColor: colors.border,
    },
  ];

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
 * A wrapping grid of compact completion-ring tiles giving an at-a-glance view of
 * every daily tracking group (sunnah, witr, adhkar, qaza, khatm). Column count
 * and ring size adapt to how many groups are active today so labels stay fully
 * readable; the ring centre matches the tile fill so the discs read as one panel.
 */
export function TrackerProgressRings({ items }: { items: TrackerProgressRingItem[] }) {
  const { colors } = useThemeTokens();
  const { width: viewportWidth } = useWindowDimensions();
  const [rowWidth, setRowWidth] = useState(() => estimateRowWidth(viewportWidth));

  useEffect(() => {
    setRowWidth(estimateRowWidth(viewportWidth));
  }, [viewportWidth]);

  if (items.length === 0) return null;

  const columns = columnsForCount(items.length);
  const onRowLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setRowWidth((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
  };

  const cellWidth = Math.floor((rowWidth - ROW_GAP * (columns - 1)) / columns);
  const { ringSize, stroke, valueFontSize } = ringMetrics(cellWidth);

  return (
    <View style={styles.row} onLayout={onRowLayout}>
      {items.map((item) => (
        <RingCell
          key={item.id}
          item={item}
          surfaceColor={colors.muted}
          ringSize={ringSize}
          stroke={stroke}
          valueFontSize={valueFontSize}
          cellWidth={cellWidth}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ROW_GAP,
  },
  cell: {
    alignItems: "center",
    gap: Spacing.one,
    paddingTop: Spacing.two + 2,
    paddingBottom: Spacing.two,
    paddingHorizontal: Spacing.one + 2,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    alignSelf: "stretch",
  },
  detail: {
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
});
