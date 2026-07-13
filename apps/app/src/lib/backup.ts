import { BACKUP_KEYS, DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, writeJSON } from "@/db/store";

/**
 * Local backup export/import (NF-1.20). Serializes the user's tracking + content
 * data (not caches) to a portable JSON string they can save anywhere, and
 * restores it — no account required. The exact key set is {@link BACKUP_KEYS},
 * derived centrally from the key classification in `db/keys.ts`, so every
 * user-data key is captured and rebuildable caches (weather, remote editions,
 * hadith books, geocode) and device-local bookkeeping are excluded automatically.
 */

const BACKUP_VERSION = 1;

export interface BackupFile {
  app: "munib-tracker";
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

/** Serializes the user's data into a portable backup JSON string. */
export async function exportBackup(nowIso: string = new Date().toISOString()): Promise<string> {
  const data: Record<string, unknown> = {};
  for (const key of BACKUP_KEYS) {
    const value = await readJSON<unknown>(key, null);
    if (value != null) data[key] = value;
  }
  const file: BackupFile = {
    app: "munib-tracker",
    version: BACKUP_VERSION,
    exportedAt: nowIso,
    data,
  };
  return JSON.stringify(file);
}

export type BackupParseResult =
  | { ok: true; file: BackupFile; entries: number }
  | { ok: false; error: "invalid_json" | "wrong_format" | "unsupported_version" };

/** Validates a pasted backup string without writing anything. */
export function parseBackup(text: string): BackupParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    return { ok: false, error: "invalid_json" };
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    (parsed as BackupFile).app !== "munib-tracker" ||
    typeof (parsed as BackupFile).data !== "object" ||
    (parsed as BackupFile).data === null
  ) {
    return { ok: false, error: "wrong_format" };
  }
  const file = parsed as BackupFile;
  if (typeof file.version !== "number" || file.version > BACKUP_VERSION) {
    return { ok: false, error: "unsupported_version" };
  }
  // Only restore keys we recognize, so a tampered file can't write arbitrary keys.
  const entries = Object.keys(file.data).filter((key) => BACKUP_KEYS.includes(key)).length;
  return { ok: true, file, entries };
}

/**
 * Writes a validated backup's recognized keys back into storage as a full
 * replace of {@link BACKUP_KEYS}: values present in the file overwrite local
 * data, and any backed-up key absent (or null) in the file is removed so stale
 * local rows cannot survive a restore.
 */
export async function applyBackup(file: BackupFile): Promise<void> {
  await Promise.all(
    BACKUP_KEYS.map(async (key) => {
      if (key in file.data && file.data[key] != null) {
        await writeJSON(key, file.data[key]);
      } else {
        await removeKey(key);
      }
    }),
  );
}

/**
 * After restoring a backup the local dataset is replaced wholesale, so the
 * device-local sync cursors are stale and would silently drop the restored data
 * from the next cloud sync: the delta-push watermark (`syncMetadata.lastPushedAt`)
 * skips records whose own `updatedAt` predates it, and the blob content
 * fingerprints (`blobSyncState`) no longer describe what's on disk. Clearing both
 * forces the next sync to re-offer the restored data to the server and re-pull,
 * reconciling everything by last-write-wins. A no-op for guests (who never sync)
 * — the keys are simply absent.
 */
export async function invalidateSyncStateAfterRestore(): Promise<void> {
  await Promise.all([removeKey(DB_KEYS.syncMetadata), removeKey(DB_KEYS.blobSyncState)]);
}
