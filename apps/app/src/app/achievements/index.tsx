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
import { ProgressBar } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { PrayerRepository, QazaRepository, ZikrRepository } from "@/db";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { persistAchievementSync } from "@/lib/achievements-persistence";
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

  return (
    <Card key={milestone.id} padding="three" style={styles.card}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: unlocked ? tokens.status.warning.soft : colors.muted,
          },
        ]}
      >
        <SymbolView
          name={
            unlocked
              ? { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }
              : { ios: "target", android: "track_changes", web: "track_changes" }
          }
          size={22}
          tintColor={unlocked ? tokens.status.warning.color : colors.accent}
        />
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {milestone.trackId === "devotion"
          ? t("achievements.devotion")
          : t(TRACK_LABEL_KEYS[milestone.trackId] ?? milestone.trackId)}
        {" · "}
        {t("achievements.level", { level: milestone.level })}
      </ThemedText>
      <ThemedText type="smallBold">{milestone.title}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {milestone.description}
      </ThemedText>
      {unlocked ? (
        onShare ? (
          <ThemedText
            type="caption"
            style={{ color: colors.accent, opacity: shareLoading ? 0.6 : 1 }}
            onPress={shareLoading ? undefined : () => onShare(milestone)}
          >
            {shareLoading
              ? t("share.preparing")
              : gesturePending
                ? t("share.tapToShare")
                : t("achievements.share")}
          </ThemedText>
        ) : null
      ) : (
        <View style={styles.progress}>
          <ProgressBar value={milestone.progress} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {milestone.value}/{milestone.threshold}
          </ThemedText>
        </View>
      )}
    </Card>
  );
}

export default function AchievementsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
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
    await share({
      message: formatAchievementShare(milestone.title, milestone.description),
      sectionTitle: t("share.sectionAchievement"),
      contentLabel: `${trackLabel} · L${milestone.level}`,
      filenameSlug: "achievement",
      shareKey: milestone.id,
      content: {
        kind: "achievement",
        title: milestone.title,
        description: milestone.description,
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
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
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
                  <ThemedText type="title" style={{ color: tokens.status.warning.color }}>
                    {devotion.level}
                  </ThemedText>
                </View>
                <View style={styles.heroCopy}>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("achievements.devotion")}
                  </ThemedText>
                  <ThemedText type="subtitle">
                    {t("achievements.devotionLevel", { level: devotion.level })}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("achievements.devotionNoor", {
                      current: devotion.noor - devotion.noorForCurrentLevel,
                      next: devotion.noorForNextLevel - devotion.noorForCurrentLevel,
                    })}
                  </ThemedText>
                </View>
              </View>
              <ProgressBar value={devotion.progress} />
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
    gap: Spacing.two,
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
  heroCopy: {
    flex: 1,
    gap: Spacing.half,
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
  badge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.one,
  },
  progress: {
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
