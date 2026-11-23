import {
  computeNoorBreakdown,
  evaluateProgression,
  getMilestoneById,
  type MilestoneProgress,
  NOOR_WEIGHTS,
  type NoorSource,
} from "@munib-tracker/shared/achievements";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import {
  COLLAPSED_PER_TRACK,
  groupMilestones,
  MilestoneShelf,
} from "@/components/achievements/milestone-shelf";
import { TRACK_LABEL_KEYS, TrackCard } from "@/components/achievements/track-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { LinkRow, ReadableView } from "@/components/statistics/metrics";
import { StatusDistribution } from "@/components/statistics/status-distribution";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { milestoneDescription, milestoneTitle } from "@/lib/achievements-i18n";
import { persistAchievementSync } from "@/lib/achievements-persistence";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { formatAchievementShare } from "@/lib/share";
import { useAchievementStats, useTrackerActions } from "@/stores/tracker-store";

const NOOR_SOURCE_KEYS: Record<NoorSource, string> = {
  salah: "achievements.noorSource.salah",
  qaza: "achievements.noorSource.qaza",
  roza: "achievements.noorSource.roza",
  zikr: "achievements.noorSource.zikr",
  perfectDay: "achievements.noorSource.perfectDay",
  streakDay: "achievements.noorSource.streakDay",
};

