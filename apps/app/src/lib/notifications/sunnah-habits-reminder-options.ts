import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import type { SunnahHabitsReminderInput } from "@/lib/notifications/sunnah-habits-reminders";
import { bedtimeHabitIds, sanitizeSunnahHabits } from "@/lib/sunnah-habits";

/** Habits inputs for `buildReminders`, read from storage (the store is lazy at reschedule time). */
export async function sunnahHabitsReminderOptions(): Promise<SunnahHabitsReminderInput> {
  try {
    const state = sanitizeSunnahHabits(await readJSON<unknown>(DB_KEYS.sunnahHabits, null));
    return {
      sunnahHabits: {
        selectedCount: state.selected.length,
        bedtimeHabitCount: bedtimeHabitIds(state).length,
      },
    };
  } catch {
    return {};
  }
}
