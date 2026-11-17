import { DB_KEYS } from "@/db/keys";
import { QuranCompanionPrefsRepository } from "@/db/repositories/quran-companion-prefs-repository";
import { QuranMemorizationRepository } from "@/db/repositories/quran-memorization-repository";
import { readJSON } from "@/db/store";
import {
  type BuildRemindersOptions,
  SCHEDULE_DAYS_AHEAD,
} from "@/lib/notifications/build-reminders";

import { isPracticeAvailable } from "./availability";
import { dueCountsByDay } from "./due-queue";

/**
 * Revision-reminder inputs for `buildReminders` (§10). The practice stores are
 * lazy and usually not loaded when the app reschedules at launch, so this reads
 * the repositories directly instead of loading stores from `app-providers.tsx`.
 */
export async function quranRevisionReminderOptions(
  now = new Date(),
): Promise<Pick<BuildRemindersOptions, "revisionReminderEnabled" | "revisionDueByDay">> {
  if (!isPracticeAvailable()) return { revisionReminderEnabled: false };
  try {
    const prefs = await QuranCompanionPrefsRepository.get();
    if (!prefs.revisionReminder) return { revisionReminderEnabled: false };
    const [records, hifz] = await Promise.all([
      QuranMemorizationRepository.getAll(),
      readJSON<Record<string, "memorized" | "review">>(DB_KEYS.hifz, {}),
    ]);
    return {
      revisionReminderEnabled: true,
      revisionDueByDay: dueCountsByDay(
        { records, hifz, includeHifzReview: prefs.includeHifzReview },
        now,
        SCHEDULE_DAYS_AHEAD,
      ),
    };
  } catch {
    return { revisionReminderEnabled: false };
  }
}