export default function AchievementsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { refresh } = useTrackerActions();
  const stats = useAchievementStats();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const [refreshed, setRefreshed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const tv = isTV();
  const { width } = useWindowDimensions();
  const locale = i18n.language?.split("-")[0];
  const formatCount = useCallback((value: number) => value.toLocaleString(locale), [locale]);

  // Same live stats as the tracker / statistics (one source of truth): refresh
  // the store on focus instead of recomputing from the repositories here.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      void refresh()
        .catch((error: unknown) => {
          if (__DEV__) console.error("Failed to refresh achievements", error);
        })
        .finally(() => {
          if (active) setRefreshed(true);
        });
      return () => {
        active = false;
      };
    }, [refresh]),
  );

  const state = useMemo(() => evaluateProgression(stats), [stats]);
  // `refresh()` recomputes the stats itself, so this works even before the
  // app-level `load()` (which waits for onboarding) has run.
  const loaded = refreshed;

  // Keep the persisted unlock list in step with what this screen shows.
  useEffect(() => {
    if (loaded) void persistAchievementSync(stats);
  }, [loaded, stats]);

  const devotion = state.devotion;
  const unlocked = state.unlockedMilestones;
  const noor = useMemo(() => computeNoorBreakdown(stats), [stats]);
  const noorPalette = [
    tokens.status.success.color,
    tokens.status.warning.color,
    tokens.status.danger.color,
    tokens.status.info.color,
    withAlpha(tokens.status.info.color, 0.45),
    colors.mutedForeground,
  ];
  // Levels 1–10 have a named rank ("Steady Soul"); beyond that the title would
  // only repeat the level number.
  const devotionRank =
    devotion.level >= 1 && devotion.level <= 10
      ? getMilestoneById(`devotion:${devotion.level}`, stats)
      : undefined;
  const devotionTitle = devotionRank ? milestoneTitle(devotionRank) : null;

  const trackGoals = state.activeGoals;
  const closestId = useMemo(() => {
    let best: MilestoneProgress | null = null;
    for (const goal of trackGoals) {
      if (goal.progress >= 1) continue;
      if (!best || goal.progress > best.progress) best = goal;
    }
    return best?.id ?? null;
  }, [trackGoals]);
  const currentByTrack = useMemo(() => {
    const map = new Map<string, MilestoneProgress>();
    for (const goal of trackGoals) {
      if (goal.trackId === "qaza" || goal.trackId === "roza" || goal.level <= 1) continue;
      const current = getMilestoneById(`${goal.trackId}:${goal.level - 1}`, stats);
      if (current) map.set(goal.trackId, current);
    }
    return map;
  }, [trackGoals, stats]);

  const canCollapse = groupMilestones(unlocked).some((g) => g.items.length > COLLAPSED_PER_TRACK);
  const isNewUser =
    loaded && stats.prayersCompleted === 0 && stats.zikrCompleted === 0 && unlocked.length === 0;

  // Wide web / tablets: three track cards per row (four on very wide screens).
  // Phone: one card per row (titles need the width); wide web / tablets: three
  // per row (four on very wide screens); TV: three.
  const trackBasis = tv
    ? styles.basisThird
    : width >= 1600
      ? styles.basisQuarter
      : width >= 1024
        ? styles.basisThird
        : width < 600
          ? styles.basisFull
          : undefined;

  const shareMilestone = async (milestone: MilestoneProgress) => {
    const trackLabel = t(TRACK_LABEL_KEYS[milestone.trackId]);
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

  return (
    <ScreenLayout
      eyebrow={t("achievements.eyebrow")}
      title={t("settings.achievements")}
      subtitle={
        loaded
          ? t("achievements.subtitleProgress", {
              level: devotion.level,
              milestones: unlocked.length,
            })
          : t("achievements.subtitleLoading")
      }
      onBack={() => goBackOrReplace(router, "/")}
    >
      {SnapshotHost}
      <Seo path="/achievements" />
      {!loaded ? (
        <AchievementsSkeleton />
      ) : (
        <Stagger>
          <View style={styles.stack}>
            {/* ── Devotion hero ─────────────────────────────────────────── */}
            <Card padding="four" style={styles.hero}>
              <ReadableView style={styles.heroBody}>
                <View style={styles.heroRow}>
                  <View
                    style={[
                      styles.devotionBadge,
                      tv ? { width: tvDp(72), height: tvDp(72) } : null,
                      { backgroundColor: tokens.status.warning.soft },
                    ]}
                  >
                    <ThemedText
                      type="caption"
                      style={[styles.devotionBadgeLabel, { color: tokens.status.warning.text }]}
                    >
                      {t("achievements.levelShort")}
                    </ThemedText>
                    <ThemedText
                      type="header"
                      style={[styles.devotionBadgeLevel, { color: tokens.status.warning.text }]}
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
                      {devotionTitle
                        ? `${t("achievements.devotionLevel", { level: devotion.level })} · ${devotionTitle}`
                        : t("achievements.devotionLevel", { level: devotion.level })}
                    </ThemedText>
                    <View style={styles.heroPills}>
                      <Pill
                        icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
                        label={t("achievements.noorPill", { noor: formatCount(devotion.noor) })}
                        color={tokens.status.warning.text}
                        background={tokens.status.warning.soft}
                      />
                      <Pill
                        icon={{
                          ios: "rosette",
                          android: "workspace_premium",
                          web: "workspace_premium",
                        }}
                        label={t("achievements.milestonePill", { count: unlocked.length })}
                        color={colors.mutedForeground}
                        background={colors.muted}
                      />
                      {stats.bestStreak > 0 ? (
                        <Pill
                          icon={{
                            ios: "flame.fill",
                            android: "local_fire_department",
                            web: "local_fire_department",
                          }}
                          label={t("achievements.bestStreakPill", {
                            value: formatCount(stats.bestStreak),
                          })}
                          color={colors.mutedForeground}
                          background={colors.muted}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
                <View style={styles.heroProgress}>
                  <ProgressBar
                    value={devotion.progress}
                    height={8}
                    color={tokens.status.warning.color}
                  />
                  <View style={styles.heroProgressRow}>
                    <ThemedText type="caption" themeColor="mutedForeground" style={styles.flex}>
                      {t("achievements.devotionNoor", {
                        current: formatCount(devotion.noor - devotion.noorForCurrentLevel),
                        next: formatCount(devotion.noorForNextLevel - devotion.noorForCurrentLevel),
                      })}
                    </ThemedText>
                    <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
                      {t("achievements.toNextLevel", {
                        value: formatCount(devotion.noorForNextLevel - devotion.noor),
                        level: devotion.level + 1,
                      })}
                    </ThemedText>
                  </View>
                </View>
              </ReadableView>

              {noor.length > 0 ? (
                <ReadableView style={styles.noorBlock}>
                  <ThemedText
                    type="smallBold"
                    themeColor="mutedForeground"
                    style={styles.blockLabel}
                  >
                    {t("achievements.noorBreakdown")}
                  </ThemedText>
                  <StatusDistribution
                    formatValue={formatCount}
                    segments={noor.map((entry, i) => ({
                      key: entry.source,
                      label: `${t(NOOR_SOURCE_KEYS[entry.source])} · ${formatCount(entry.count)} × ${NOOR_WEIGHTS[entry.source]}`,
                      amount: entry.noor,
                      color: noorPalette[i % noorPalette.length] ?? tokens.status.warning.color,
                    }))}
                  />
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("achievements.devotionHint")}
                  </ThemedText>
                </ReadableView>
              ) : (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("achievements.devotionHint")}
                </ThemedText>
              )}
              <LinkRow
                label={t("achievements.statsLink")}
                onPress={() => router.push("/statistics")}
              />
            </Card>

            {isNewUser ? (
              <Card padding="four" style={styles.intro}>
                <ThemedText type="subtitle">{t("achievements.emptyTitle")}</ThemedText>
                <ThemedText type="small" themeColor="mutedForeground">
                  {t("achievements.emptyDesc")}
                </ThemedText>
                <Button
                  label={t("statistics.openTracker")}
                  onPress={() => router.push("/tracker")}
                />
              </Card>
            ) : null}

            {/* ── Tracks ────────────────────────────────────────────────── */}
            <View style={styles.section}>
              <ThemedText type="subtitle">{t("achievements.tracksTitle")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("achievements.tracksHint")}
              </ThemedText>
              <View style={styles.grid}>
                {trackGoals.map((goal) => (
                  <TrackCard
                    key={goal.id}
                    goal={goal}
                    current={currentByTrack.get(goal.trackId)}
                    closest={goal.id === closestId}
                    formatCount={formatCount}
                    note={
                      goal.trackId === "streak"
                        ? t("achievements.streakBestNow", {
                            best: formatCount(stats.bestStreak),
                            current: formatCount(stats.streak),
                          })
                        : undefined
                    }
                    style={trackBasis}
                  />
                ))}
              </View>
            </View>

            {/* ── Earned badges ─────────────────────────────────────────── */}
            {unlocked.length > 0 ? (
              <Card padding="four" style={styles.shelfCard}>
                <View style={styles.shelfHeader}>
                  <View style={styles.flex}>
                    <ThemedText type="subtitle">{t("achievements.milestonesReached")}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {tv
                        ? t("achievements.milestonesReachedHint", { count: unlocked.length })
                        : t("achievements.tapToShare")}
                    </ThemedText>
                  </View>
                </View>
                <MilestoneShelf
                  milestones={unlocked}
                  expanded={expanded || tv}
                  onShare={shareMilestone}
                  isSharing={isSharing}
                  isGesturePending={isGesturePending}
                  formatCount={formatCount}
                />
                {canCollapse && !tv ? (
                  <LinkRow
                    label={
                      expanded
                        ? t("achievements.showLess")
                        : t("achievements.showAll", { value: formatCount(unlocked.length) })
                    }
                    onPress={() => setExpanded((v) => !v)}
                  />
                ) : null}
              </Card>
            ) : null}
          </View>
        </Stagger>
      )}
    </ScreenLayout>
  );
}

