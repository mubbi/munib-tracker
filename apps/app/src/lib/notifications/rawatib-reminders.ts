import type { UserPreferences } from "@munib-tracker/shared/types";
import { type RawatibNudge, resolveRawatibConfig } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { priorityForKind } from "@/lib/notifications/reminder-budget";

/**
 * After-fard rawatib nudge (NF-3.1, §11 tier 5 "rawatibNudge"): one gentle
 * one-off reminder ~10 min after a fard is marked when its after-rawatib is
 * still unlogged. Off by default (`notificationPrefs.rawatibNudge`), also off
 * when sunnah reminders are off, and paused by any excused period. Copy is
 * generic and never judges ("whenever you're ready").
 */

const PRIORITY_RAWATIB = priorityForKind("rawatibNudge", 40);
export const RAWATIB_NUDGE_ROUTE = "/tracker?focus=rawatib";

export interface RawatibReminderInput {
  /** Today's candidates (see `rawatibNudgeOptions`). */
  rawatibNudges?: RawatibNudge[];
}

/** True when the user opted in and nothing pauses nudges right now. */
export function rawatibNudgeActive(prefs: UserPreferences): boolean {
  const n = prefs.notificationPrefs;
  if (!n.masterEnabled || n.rawatibNudge !== true || n.sunnahPrayer === false) return false;
  if (prefs.activeExcusedReason != null) return false;
  return resolveRawatibConfig(prefs).enabled;
}

export function pushRawatibNudgeReminders(
  reminders: BuiltReminder[],
  prefs: UserPreferences,
  now: Date,
  options: RawatibReminderInput,
): void {
  if (!rawatibNudgeActive(prefs)) return;
  for (const nudge of options.rawatibNudges ?? []) {
    if (nudge.fireAt.getTime() <= now.getTime()) continue;
    reminders.push({
      id: `rawatib:${nudge.rawatib}`,
      fireAt: nudge.fireAt,
      title: i18n.t("rawatib.nudge.title"),
      body: i18n.t("rawatib.nudge.body", { prayer: i18n.t(`prayers.${nudge.parent}`) }),
      channelId: "prayer",
      repeat: "date",
      route: RAWATIB_NUDGE_ROUTE,
      priority: PRIORITY_RAWATIB,
    });
  }
}
