import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * True when Learn timelines (Seerah, history, revelation, prophets) should use
 * the two-column staggered layout: desktop web ≥1200, never TV.
 */
export function useLearnTimelineTwoColumn(): boolean {
  return useLearnWideLayout().split;
}

/** Offset of the end column so its cards interleave with the start column. */
const STAGGER_OFFSET = 72;

/**
 * Desktop timeline: a central rail with events alternating start / end in two
 * independently stacked columns (even → start, odd → end, end column offset),
 * so chronology zig-zags down the rail without the half-empty rows of a
 * classic alternating layout. Phones / TV keep each screen's single rail.
 */
export function LearnTwoColumnTimeline<T>({
  items,
  keyOf,
  renderCard,
}: {
  items: readonly T[];
  keyOf: (item: T) => string;
  renderCard: (item: T, index: number) => ReactNode;
}) {
  const { colors, tokens } = useThemeTokens();
  const start: { item: T; index: number }[] = [];
  const end: { item: T; index: number }[] = [];
  items.forEach((item, index) => {
    (index % 2 === 0 ? start : end).push({ item, index });
  });

  const dot = <View style={[styles.dot, { backgroundColor: colors.accent }]} />;

  return (
    <View style={styles.root}>
      <View style={styles.column}>
        {start.map(({ item, index }) => (
          <View key={keyOf(item)} style={styles.entry}>
            <View style={styles.card}>{renderCard(item, index)}</View>
            <View style={[styles.dotLane, styles.dotLaneStart]}>{dot}</View>
          </View>
        ))}
      </View>
      <View style={styles.rail}>
        <View style={[styles.railLine, { backgroundColor: tokens.hairline }]} />
      </View>
      <View style={[styles.column, { paddingTop: STAGGER_OFFSET }]}>
        {end.map(({ item, index }) => (
          <View key={keyOf(item)} style={styles.entry}>
            <View style={[styles.dotLane, styles.dotLaneEnd]}>{dot}</View>
            <View style={styles.card}>{renderCard(item, index)}</View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "stretch" },
  column: { flex: 1, minWidth: 0 },
  entry: { flexDirection: "row", alignItems: "flex-start" },
  card: { flex: 1, minWidth: 0 },
  dotLane: { width: 20, alignItems: "center", paddingTop: Spacing.three + 2, zIndex: 1 },
  // Pull each lane over the rail so the dot sits centred on the line.
  dotLaneStart: { marginEnd: -(Spacing.three + 11) },
  dotLaneEnd: { marginStart: -(Spacing.three + 11) },
  dot: { width: 12, height: 12, borderRadius: Radius.pill },
  rail: { width: 2, alignItems: "center", marginHorizontal: Spacing.three },
  railLine: { width: 2, flex: 1, borderRadius: 1 },
});
