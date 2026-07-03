import { type AchievementProgress, evaluateAchievements } from "@munib-tracker/shared/achievements";
import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import { aggregateByDate, computeStreak } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Share, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { PrayerRepository, QazaRepository, ZikrRepository } from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const OBLIGATORY = new Set<string>(OBLIGATORY_PRAYERS);

export default function AchievementsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [items, setItems] = useState<AchievementProgress[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        const [logs, zikr, counters] = await Promise.all([
          PrayerRepository.getAll(),
          ZikrRepository.getAll(),
          QazaRepository.getCounters(),
        ]);
        const prayersCompleted = logs.filter(
          (l) => l.status === "completed" && OBLIGATORY.has(l.prayerId),
        ).length;
        const bestDay = Math.max(0, ...[...aggregateByDate(logs).values()].map((d) => d.completed));
        const stats = {
          streak: computeStreak(logs, true),
          prayersCompleted,
          qazaCompleted: counters.reduce((sum, c) => sum + c.completed, 0),
          zikrCompleted: zikr.filter((z) => z.completed).length,
          bestDay,
        };
        const evaluated = evaluateAchievements(stats);

        // Persist the unlocked set so it survives even if stats later change.
        const known = await readJSON<string[]>(DB_KEYS.achievements, []);
        const unlockedIds = evaluated.filter((a) => a.unlocked).map((a) => a.id);
        const merged = Array.from(new Set([...known, ...unlockedIds]));
        await writeJSON(DB_KEYS.achievements, merged);

        if (active) {
          setItems(evaluated.map((a) => ({ ...a, unlocked: a.unlocked || merged.includes(a.id) })));
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const unlockedCount = items.filter((a) => a.unlocked).length;

  const share = async (achievement: AchievementProgress) => {
    if (Platform.OS === "web") return;
    try {
      await Share.share({
        message: t("achievements.shareMessage", {
          title: achievement.title,
          description: achievement.description,
        }),
      });
    } catch {
      // cancelled
    }
  };

  return (
    <ScreenLayout
      eyebrow={t("achievements.eyebrow")}
      title={t("settings.achievements")}
      subtitle={t("achievements.subtitle", { unlocked: unlockedCount, total: items.length })}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
        <View style={styles.grid}>
          {items.map((achievement) => (
            <Card key={achievement.id} padding="three" style={styles.card}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: achievement.unlocked
                      ? tokens.status.warning.soft
                      : colors.muted,
                  },
                ]}
              >
                <SymbolView
                  name={
                    achievement.unlocked
                      ? { ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }
                      : { ios: "lock.fill", android: "lock", web: "lock" }
                  }
                  size={22}
                  tintColor={
                    achievement.unlocked ? tokens.status.warning.color : colors.mutedForeground
                  }
                />
              </View>
              <ThemedText type="smallBold">{achievement.title}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {achievement.description}
              </ThemedText>
              {achievement.unlocked ? (
                Platform.OS !== "web" ? (
                  <ThemedText
                    type="caption"
                    style={{ color: colors.accent }}
                    onPress={() => share(achievement)}
                  >
                    {t("achievements.share")}
                  </ThemedText>
                ) : null
              ) : (
                <View style={styles.progress}>
                  <ProgressBar value={achievement.progress} />
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {achievement.value}/{achievement.threshold}
                  </ThemedText>
                </View>
              )}
            </Card>
          ))}
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
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
