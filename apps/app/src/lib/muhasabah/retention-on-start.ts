import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { getVaultStatus } from "@/lib/vault";

/**
 * Muhasabah retention "on app start" (NF-3.6, plan L1479): deletes entries
 * older than the user's `retentionDays` even when the home card is hidden and
 * the flow is never opened. Called from `AppProviders` inside `runWhenIdle`
 * (and lazily imported there, so the store stays out of the startup graph).
 *
 * Cheap no-op unless there is a muhasabah document AND the vault can open it on
 * this device (`ready`): a locked / unavailable vault is never prompted for.
 * Returns the number of entries deleted.
 */
export async function runMuhasabahRetentionOnStart(now: Date = new Date()): Promise<number> {
  try {
    if ((await readJSON<unknown>(DB_KEYS.vaultMuhasabah, null)) == null) return 0;
    if ((await getVaultStatus()).state !== "ready") return 0;
    const { muhasabahActions, muhasabahVault } = await import("./muhasabah-store");
    if (!muhasabahVault.store.getState().isReady) await muhasabahVault.actions.load();
    return await muhasabahActions.runRetention(now);
  } catch {
    // Retention retries on the next start / when the feature opens.
    return 0;
  }
}
