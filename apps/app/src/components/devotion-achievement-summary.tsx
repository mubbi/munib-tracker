import { earnedAchievementIds } from "@munib-tracker/shared/achievements";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useChevronForward } from "@/lib/rtl";
import { useAchievementStats, useDevotionProgress } from "@/stores/tracker-store";

type DevotionAchievementSummaryProps = {
  /** Render the pills in their denser variant (used on the home screen). */
  compact?: boolean;
  /** Background of the "milestones unlocked" pill — screens tint it differently. */
  milestonePillBackground: string;
};

/**
 * Devotion badge + achievement pills + level-progress bar. Shared by the home
 * and tracker screens, which each supply their own tappable container (see
 * `DevotionAchievementSummaryProps` for the intentional per-screen differences).
 * Self-sources devotion/achievement state so callers only pass presentation.
 */
export function DevotionAchievementSummary({
  compact = false,
  milestonePillBackground,
}: DevotionAchievementSummaryProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const devotion = useDevotionProgress();
  const stats = useAchievementStats();
  const chevronForward = useChevronForward();

  const locale = i18n.language?.split("-")[0];
  const formatCount = (value: number) => value.toLocaleString(locale);
  const devotionLevelProgress = devotion.noor - devotion.noorForCurrentLevel;
  const devotionLevelSpan = devotion.noorForNextLevel - devotion.noorForCurrentLevel;
  const milestonesUnlocked = earnedAchievementIds(stats).length;

  return (
    <>
      <View style={styles.achievementRow}>
        <View style={[styles.achievementBadge, { backgroundColor: tokens.status.warning.soft }]}>
          <ThemedText
            type="caption"
            style={[styles.achievementBadgeLabel, { color: tokens.status.warning.text }]}
          >
            {t("achievements.levelShort")}
          </ThemedText>
          <ThemedText
            type="subtitle"
            style={[styles.achievementBadgeLevel, { color: tokens.status.warning.color }]}
          >
            {formatCount(devotion.level)}
          </ThemedText>
        </View>

        <View style={styles.achievementCopy}>
          <View style={styles.achievementTitleRow}>
            <SymbolView
              name={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }}
              size={15}
              tintColor={tokens.status.warning.color}
            />
            <ThemedText type="smallBold">{t("settings.achievements")}</ThemedText>
          </View>
          <View style={styles.achievementPills}>
            <Pill
              icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
              label={t("achievements.noorPill", { noor: formatCount(devotion.noor) })}
              color={tokens.status.warning.text}
              background={tokens.status.warning.soft}
              compact={compact}
            />
            <Pill
              icon={{ ios: "rosette", android: "workspace_premium", web: "workspace_premium" }}
              label={t("achievements.milestonePill", { count: milestonesUnlocked })}
              color={colors.mutedForeground}
              background={milestonePillBackground}
              compact={compact}
            />
          </View>
        </View>

        <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
      </View>

      <View style={styles.achievementProgress}>
        <ProgressBar value={devotion.progress} height={6} color={tokens.status.warning.color} />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("home.devotionProgress", {
            current: formatCount(devotionLevelProgress),
            next: formatCount(devotionLevelSpan),
          })}
        </ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  achievementBadge: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementBadgeLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
    lineHeight: 12,
    textTransform: "uppercase",
  },
  achievementBadgeLevel: {
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  achievementCopy: {
    flex: 1,
    gap: Spacing.one + 2,
  },
  achievementTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  achievementPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one + 2,
  },
  achievementProgress: {
    gap: Spacing.one + 2,
  },
});
