import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  GoalReminderBanner,
  type GoalReminderModel,
} from "@/components/tracker/goal-reminder-banner";
import { khatmTodayProgress } from "@/lib/khatm";
import { useEnsureKhatmLoaded, useKhatm } from "@/stores/khatm-store";

/**
 * Khatm reminder for Today's Goal — today's reading nudge + plan shortcut (the
 * badge lives in the goal header). `null` without a plan.
 */
export function useKhatmGoalReminder(): GoalReminderModel | null {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureKhatmLoaded();
  const { plan, ayahsRead, unit } = useKhatm();

  if (!plan) return null;

  const today = khatmTodayProgress(plan, ayahsRead);
  const isPage = unit === "page";
  const counts = { done: today.done, total: today.target };
  const progress = t("home.khatmCard.progress", counts);

  return {
    id: "khatm",
    icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
    title: today.complete
      ? t("home.khatmCard.allDone")
      : today.pace === "behind"
        ? t("home.khatmCard.catchUpTitle")
        : t("home.khatmCard.reminderTitle"),
    body: today.complete
      ? progress
      : isPage
        ? t("home.khatmCard.reminderBodyPages", counts)
        : t("home.khatmCard.reminderBody", counts),
    link: today.complete ? undefined : `${t("home.khatmCard.openPlan")} · ${progress}`,
    tone: today.pace === "behind" ? "warning" : today.complete ? "success" : "info",
    accessibilityLabel: t("home.khatmCard.openPlan"),
    onPress: () => router.push("/quran/khatm" as Href),
  };
}

/** Standalone banner (the goal card stacks reminders via `GoalReminderStack`). */
export function KhatmGoalReminder() {
  const reminder = useKhatmGoalReminder();
  if (!reminder) return null;
  const { id: _id, ...props } = reminder;
  return <GoalReminderBanner {...props} />;
}
