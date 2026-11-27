import type { UserPreferences } from "@munib-tracker/shared/types";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { getHomeMasjid, type HomeMasjidCache, resolveHomeIqamah } from "@/lib/masjid/home-masjid";
import {
  type IqamahReminderInput,
  iqamahRemindersActive,
} from "@/lib/notifications/iqamah-reminders";
import { readHomeMasjidTimes } from "@/stores/home-masjid-times-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Inputs for the NF-3.11 iqamah reminders. Read straight from storage (the
 * masjid stores are lazy and usually not loaded when the app reschedules).
 * Empty unless the user opted in and has a home masjid.
 */
export async function iqamahReminderOptions(
  prefs: UserPreferences = preferencesStore.getState().prefs,
): Promise<IqamahReminderInput> {
  try {
    if (!iqamahRemindersActive(prefs)) return {};
    const [times, cache] = await Promise.all([
      readHomeMasjidTimes(),
      readJSON<HomeMasjidCache | null>(DB_KEYS.homeMasjidCache, null),
    ]);
    return { iqamahTimetable: resolveHomeIqamah(getHomeMasjid(prefs), times, cache) };
  } catch {
    return {};
  }
}
