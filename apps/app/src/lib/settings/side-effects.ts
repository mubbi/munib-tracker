import { rescheduleReminders } from "@/lib/notifications/reschedule";

import type { SettingSideEffect } from "./types";

export { rescheduleReminders };

/**
 * Run a setting's declared side effects once after its write. Prayer times are
 * derived live from the location store, so "refresh-prayer-times" only needs the
 * reminders rebuilt; "reload-locale" is applied inside `setLocale` itself.
 */
export async function runSideEffects(effects: readonly SettingSideEffect[] | undefined) {
  if (!effects || effects.length === 0) return;
  if (effects.includes("reschedule-reminders") || effects.includes("refresh-prayer-times")) {
    try {
      await rescheduleReminders();
    } catch {
      // Scheduling failures are non-fatal for a settings write (web / TV no-op).
    }
  }
}
