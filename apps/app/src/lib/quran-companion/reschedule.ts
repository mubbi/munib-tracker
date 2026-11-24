import { locationStore } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Rebuild local reminders after a practice change that moves the revision
 * reminder (§10): the toggle, a finished sitting, or "Not now". Otherwise a person
 * who finished today's revision at 08:00 would still be reminded at 09:00.
 *
 * The scheduler is loaded lazily: it imports the vault reminder options, which
 * read stores (wasiyyah, debts, …) that call back into this helper, so a static
 * import would close a require cycle.
 */
export function requestReminderReschedule(): void {
  void import("@/notifications/scheduler")
    .then(({ rescheduleAll }) =>
      rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location),
    )
    .catch(() => {
      // Non-fatal; the next foreground reschedule catches up.
    });
}
