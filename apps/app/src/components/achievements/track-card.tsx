import type { MilestoneProgress, MilestoneTrackId } from "@munib-tracker/shared/achievements";
import type { SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { milestoneDescription, milestoneTitle } from "@/lib/achievements-i18n";

type Tone = "success" | "warning" | "danger" | "info";

export const TRACK_LABEL_KEYS: Record<MilestoneTrackId, string> = {
  salah: "achievements.tracks.salah",
  streak: "achievements.tracks.streak",
  qaza: "achievements.tracks.qaza",
  roza: "achievements.tracks.roza",
  zikr: "achievements.tracks.zikr",
  consistency: "achievements.tracks.consistency",
  devotion: "achievements.devotion",
};

export const TRACK_VISUALS: Record<
  MilestoneTrackId,
  { icon: SymbolViewProps["name"]; tone: Tone }
> = {
  salah: {
    icon: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
    tone: "success",
  },
  streak: {
    icon: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
    tone: "warning",
  },
  zikr: { icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }, tone: "danger" },
  consistency: {
    icon: { ios: "calendar.badge.checkmark", android: "event_available", web: "event_available" },
    tone: "info",
  },
  qaza: {
    icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
    tone: "info",
  },
  roza: { icon: { ios: "moon.stars.fill", android: "bedtime", web: "bedtime" }, tone: "success" },
  devotion: {
    icon: { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" },
    tone: "warning",
  },
};

/** Most pips drawn for a ladder before collapsing the rest into "+N". */
const MAX_PIPS = 12;

type TrackCardProps = {
  /** The next milestone on this track (an active goal). */
  goal: MilestoneProgress;
  /** Highest milestone already earned on this track, if any. */
  current?: MilestoneProgress;
  /** Highlights the goal closest to unlocking. */
  closest?: boolean;
  /** Extra line under the title (e.g. best vs current streak). */
  note?: string;
  formatCount: (value: number) => string;
  style?: StyleProp<ViewStyle>;
};

/**
 * One progression track: what has been earned so far (level, title, a pip per
 * level) and the next milestone with how far is left to go.
 */
export function TrackCard({ goal, current, closest, note, formatCount, style }: TrackCardProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const visual = TRACK_VISUALS[goal.trackId];
  const tone = tokens.status[visual.tone];
  const isDebt = goal.trackId === "qaza" || goal.trackId === "roza";
  const earnedLevels = isDebt ? 0 : goal.level - 1;
  const remaining = Math.max(0, goal.threshold - goal.value);
  const pipCount = Math.min(earnedLevels + 1, MAX_PIPS);
  const overflow = earnedLevels + 1 - pipCount;
  const label = t(TRACK_LABEL_KEYS[goal.trackId]);
  const nextTitle = milestoneTitle(goal);

  return (
    <Card padding="three" style={[styles.card, style]}>
      <TvReadableBlock>
        <View style={styles.body}>
          <View style={styles.header}>
            <IconWell icon={visual.icon} tint={tone.color} background={tone.soft} />
            <View style={styles.headerCopy}>
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {label}
              </ThemedText>
              <ThemedText type="smallBold" numberOfLines={1}>
                {current
                  ? milestoneTitle(current)
                  : isDebt
                    ? nextTitle
                    : t("achievements.notStarted")}
              </ThemedText>
            </View>
            {!isDebt ? (
              <View style={[styles.levelPill, { backgroundColor: tone.soft }]}>
                <ThemedText type="smallBold" style={{ color: tone.text }}>
                  {t("achievements.level", { level: earnedLevels })}
                </ThemedText>
              </View>
            ) : null}
          </View>

          {note ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {note}
            </ThemedText>
          ) : null}

          {!isDebt ? (
            <View style={styles.pips} accessibilityElementsHidden importantForAccessibility="no">
              {Array.from({ length: pipCount }, (_, i) => {
                const earned = i < earnedLevels;
                return (
                  <View
                    // biome-ignore lint/suspicious/noArrayIndexKey: pips are positional
                    key={i}
                    style={[
                      styles.pip,
                      earned
                        ? { backgroundColor: tone.color }
                        : { borderColor: tone.color, borderWidth: 1.5 },
                    ]}
                  />
                );
              })}
              {overflow > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {`+${formatCount(overflow)}`}
                </ThemedText>
              ) : null}
            </View>
          ) : null}

          <View style={[styles.next, { backgroundColor: colors.muted }]}>
            <View style={styles.nextHeader}>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
                {isDebt
                  ? milestoneDescription(goal)
                  : t("achievements.nextUp", { title: nextTitle })}
              </ThemedText>
              {closest ? (
                <View style={[styles.closest, { backgroundColor: tone.soft }]}>
                  <ThemedText type="caption" style={{ color: tone.text }}>
                    {t("achievements.closest")}
                  </ThemedText>
                </View>
              ) : null}
            </View>
            {!isDebt ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {milestoneDescription(goal)}
              </ThemedText>
            ) : null}
            <ProgressBar value={goal.progress} color={tone.color} />
            <View style={styles.nextFooter}>
              <ThemedText type="smallBold" style={{ color: tone.text }}>
                {`${formatCount(goal.value)} / ${formatCount(goal.threshold)}`}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("achievements.toGo", { value: formatCount(remaining) })}
              </ThemedText>
            </View>
          </View>
        </View>
      </TvReadableBlock>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: "47%",
  },
  body: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  levelPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  pips: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 5,
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  next: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.two + 2,
    gap: Spacing.one + 2,
  },
  nextHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  closest: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  nextFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
});