function AchievementsSkeleton() {
  return (
    <View
      style={styles.stack}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Card padding="four" style={styles.hero}>
        <Skeleton width="50%" height={22} />
        <Skeleton height={10} radius={Radius.pill} />
        <Skeleton height={120} radius={Radius.md} />
      </Card>
      <View style={styles.grid}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} padding="three" style={styles.skeletonTile}>
            <Skeleton width="60%" height={16} />
            <Skeleton height={70} radius={Radius.md} />
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.four,
  },
  hero: {
    gap: Spacing.three,
  },
  heroBody: {
    gap: Spacing.three,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  devotionBadge: {
    width: 72,
    height: 72,
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
    fontSize: 30,
    lineHeight: 32,
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
  heroProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  noorBlock: {
    gap: Spacing.two,
  },
  blockLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
  },
  intro: {
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.one,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  /** Wide screens / TV: three or four track cards per row. */
  basisFull: {
    flexBasis: "100%",
  },
  basisThird: {
    flexBasis: "30%",
  },
  basisQuarter: {
    flexBasis: "22%",
  },
  skeletonTile: {
    flexGrow: 1,
    flexBasis: "47%",
    gap: Spacing.two,
  },
  shelfCard: {
    gap: Spacing.three,
  },
  shelfHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/achievements");
