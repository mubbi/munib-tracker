import { rescheduleAll } from "@/notifications/scheduler";
import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Rebuild local reminders after a practice change that moves the revision
 * reminder (§10): the toggle, a finished sitting, or "Not now". Otherwise a person
 * who finished today's revision at 08:00 would still be reminded at 09:00.
 */
export function requestReminderReschedule(): void {
  void rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location).catch(
    () => {
      // Non-fatal; the next foreground reschedule catches up.
    },
  );
}
