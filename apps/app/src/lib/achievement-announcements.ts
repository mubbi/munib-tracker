/**
 * Process-wide "already celebrated" guard for achievement unlocks.
 *
 * Each mounted tracker screen keeps its own known-achievements ref, so two live
 * instances (e.g. `/mark-current` → `router.replace("/(tabs)/tracker")` while the
 * tab's tracker is still mounted) both saw the same unlock and posted the OS
 * notification twice. Claiming here makes the celebration fire once per unlock.
 *
 * An id is released again when it drops out of the synced set (the user un-marks
 * the Salah that earned it), so a genuine re-unlock is still celebrated.
 */
const announced = new Set<string>();

/** True the first time `id` is claimed; false while it is already announced. */
export function claimAchievementAnnouncement(id: string): boolean {
  if (announced.has(id)) return false;
  announced.add(id);
  return true;
}

/** Forget announced ids that are no longer unlocked. */
export function releaseLapsedAchievementAnnouncements(synced: readonly string[]): void {
  const current = new Set(synced);
  for (const id of announced) {
    if (!current.has(id)) announced.delete(id);
  }
}

/** Test-only: clear the guard between cases. */
export function resetAchievementAnnouncementsForTests(): void {
  announced.clear();
}
