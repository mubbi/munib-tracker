import type { UserPreferences } from "@munib-tracker/shared/types";
import {
  getLocalDateString,
  rawatibNudgeCandidates,
  resolveRawatibConfig,
} from "@munib-tracker/shared/utils";

import { PrayerRepository } from "@/db";
import {
  type RawatibReminderInput,
  rawatibNudgeActive,
} from "@/lib/notifications/rawatib-reminders";
import { rescheduleReminders } from "@/lib/notifications/reschedule";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Inputs for the optional after-fard rawatib nudge (NF-3.1). `buildReminders`
 * turns them into one-off reminders, so they survive the foreground
 * `rescheduleAll` like every other reminder. Empty unless the user opted in.
 */
export async function rawatibNudgeOptions(
  prefs: UserPreferences = preferencesStore.getState().prefs,
  now = new Date(),
): Promise<RawatibReminderInput> {
  try {
    if (!rawatibNudgeActive(prefs)) return {};
    const date = getLocalDateString(now);
    const logs = await PrayerRepository.getByDate(date);
    const { ids } = resolveRawatibConfig(prefs);
    const rawatibNudges = rawatibNudgeCandidates(logs, ids, date).filter(
      (nudge) => nudge.fireAt.getTime() > now.getTime(),
    );
    return { rawatibNudges };
  } catch {
    return {};
  }
}

let pending: ReturnType<typeof setTimeout> | undefined;

/**
 * Rebuilds reminders shortly after a fard or an after-rawatib is logged — only
 * for users who turned the nudge on, so nobody else pays for the reschedule.
 */
export function requestRawatibNudgeReschedule(): void {
  if (!rawatibNudgeActive(preferencesStore.getState().prefs)) return;
  if (pending) clearTimeout(pending);
  pending = setTimeout(() => {
    pending = undefined;
    rescheduleReminders().catch(() => {
      /* best-effort; the next foreground reschedule catches up */
    });
  }, 1500);
}
