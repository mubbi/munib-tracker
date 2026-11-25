import { isLiveFastEntry } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  GoalReminderBanner,
  type GoalReminderModel,
} from "@/components/tracker/goal-reminder-banner";
import {
  isWhiteDay,
  whiteDayFastsForHijriMonth,
  whiteDaysChecklistHref,
  whiteDaysHijriMonthKey,
} from "@/lib/white-days";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastingEntries,
} from "@/stores/voluntary-fasting-store";
import { useEnsureWhiteDaysChecklistLoaded } from "@/stores/white-days-checklist-store";

/**
 * White Days (Ayyām al-Bīḍ) reminder for Today's Goal — mirrors the Friday
 * reminder. Only on a White Day a fast may be suggested on (never 13
 * Dhul-Hijjah or Ramadan); progress counts this Hijri month's kept White Day
 * fasts in the voluntary-fasting log (one record of a fast, NF-3.2).
 */
export function useWhiteDaysGoalReminder(): GoalReminderModel | null {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureVoluntaryFastingLoaded();
  useEnsureWhiteDaysChecklistLoaded();
  const entries = useVoluntaryFastingEntries();

  if (!isWhiteDay()) return null;

  const [year, month] = whiteDaysHijriMonthKey().split("-").map(Number);
  const fasts = whiteDayFastsForHijriMonth(year as number, month as number);
  const completed = fasts.filter((fast) => {
    const entry = entries[fast.date];
    return isLiveFastEntry(entry) && entry.status === "fasted";
  }).length;
  const total = fasts.length;
  const allDone = completed === total && total > 0;
  const progress = t("home.whiteDaysCard.progress", { completed, total });

  return {
    id: "white-days",
    icon: { ios: "moon.circle.fill", android: "brightness_3", web: "brightness_3" },
    title: allDone
      ? total === 3
        ? t("home.whiteDaysCard.allDone")
        : t("home.whiteDaysCard.allDoneMonth")
      : t("home.whiteDaysCard.reminderTitle"),
    body: allDone ? progress : t("home.whiteDaysCard.reminderBody"),
    link: allDone ? undefined : `${t("home.whiteDaysCard.openChecklist")} · ${progress}`,
    tone: allDone ? "success" : "accent",
    accessibilityLabel: t("home.whiteDaysCard.openChecklist"),
    onPress: () => router.push(whiteDaysChecklistHref() as Href),
  };
}

/** Standalone banner (the goal card stacks reminders via `GoalReminderStack`). */
export function WhiteDaysGoalReminder() {
  const reminder = useWhiteDaysGoalReminder();
  if (!reminder) return null;
  const { id: _id, ...props } = reminder;
  return <GoalReminderBanner {...props} />;
}
