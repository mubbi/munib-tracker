import { DB_KEYS } from "@/db/keys";
import { QuranCompanionPrefsRepository } from "@/db/repositories/quran-companion-prefs-repository";
import { QuranMemorizationRepository } from "@/db/repositories/quran-memorization-repository";
import { readJSON } from "@/db/store";
import {
  type BuildRemindersOptions,
  SCHEDULE_DAYS_AHEAD,
} from "@/lib/notifications/build-reminders";
import { coachingDueByDay, sanitizeTajweedCoaching } from "@/lib/tajweed-coaching/progress";

import { isPracticeAvailable } from "./availability";
import { dueCountsByDay } from "./due-queue";

/**
 * Revision-reminder inputs for `buildReminders` (§10). The practice stores are
 * lazy and usually not loaded when the app reschedules at launch, so this reads
 * the repositories directly instead of loading stores from `app-providers.tsx`.
 */
export async function quranRevisionReminderOptions(
  now = new Date(),
): Promise<
  Pick<
    BuildRemindersOptions,
    "revisionReminderEnabled" | "revisionDueByDay" | "revisionTajweedDueByDay"
  >
> {
  if (!isPracticeAvailable()) return { revisionReminderEnabled: false };
  try {
    const prefs = await QuranCompanionPrefsRepository.get();
    if (!prefs.revisionReminder) return { revisionReminderEnabled: false };
    const [records, hifz, coaching] = await Promise.all([
      QuranMemorizationRepository.getAll(),
      readJSON<Record<string, "memorized" | "review">>(DB_KEYS.hifz, {}),
      prefs.tajweedInRevisionReminder === false
        ? Promise.resolve(null)
        : readJSON<unknown>(DB_KEYS.tajweedCoaching, null),
    ]);
    return {
      revisionReminderEnabled: true,
      revisionDueByDay: dueCountsByDay(
        { records, hifz, includeHifzReview: prefs.includeHifzReview },
        now,
        SCHEDULE_DAYS_AHEAD,
      ),
      // NF-3.15: days with a tajweed coaching item due (a line in the same reminder).
      ...(coaching != null
        ? {
            revisionTajweedDueByDay: coachingDueByDay(
              sanitizeTajweedCoaching(coaching),
              now,
              SCHEDULE_DAYS_AHEAD,
            ),
          }
        : {}),
    };
  } catch {
    return { revisionReminderEnabled: false };
  }
}
