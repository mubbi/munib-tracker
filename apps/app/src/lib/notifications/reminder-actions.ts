import { OBLIGATORY_PRAYER_SET } from "@munib-tracker/shared/constants";
import type { ObligatoryPrayer } from "@munib-tracker/shared/types";

import type { ExternalCommand } from "@/lib/external-commands/types";

/**
 * Notification actions shared by the native (`notifications/scheduler.ts`) and web
 * (`scheduler.web.ts`) schedulers, so both platforms speak the same ids.
 */

/**
 * Category for obligatory prayer-time-now reminders only — Mark + Snooze.
 * Prep / zikr / qaza nudges omit it so they don't offer a premature Mark.
 * https://developer.apple.com/documentation/usernotifications/declaring-your-actionable-notification-types
 */
export const PRAYER_NOW_CATEGORY = "prayer_now";
/** Mark is listed first so Apple Watch Double Tap invokes the nondestructive Mark action. */
export const MARK_ACTION_IDENTIFIER = "markcurrent";
export const SNOOZE_ACTION_IDENTIFIER = "snooze";
export const SNOOZE_MINUTES = 10;
/** Identifier prefix of a snoozed reminder (kept across reschedule passes). */
export const SNOOZE_ID_PREFIX = "snooze:";

/** The `data` a prayer-time reminder carries for its Mark action. */
export type ReminderActionData = {
  prayerId?: string;
  prayerDate?: string;
};

export function isObligatoryPrayerId(id: string | undefined): id is ObligatoryPrayer {
  return id != null && OBLIGATORY_PRAYER_SET.has(id);
}

/**
 * The command a notification's Mark action enqueues: the named Salah when the
 * reminder carried `prayerId` + `prayerDate`, otherwise "mark the current fard".
 */
export function markCommandFromReminderData(
  data: ReminderActionData | null | undefined,
): ExternalCommand {
  const prayerId = data?.prayerId;
  const prayerDate = data?.prayerDate;
  if (prayerDate && isObligatoryPrayerId(prayerId)) {
    return { type: "mark-prayer", prayerId, date: prayerDate, source: "notification" };
  }
  return { type: "mark-current-obligatory", source: "notification" };
}
