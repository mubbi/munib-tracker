import { asVoluntaryFastingMap } from "@munib-tracker/shared/utils";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";

import type { VoluntaryFastingReminderInput } from "./reminders";

/**
 * Voluntary-fasting inputs for `buildReminders`. Read straight from storage:
 * the fasting store is lazy and usually not loaded when the app reschedules.
 */
export async function voluntaryFastingReminderOptions(): Promise<VoluntaryFastingReminderInput> {
  try {
    const raw = await readJSON<unknown>(DB_KEYS.voluntaryFasting, {});
    return { voluntaryFastingEntries: asVoluntaryFastingMap(raw) };
  } catch {
    return { voluntaryFastingEntries: {} };
  }
}
