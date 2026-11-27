import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  GoalReminderBanner,
  type GoalReminderModel,
} from "@/components/tracker/goal-reminder-banner";
import { fridayChecklistHref, isFriday } from "@/lib/friday";
import {
  useEnsureFridayChecklistLoaded,
  useFridayChecklistForDate,
} from "@/stores/friday-checklist-store";

/**
 * Friday reminder for Today's Goal — the sunnah nudge + checklist shortcut
 * (the badge lives in the goal header). `null` on other days.
 */
export function useFridayGoalReminder(): GoalReminderModel | null {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureFridayChecklistLoaded();

  const today = getLocalDateString();
  const done = useFridayChecklistForDate(today);

  if (!isFriday()) return null;

  const completed = FRIDAY_CHECKLIST.filter((item) => done[item.id]).length;
  const total = FRIDAY_CHECKLIST.length;
  const allDone = completed === total && total > 0;
  const progress = t("home.fridayCard.progress", { completed, total });

  return {
    id: "friday",
    icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
    title: allDone ? t("home.fridayCard.allDone") : t("home.fridayCard.reminderTitle"),
    body: allDone ? progress : t("home.fridayCard.reminderBody"),
    link: allDone ? undefined : `${t("home.fridayCard.openChecklist")} · ${progress}`,
    tone: allDone ? "success" : "accent",
    accessibilityLabel: t("home.fridayCard.openChecklist"),
    onPress: () => router.push(fridayChecklistHref() as Href),
  };
}

/** Standalone banner (the goal card stacks reminders via `GoalReminderStack`). */
export function FridayGoalReminder() {
  const reminder = useFridayGoalReminder();
  if (!reminder) return null;
  const { id: _id, ...props } = reminder;
  return <GoalReminderBanner {...props} />;
}
