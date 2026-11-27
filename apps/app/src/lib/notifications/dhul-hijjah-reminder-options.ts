import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { sanitizeDhulHijjahStore } from "@/lib/dhul-hijjah";
import type { DhulHijjahReminderInput } from "@/lib/notifications/dhul-hijjah-reminders";

/** Dhul-Hijjah inputs for `buildReminders`, read from storage (the store is lazy at reschedule). */
export async function dhulHijjahReminderOptions(): Promise<DhulHijjahReminderInput> {
  try {
    const years = sanitizeDhulHijjahStore(await readJSON<unknown>(DB_KEYS.dhulHijjah, null));
    const intendsUdhiyahByYear: Record<string, boolean> = {};
    for (const [year, state] of Object.entries(years)) {
      intendsUdhiyahByYear[year] = state.intendsUdhiyah != null;
    }
    return { dhulHijjah: { intendsUdhiyahByYear } };
  } catch {
    return {};
  }
}
