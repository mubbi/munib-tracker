import {
  evaluateProgression,
  type MilestoneProgress,
  type ProgressionState,
  resolveUnlockedMilestones,
  summarizeQazaDebt,
  summarizeRozaDebt,
} from "@munib-tracker/shared/achievements";
import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import { computeStreak, countPerfectDays } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { PrayerRepository, QazaRepository, ZikrRepository } from "@/db";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { milestoneDescription, milestoneTitle } from "@/lib/achievements-i18n";
import { persistAchievementSync } from "@/lib/achievements-persistence";
import { goBackOrReplace } from "@/lib/navigation";
import { formatAchievementShare } from "@/lib/share";

const OBLIGATORY = new Set<string>(OBLIGATORY_PRAYERS);

const TRACK_LABEL_KEYS: Record<string, string> = {
  salah: "achievements.tracks.salah",
  streak: "achievements.tracks.streak",
  qaza: "achievements.tracks.qaza",
  roza: "achievements.tracks.roza",
  zikr: "achievements.tracks.zikr",
  consistency: "achievements.tracks.consistency",
};

function MilestoneCard({
  milestone,
  variant,
  onShare,
  shareLoading,
  gesturePending,
}: {
  milestone: MilestoneProgress;
  variant: "active" | "unlocked";
  onShare?: (milestone: MilestoneProgress) => void;
  shareLoading?: boolean;
  gesturePending?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const unlocked = variant === "unlocked";

  const trackLabel =
    milestone.trackId === "devotion"
      ? t("achievements.devotion")
      : t(TRACK_LABEL_KEYS[milestone.trackId] ?? milestone.trackId);

  if (unlocked) {
    return (
      <Card key={milestone.id} padding="three" style={styles.unlockedCard}>
        <View style={styles.unlockedHeader}>
          <View style={[styles.badgeSmall, { backgroundColor: tokens.status.warning.soft }]}>
            <SymbolView
              name={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }}
              size={16}
              tintColor={tokens.status.warning.color}
            />
          </View>
          {onShare ? (
            <PressableScale
              onPress={shareLoading ? undefined : () => onShare(milestone)}
              haptic="light"
              hitSlop={8}
              scaleTo={0.9}
              accessibilityRole="button"
              accessibilityLabel={
                shareLoading
                  ? t("share.preparing")
                  : gesturePending
                    ? t("share.tapToShare")
                    : t("achievements.share")
              }
              style={[
                styles.shareButton,
                {
                  backgroundColor: gesturePending ? tokens.accentSoft : colors.muted,
                  opacity: shareLoading ? 0.5 : 1,
                },
              ]}
            >
              <SymbolView
                name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                size={14}
                tintColor={colors.accent}
              />
            </PressableScale>
          ) : null}
        </View>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {trackLabel} · {t("achievements.level", { level: milestone.level })}
        </ThemedText>
        <ThemedText type="smallBold" numberOfLines={1}>
          {milestoneTitle(milestone)}
        </ThemedText>
      </Card>
    );
  }

  return (
    <Card key={milestone.id} padding="three" style={styles.card}>
      <View style={[styles.badge, { backgroundColor: colors.muted }]}>
        <SymbolView
          name={{ ios: "target", android: "track_changes", web: "track_changes" }}
          size={22}
          tintColor={colors.accent}
        />
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {trackLabel}
        {" · "}
        {t("achievements.level", { level: milestone.level })}
      </ThemedText>
      <ThemedText type="smallBold">{milestoneTitle(milestone)}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {milestoneDescription(milestone)}
      </ThemedText>
      <View style={styles.progress}>
        <ProgressBar value={milestone.progress} />
        <ThemedText type="caption" themeColor="mutedForeground">
          {milestone.value}/{milestone.threshold}
        </ThemedText>
      </View>
    </Card>
  );
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const [state, setState] = useState<ProgressionState | null>(null);
  const [unlocked, setUnlocked] = useState<MilestoneProgress[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          const [logs, zikr, counters, roza] = await Promise.all([
            PrayerRepository.getAll(),
            ZikrRepository.getAll(),
            QazaRepository.getCounters(),
            QazaRepository.getRoza(),
          ]);
          const prayersCompleted = logs.filter(
            (l) => l.status === "completed" && OBLIGATORY.has(l.prayerId),
          ).length;
          const stats = {
            streak: computeStreak(logs, true),
            prayersCompleted,
            qazaDebt: summarizeQazaDebt(counters),
            rozaDebt: summarizeRozaDebt(roza),
            zikrCompleted: zikr.filter((z) => z.completed).length,
            perfectDays: countPerfectDays(logs),
          };
          const progression = evaluateProgression(stats);
          const { synced } = await persistAchievementSync(stats);

          const persistedUnlocked = resolveUnlockedMilestones(synced, stats).sort(
            (a, b) => b.level - a.level,
          );

          if (active) {
            setState(progression);
            setUnlocked(persistedUnlocked);
          }
        } catch (error) {
          // Keep the last-known state rather than silently showing an empty screen.
          if (__DEV__) console.error("Failed to load achievements", error);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const shareMilestone = async (milestone: MilestoneProgress) => {
    const trackLabel =
      milestone.trackId === "devotion"
        ? t("achievements.devotion")
        : t(TRACK_LABEL_KEYS[milestone.trackId] ?? milestone.trackId);
    const title = milestoneTitle(milestone);
    const description = milestoneDescription(milestone);
    await share({
      message: formatAchievementShare(title, description),
      sectionTitle: t("share.sectionAchievement"),
      contentLabel: `${trackLabel} · L${milestone.level}`,
      filenameSlug: "achievement",
      shareKey: milestone.id,
      content: {
        kind: "achievement",
        title,
        description,
        trackLabel,
        level: milestone.level,
      },
    });
  };

  const devotion = state?.devotion;
  const milestoneCount = unlocked.length;

  return (
    <ScreenLayout
      eyebrow={t("achievements.eyebrow")}
      title={t("settings.achievements")}
      subtitle={
        devotion
          ? t("achievements.subtitleProgress", {
              level: devotion.level,
              milestones: milestoneCount,
            })
          : t("achievements.subtitleLoading")
      }
      onBack={() => goBackOrReplace(router, "/")}
    >
      {SnapshotHost}
      <Seo path="/achievements" />
      <Stagger>
        <View style={styles.stack}>
          {devotion ? (
            <Card padding="four" style={styles.hero}>
              <View style={styles.heroRow}>
                <View
                  style={[styles.devotionBadge, { backgroundColor: tokens.status.warning.soft }]}
                >
                  <ThemedText
                    type="caption"
                    style={[styles.devotionBadgeLabel, { color: tokens.status.warning.text }]}
                  >
                    {t("achievements.levelShort")}
                  </ThemedText>
                  <ThemedText
                    type="header"
                    style={[styles.devotionBadgeLevel, { color: tokens.status.warning.color }]}
                  >
                    {devotion.level}
                  </ThemedText>
                </View>
                <View style={styles.heroCopy}>
                  <View style={styles.heroTitleRow}>
                    <SymbolView
                      name={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }}
                      size={16}
                      tintColor={tokens.status.warning.color}
                    />
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("achievements.devotion")}
                    </ThemedText>
                  </View>
                  <ThemedText type="subtitle">
                    {t("achievements.devotionLevel", { level: devotion.level })}
                  </ThemedText>
                  <View style={styles.heroPills}>
                    <Pill
                      icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
                      label={t("achievements.noorPill", { noor: devotion.noor })}
                      color={tokens.status.warning.text}
                      background={tokens.status.warning.soft}
                    />
                    <Pill
                      icon={{
                        ios: "rosette",
                        android: "workspace_premium",
                        web: "workspace_premium",
                      }}
                      label={t("achievements.milestonePill", { count: milestoneCount })}
                      color={colors.mutedForeground}
                      background={colors.muted}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.heroProgress}>
                <ProgressBar
                  value={devotion.progress}
                  height={6}
                  color={tokens.status.warning.color}
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("achievements.devotionNoor", {
                    current: devotion.noor - devotion.noorForCurrentLevel,
                    next: devotion.noorForNextLevel - devotion.noorForCurrentLevel,
                  })}
                </ThemedText>
              </View>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("achievements.devotionHint")}
              </ThemedText>
            </Card>
          ) : null}

          <View style={styles.section}>
            <ThemedText type="smallBold">{t("achievements.activeGoals")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("achievements.activeGoalsHint")}
            </ThemedText>
            <View style={styles.grid}>
              {(state?.activeGoals ?? []).map((goal) => (
                <MilestoneCard key={goal.id} milestone={goal} variant="active" />
              ))}
            </View>
          </View>

          {unlocked.length > 0 ? (
            <View style={styles.section}>
              <ThemedText type="smallBold">{t("achievements.milestonesReached")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("achievements.milestonesReachedHint", { count: unlocked.length })}
              </ThemedText>
              <View style={styles.grid}>
                {unlocked.map((milestone) => (
                  <MilestoneCard
                    key={milestone.id}
                    milestone={milestone}
                    variant="unlocked"
                    onShare={shareMilestone}
                    shareLoading={isSharing(milestone.id)}
                    gesturePending={isGesturePending(milestone.id)}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.four,
  },
  hero: {
    gap: Spacing.three,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  devotionBadge: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  devotionBadgeLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
    lineHeight: 12,
    textTransform: "uppercase",
  },
  devotionBadgeLevel: {
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  heroCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  heroPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one + 2,
    marginTop: Spacing.half,
  },
  heroProgress: {
    gap: Spacing.one + 2,
  },
  section: {
    gap: Spacing.one,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  card: {
    flexGrow: 1,
    flexBasis: "47%",
    gap: Spacing.one,
  },
  unlockedCard: {
    flexGrow: 1,
    flexBasis: "47%",
    gap: Spacing.half,
  },
  unlockedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.one,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
  },
  badgeSmall: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  progress: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
