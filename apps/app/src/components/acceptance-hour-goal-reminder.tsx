import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  GoalReminderBanner,
  type GoalReminderModel,
} from "@/components/tracker/goal-reminder-banner";
import { useNow } from "@/hooks/use-now";
import {
  ACCEPTANCE_HOUR_ROUTE,
  isAcceptanceHourFallbackWindow,
  isAcceptanceHourWindow,
} from "@/lib/acceptance-hour";
import { isFriday } from "@/lib/friday";
import { computeLocationPrayerTimes } from "@/lib/location";
import { prayerDayAnchor } from "@/lib/time";
import { useLocation } from "@/stores/location-store";

/** Whether Friday's hour-of-acceptance window is currently open. */
export function useAcceptanceHourActive(): boolean {
  const location = useLocation();
  const now = useNow();

  return useMemo(() => {
    if (!isFriday(now)) return false;
    if (location.source === "default") {
      return isAcceptanceHourFallbackWindow(now);
    }
    const times = computeLocationPrayerTimes(location, prayerDayAnchor(now, location.timeZone));
    return isAcceptanceHourWindow(now, times.asr, times.maghrib);
  }, [location, now]);
}

/**
 * Today's Goal reminder during Friday's hour of acceptance (Asr→Maghrib when
 * location is known; otherwise a late-afternoon fallback). Deep-links to the
 * Friday guide topic.
 */
export function useAcceptanceHourGoalReminder(): GoalReminderModel | null {
  const router = useRouter();
  const { t } = useTranslation();
  const inWindow = useAcceptanceHourActive();

  if (!inWindow) return null;

  return {
    id: "acceptance-hour",
    icon: {
      ios: "hands.sparkles.fill",
      android: "volunteer_activism",
      web: "volunteer_activism",
    },
    title: t("home.acceptanceHourCard.reminderTitle"),
    body: t("home.acceptanceHourCard.reminderBody"),
    link: t("home.acceptanceHourCard.openGuide"),
    accessibilityLabel: t("home.acceptanceHourCard.openGuide"),
    onPress: () => router.push(ACCEPTANCE_HOUR_ROUTE as Href),
  };
}

/** Standalone banner (the goal card stacks reminders via `GoalReminderStack`). */
export function AcceptanceHourGoalReminder() {
  const reminder = useAcceptanceHourGoalReminder();
  if (!reminder) return null;
  const { id: _id, ...props } = reminder;
  return <GoalReminderBanner {...props} />;
}
