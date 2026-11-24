import {
  type FardPrayer,
  type FardStatusValue,
  graduationPromptStage,
} from "@munib-tracker/shared/circles";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FardDots } from "@/components/circles/fard-dots";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ChildProfile } from "@/lib/circles/api";
import {
  earnedSticker,
  lastNDates,
  type MemberDay,
  rewardProgress,
  stickerForDate,
  weeklyDigest,
} from "@/lib/circles/family";

/**
 * Parent view of one child (D7): today's five fard statuses (✓ / –), the
 * child's own stickers for the week, the reward bar and a gentle weekly line.
 * Nothing else — no notes, no qaza, no comparison with siblings.
 */
export function ChildCard({
  child,
  days,
  today,
  onToggle,
  onOpen,
  canEdit,
}: {
  child: ChildProfile;
  days: Map<string, MemberDay> | undefined;
  today: string;
  /** Flip one prayer for today (the caller computes the value from fresh data). */
  onToggle?: (prayer: FardPrayer) => void;
  onOpen?: () => void;
  canEdit: boolean;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const todayDay = days?.get(today);
  const digest = weeklyDigest(days, today);
  const reward = child.reward ? rewardProgress(days, child.reward.days) : null;
  const value: FardStatusValue | null = todayDay?.fard ?? null;
  const learning = child.ageBand === "learning";

  return (
    <Card padding="three" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.flex} numberOfLines={1}>
          {child.nickname}
        </ThemedText>
        <Pill compact label={t(`family.band.${child.ageBand}`)} />
      </View>

      {todayDay?.rest ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {t("family.restDayToday")}
        </ThemedText>
      ) : null}

      <FardDots value={value} onToggle={canEdit && onToggle ? onToggle : undefined} />

      <View style={styles.stickers} accessible accessibilityLabel={t("family.stickersA11y")}>
        {lastNDates(today, 7).map((date) => {
          const earned = earnedSticker(days?.get(date));
          return (
            <View key={date} style={[styles.sticker, { opacity: earned ? 1 : 0.25 }]}>
              <AppIcon
                icon={stickerForDate(date)}
                size={18}
                tintColor={earned ? tokens.status.warning.color : undefined}
              />
            </View>
          );
        })}
      </View>

      <ThemedText type="small" themeColor="mutedForeground">
        {learning
          ? t("family.digestLearning")
          : digest.prayed > 0
            ? t("family.digest", {
                name: child.nickname,
                prayed: digest.prayed,
                possible: digest.possible,
              })
            : t("family.digestEmpty")}
      </ThemedText>

      {child.reward && reward ? (
        <View style={styles.reward}>
          <ThemedText type="smallBold">
            {reward.reached
              ? t("family.reward.reached", { title: child.reward.title })
              : t("family.reward.progress", {
                  title: child.reward.title,
                  done: reward.done,
                  target: reward.target,
                })}
          </ThemedText>
          <ProgressBar value={reward.ratio} />
        </View>
      ) : null}

      {child.graduationAvailable ? (
        <ThemedText type="small" themeColor="accent">
          {graduationPromptStage(child.birthYear, child.graduationUnlocked) === "reprompt"
            ? t("family.graduation.reprompt")
            : t("family.graduation.available")}
        </ThemedText>
      ) : null}

      {onOpen ? (
        <Button label={t("family.child.manage")} variant="secondary" size="sm" onPress={onOpen} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
  stickers: { flexDirection: "row", gap: Spacing.one, justifyContent: "space-between" },
  sticker: { alignItems: "center", justifyContent: "center", width: 28, height: 28 },
  reward: { gap: Spacing.one },
});
