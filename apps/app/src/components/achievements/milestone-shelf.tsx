import type { MilestoneProgress, MilestoneTrackId } from "@munib-tracker/shared/achievements";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  TRACK_LABEL_KEYS,
  TRACK_VISUALS,
  useTrackTones,
} from "@/components/achievements/track-card";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { milestoneTitle } from "@/lib/achievements-i18n";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";

const TRACK_ORDER: MilestoneTrackId[] = [
  "devotion",
  "salah",
  "streak",
  "consistency",
  "zikr",
  "recitation",
  "qaza",
  "roza",
];

/** Badges shown per track while the shelf is collapsed. */
export const COLLAPSED_PER_TRACK = 3;

type MilestoneShelfProps = {
  milestones: MilestoneProgress[];
  expanded: boolean;
  onShare?: (milestone: MilestoneProgress) => void;
  isSharing?: (id: string) => boolean;
  /** Web: a share is armed and waits for a second tap (user-gesture rule). */
  isGesturePending?: (id: string) => boolean;
  formatCount: (value: number) => string;
};

/** Group earned milestones by track, newest (highest level) first. */
export function groupMilestones(
  milestones: MilestoneProgress[],
): { trackId: MilestoneTrackId; items: MilestoneProgress[] }[] {
  const byTrack = new Map<MilestoneTrackId, MilestoneProgress[]>();
  for (const milestone of milestones) {
    const list = byTrack.get(milestone.trackId) ?? [];
    list.push(milestone);
    byTrack.set(milestone.trackId, list);
  }
  return TRACK_ORDER.filter((id) => byTrack.has(id)).map((trackId) => ({
    trackId,
    items: [...(byTrack.get(trackId) ?? [])].sort((a, b) => b.level - a.level),
  }));
}

/**
 * Earned badges as compact chips, one row group per track. Tapping a chip
 * shares it (phone / web); on TV each group is a readable D-pad stop.
 */
export function MilestoneShelf({
  milestones,
  expanded,
  onShare,
  isSharing,
  isGesturePending,
  formatCount,
}: MilestoneShelfProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const groups = groupMilestones(milestones);
  const tones = useTrackTones();

  return (
    <View style={styles.root}>
      {groups.map(({ trackId, items }) => {
        const visual = TRACK_VISUALS[trackId];
        const tone = tones[trackId];
        const shown = expanded ? items : items.slice(0, COLLAPSED_PER_TRACK);
        const hidden = items.length - shown.length;
        return (
          <TvReadableBlock key={trackId}>
            <View style={styles.group}>
              <View style={styles.groupHeader}>
                <SymbolView name={visual.icon} size={14} tintColor={tone.color} />
                <ThemedText type="smallBold" style={styles.flex}>
                  {t(TRACK_LABEL_KEYS[trackId])}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {formatCount(items.length)}
                </ThemedText>
              </View>
              <View style={styles.chips}>
                {shown.map((milestone) => {
                  const title = milestoneTitle(milestone);
                  const label = `${title} · ${t("achievements.level", { level: milestone.level })}`;
                  const chip = (
                    <View
                      key={milestone.id}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isGesturePending?.(milestone.id)
                            ? tokens.accentSoft
                            : colors.muted,
                          borderColor: tokens.hairline,
                        },
                        isSharing?.(milestone.id) ? styles.dim : null,
                      ]}
                    >
                      <View style={[styles.chipBadge, { backgroundColor: tone.soft }]}>
                        <SymbolView
                          name={{
                            ios: "trophy.fill",
                            android: "emoji_events",
                            web: "emoji_events",
                          }}
                          size={11}
                          tintColor={tone.color}
                        />
                      </View>
                      <ThemedText type="caption" numberOfLines={1} style={styles.chipText}>
                        {title}
                      </ThemedText>
                      {onShare && !tv ? (
                        <SymbolView
                          name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                          size={11}
                          tintColor={colors.mutedForeground}
                        />
                      ) : null}
                    </View>
                  );
                  return onShare && !tv ? (
                    <PressableScale
                      key={milestone.id}
                      haptic="light"
                      scaleTo={0.96}
                      accessibilityRole="button"
                      accessibilityLabel={
                        isGesturePending?.(milestone.id)
                          ? tTv(t, "share.tapToShare", "share.selectToShare")
                          : t("achievements.shareBadge", { title: label })
                      }
                      onPress={isSharing?.(milestone.id) ? undefined : () => onShare(milestone)}
                    >
                      {chip}
                    </PressableScale>
                  ) : (
                    <View key={milestone.id} accessible accessibilityLabel={label}>
                      {chip}
                    </View>
                  );
                })}
                {hidden > 0 ? (
                  <View style={[styles.chip, styles.moreChip, { borderColor: tokens.hairline }]}>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {`+${formatCount(hidden)}`}
                    </ThemedText>
                  </View>
                ) : null}
              </View>
            </View>
          </TvReadableBlock>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.three,
  },
  group: {
    gap: Spacing.two,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
  },
  flex: {
    flex: 1,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
    paddingStart: Spacing.oneHalf,
    paddingEnd: Spacing.twoHalf,
    minHeight: 36,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.hairline,
    maxWidth: 260,
  },
  moreChip: {
    paddingStart: Spacing.twoHalf,
  },
  chipBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    flexShrink: 1,
  },
  dim: {
    opacity: 0.5,
  },
});
