import type { UserPreferences } from "@munib-tracker/shared/types";

/** True while a local preference write is not yet confirmed on the server. */
let preferencesDirty = false;

export function markPreferencesDirty(): void {
  preferencesDirty = true;
}

export function clearPreferencesDirty(): void {
  preferencesDirty = false;
}

export function hasPendingPreferenceChanges(): boolean {
  return preferencesDirty;
}

/**
 * Skip applying a cloud-synced preference field while a debounced or in-flight
 * local upsert is still pending (avoids reverting toggles mid-save).
 */
export function shouldApplyServerPreferenceField(hasPendingLocalChanges: boolean): boolean {
  return !hasPendingLocalChanges;
}

/** Strip locale fields from a remote preferences patch when local changes are pending. */
export function filterRemotePreferencesPatch(
  incoming: Partial<UserPreferences>,
  hasPendingLocalChanges: boolean,
): Partial<UserPreferences> {
  if (!hasPendingLocalChanges) return incoming;
  const patch = { ...incoming };
  // Delete (don't set `undefined`) so a later spread can't wipe locale back to
  // the English default via `withDefaults({ ...current, ...patch })`.
  delete patch.locale;
  delete patch.translationLocale;
  return patch;
}
