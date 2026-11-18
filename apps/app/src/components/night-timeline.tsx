import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type NightTimelineProps = {
  maghribAt: Date;
  midNight: Date;
  lastThird: Date;
  fajrAt: Date;
  now: Date;
  format: (date: Date) => string;
  /** Narrow cards: only label the Maghrib and Fajr ends (mid-night / last third shown elsewhere). */
  compact?: boolean;
};

/**
 * Maghrib → Fajr bar with the mid-night tick, the last third highlighted, and a
 * live "now" marker. Shared by the Tahajjud tracker and the last-third calculator.
 */
export function NightTimeline({
  maghribAt,
  midNight,
  lastThird,
  fajrAt,
  now,
  format,
  compact = false,
}: NightTimelineProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const span = fajrAt.getTime() - maghribAt.getTime();
  const nowFraction = span > 0 ? (now.getTime() - maghribAt.getTime()) / span : -1;
  const showNow = nowFraction >= 0 && nowFraction <= 1;
  const info = tokens.status.info;
  // Segments: Maghrib→midnight = 3/6, midnight→last third = 1/6, last third→Fajr = 2/6.
  const segments = [
    { key: "maghrib", flex: 3, label: t("lastThirdNight.maghribLabel"), at: maghribAt },
    { key: "mid", flex: 1, label: t("lastThirdNight.midNightLabel"), at: midNight },
    { key: "last", flex: 2, label: t("lastThirdNight.lastThirdLabel"), at: lastThird },
  ] as const;

  return (
    <View style={styles.timeline}>
      <View style={[styles.track, { backgroundColor: colors.muted }]}>
        <View style={styles.trackRow}>
          <View style={{ flex: 3 }} />
          <View style={[styles.trackDivider, { backgroundColor: colors.border }]} />
          <View style={{ flex: 1 }} />
          <View style={[styles.trackLast, { backgroundColor: info.color }]} />
        </View>
        {showNow ? (
          <View
            style={[
              styles.nowMarker,
              { start: `${nowFraction * 100}%` as const, backgroundColor: colors.foreground },
            ]}
          />
        ) : null}
      </View>
      <View style={styles.timelineLabels}>
        {(compact ? segments.slice(0, 1) : segments).map((segment) => (
          <View
            key={segment.key}
            style={[styles.timelineLabel, { flex: compact ? 1 : segment.flex }]}
          >
            <ThemedText
              type="caption"
              numberOfLines={1}
              style={segment.key === "last" ? { color: info.text } : undefined}
              themeColor={segment.key === "last" ? undefined : "mutedForeground"}
            >
              {segment.label}
            </ThemedText>
            <ThemedText type="smallBold" numberOfLines={1}>
              {format(segment.at)}
            </ThemedText>
          </View>
        ))}
        <View style={[styles.timelineLabel, styles.timelineLabelEnd]}>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {t("lastThirdNight.fajrLabel")}
          </ThemedText>
          <ThemedText type="smallBold" numberOfLines={1}>
            {format(fajrAt)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: Spacing.two,
  },
  track: {
    height: 14,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  trackRow: {
    flex: 1,
    flexDirection: "row",
  },
  trackDivider: {
    width: 2,
  },
  trackLast: {
    flex: 2,
  },
  nowMarker: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 3,
    marginStart: -1,
  },
  timelineLabels: {
    flexDirection: "row",
  },
  timelineLabel: {
    gap: 2,
    minWidth: 0,
    paddingEnd: Spacing.one,
  },
  /** Fajr sits at the far end, over the last-third segment (labels stay aligned to the bar). */
  timelineLabelEnd: {
    position: "absolute",
    top: 0,
    end: 0,
    alignItems: "flex-end",
    paddingEnd: 0,
  },
});
