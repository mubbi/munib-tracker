import type { SyncRecordDto } from "@munib-tracker/api-client";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { syncPush } from "@/api/endpoints";
import { SessionStore } from "@/auth/session-store";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { clearPreferencesDirty } from "@/lib/sync/preferences-cloud-sync";
import type { SyncMetadata } from "@/sync/sync-engine";

const PREFERENCES_DEBOUNCE_MS = 400;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function preferencesRecord(prefs: UserPreferences): SyncRecordDto {
  return {
    entity: "preferences",
    id: "preferences",
    data: { ...prefs },
    updatedAt: prefs.updatedAt ?? new Date().toISOString(),
  };
}

/**
 * Pushes the current preferences blob immediately (used before an RTL reload
 * so the new locale survives the native restart).
 */
export async function pushPreferencesNow(prefs: UserPreferences): Promise<boolean> {
  const session = await SessionStore.get();
  if (!session || session.accountType === "guest") return false;

  await syncPush(session.accessToken, [preferencesRecord(prefs)]);

  // Do NOT advance `lastPushedAt` here. That watermark gates the full delta push
  // in `runSync`; bumping it to "now" after a prefs-only write would skip any
  // tracking records whose `updatedAt` is older than this moment (prayer logs,
  // location, etc.) until they are edited again.
  const meta = await readJSON<SyncMetadata>(DB_KEYS.syncMetadata, {});
  await writeJSON<SyncMetadata>(DB_KEYS.syncMetadata, {
    ...meta,
    lastOutcomeAt: new Date().toISOString(),
  });

  return true;
}

/** Debounced cloud push for non-reload preference edits. */
export function schedulePreferencesCloudSync(prefs: UserPreferences): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void pushPreferencesNow(prefs)
      .then((pushed) => {
        if (pushed) clearPreferencesDirty();
      })
      .catch(() => {
        // Offline or blocked — a later foreground sync will retry.
      });
  }, PREFERENCES_DEBOUNCE_MS);
}

export function cancelScheduledPreferencesCloudSync(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
