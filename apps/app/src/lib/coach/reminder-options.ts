import { RAWATIB_PRAYER_SET } from "@munib-tracker/shared/constants";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";

import { PrayerRepository } from "@/db";
import { preferencesStore } from "@/stores/preferences-store";

import type { CoachReminderInput } from "./reminders";

/** Days of history that make a weekly reflection worth announcing. */
export const COACH_RECENT_DAYS = 14;

/**
 * `buildReminders` input for the weekly coach: only whether anything was
 * tracked recently (a boolean — no counts). Empty when the toggle is off.
 * Never throws.
 */
export async function coachReminderOptions(now: Date = new Date()): Promise<CoachReminderInput> {
  if (preferencesStore.getState().prefs.notificationPrefs.coach === false) return {};
  try {
    const since = addDays(getLocalDateString(now), -COACH_RECENT_DAYS);
    const logs = await PrayerRepository.getAll();
    const hasRecentActivity = logs.some(
      (log) =>
        log.date >= since && !RAWATIB_PRAYER_SET.has(log.prayerId) && log.status !== "pending",
    );
    return { coach: { hasRecentActivity } };
  } catch {
    return {};
  }
}
