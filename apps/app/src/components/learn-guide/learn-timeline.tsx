import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnProseText } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useChevronForward } from "@/lib/rtl";

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

/** One event on a Learn timeline. */
export type LearnTimelineEvent = {
  id: string;
  /** Short neutral pills above the title (era, CE / AH year, step, sign type). */
  badges?: readonly string[];
  /** Place name shown with a pin after the badges. */
  location?: string;
  title: string;
  body: string;
  /** The related lesson. Events without a link are plain text (not pressable off TV). */
  link?: { label: string; onPress: () => void };
};

/**
 * The one Learn timeline (G-41): a single rail on phones / tablets / TV and the
 * staggered two-column layout at ≥1200 on web. Title and body are reading
 * prose (`LearnProseText`), so they follow the A−/A+ control when the screen
 * wraps it in `LearnReadingChrome`.
 *
 * Linked events are one `link` pressable (title + link label). Events without
 * a link are not pressable off TV (G-40, G-76); on TV they are reading stops
 * (`TvReadableBlock`) so the D-pad can scroll the whole timeline.
 */
export function LearnTimeline({ events }: { events: readonly LearnTimelineEvent[] }) {
  const { colors, tokens } = useThemeTokens();
  const twoColumn = useLearnTimelineTwoColumn();

  const renderCard = (event: LearnTimelineEvent) => (
    <View style={styles.cardGap}>
      <LearnTimelineCard event={event} />
    </View>
  );

  if (twoColumn) {
    return (
      <LearnTwoColumnTimeline items={events} keyOf={(event) => event.id} renderCard={renderCard} />
    );
  }
  return (
    <View>
      {events.map((event, index) => (
        <View key={event.id} style={styles.singleRow}>
          <View style={styles.singleRailColumn}>
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            {index < events.length - 1 ? (
              <View style={[styles.singleRail, { backgroundColor: tokens.hairline }]} />
            ) : null}
          </View>
          <View style={styles.singleCard}>{renderCard(event)}</View>
        </View>
      ))}
    </View>
  );
}

function LearnTimelineCard({ event }: { event: LearnTimelineEvent }) {
  const { colors } = useThemeTokens();
  const chevronForward = useChevronForward();

  const body = (
    <Card>
      {event.badges?.length || event.location ? (
        <View style={styles.badges}>
          {event.badges?.map((badge) => (
            <Pill key={badge} label={badge} compact tone="neutral" />
          ))}
          {event.location ? (
            <View style={styles.location}>
              <SymbolView
                name={{ ios: "mappin", android: "place", web: "place" }}
                size={IconSize.xs}
                tintColor={colors.mutedForeground}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {event.location}
              </ThemedText>
            </View>
          ) : null}
        </View>
      ) : null}
      <LearnProseText proseRole="title" style={styles.title}>
        {event.title}
      </LearnProseText>
      <LearnProseText themeColor="mutedForeground">{event.body}</LearnProseText>
      {event.link ? (
        <View style={styles.linkRow}>
          <ThemedText type="caption" style={{ color: colors.accentText }}>
            {event.link.label}
          </ThemedText>
          <SymbolView name={chevronForward} size={IconSize.xs} tintColor={colors.accentText} />
        </View>
      ) : null}
    </Card>
  );

  if (event.link) {
    const { label, onPress } = event.link;
    return (
      <PressableScale
        haptic="light"
        accessibilityRole="link"
        accessibilityLabel={`${event.title}. ${label}`}
        onPress={onPress}
        style={styles.pressable}
      >
        {body}
      </PressableScale>
    );
  }
  return <TvReadableBlock>{body}</TvReadableBlock>;
}

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "stretch" },
  column: { flex: 1, minWidth: 0 },
  entry: { flexDirection: "row", alignItems: "flex-start" },
  card: { flex: 1, minWidth: 0 },
  dotLane: { width: 20, alignItems: "center", paddingTop: Spacing.three, zIndex: 1 },
  // Pull each lane over the rail so the dot sits centred on the line.
  dotLaneStart: { marginEnd: -(Spacing.three + 11) },
  dotLaneEnd: { marginStart: -(Spacing.three + 11) },
  dot: { width: tvDp(12), height: tvDp(12), borderRadius: Radius.pill },
  rail: { width: 2, alignItems: "center", marginHorizontal: Spacing.three },
  railLine: { width: 2, flex: 1, borderRadius: 1 },
  singleRow: { flexDirection: "row", gap: Spacing.three },
  singleRailColumn: { alignItems: "center", width: tvDp(16), paddingTop: Spacing.three },
  singleRail: { width: tvDp(2), flex: 1, marginTop: Spacing.one },
  singleCard: { flex: 1, minWidth: 0 },
  cardGap: { marginBottom: Spacing.three },
  pressable: { borderRadius: Radius.lg, borderCurve: "continuous" },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
  },
  location: { flexDirection: "row", alignItems: "center", gap: Spacing.half },
  title: { marginBottom: Spacing.one },
  linkRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one, marginTop: Spacing.two },
});
