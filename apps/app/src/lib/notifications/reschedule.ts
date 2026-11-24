/**
 * The single entry point for "something changed — rebuild the local reminders".
 *
 * Every caller outside the notification lifecycle (settings writes, madhhab /
 * Hijri changes, excused periods, fasting, rawatib, …) goes through here, so the
 * prefs + location are always read from the stores at run time and a burst of
 * requests in the same tick collapses into one pass. `rescheduleAll` itself is
 * serialized, so a pass never overlaps another one.
 *
 * Every dependency is imported lazily: the scheduler imports the reminder-option
 * readers, which import feature stores that call back into this module, so a
 * static import here would close a require cycle (and pull the scheduler into
 * the startup graph of every store that reschedules).
 */

let queued: Promise<void> | null = null;

async function loadDeps() {
  const [{ rescheduleAll }, { preferencesStore }, { locationStore }] = await Promise.all([
    import("@/notifications/scheduler"),
    import("@/stores/preferences-store"),
    import("@/stores/location-store"),
  ]);
  return { rescheduleAll, preferencesStore, locationStore };
}

/**
 * Rebuilds reminders from the current preferences + location. Callers that fire
 * before the previous request has started share its pass. Rejects when the
 * pass fails — use {@link requestReminderReschedule} for fire-and-forget.
 */
export function rescheduleReminders(): Promise<void> {
  if (queued) return queued;
  const pass: Promise<void> = loadDeps().then(
    ({ rescheduleAll, preferencesStore, locationStore }) => {
      // From here on the stores are read, so a later request needs its own pass.
      if (queued === pass) queued = null;
      return rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
    },
  );
  queued = pass;
  pass.catch(() => {
    if (queued === pass) queued = null;
  });
  return pass;
}

/** Fire-and-forget {@link rescheduleReminders}; the next foreground pass catches up on failure. */
export function requestReminderReschedule(): void {
  rescheduleReminders().catch(() => {
    // Non-fatal (web / TV no-op, permission revoked, storage hiccup).
  });
}
