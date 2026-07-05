import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

/**
 * Local backup export/import (NF-1.20). Serializes the user's tracking + content
 * data (not caches) to a portable JSON string they can save anywhere, and
 * restores it — no account required. Caches (weather, remote editions, hadith
 * books, geocode) are intentionally excluded; they rebuild themselves.
 */

const BACKUP_VERSION = 1;

/** The DB keys included in a backup — user data only, never rebuildable caches. */
const BACKUP_KEYS: string[] = [
  DB_KEYS.prayerLogs,
  DB_KEYS.zikrProgress,
  DB_KEYS.qazaCounters,
  DB_KEYS.qazaDailyPlans,
  DB_KEYS.qazaSchedule,
  DB_KEYS.qazaDailyProgress,
  DB_KEYS.qazaRoza,
  DB_KEYS.userPreferences,
  DB_KEYS.location,
  DB_KEYS.achievements,
  DB_KEYS.quranBookmarks,
  DB_KEYS.quranLastRead,
  DB_KEYS.quranReadingProgress,
  DB_KEYS.quranPrefs,
  DB_KEYS.hadithBookmarks,
  DB_KEYS.continueActivity,
  DB_KEYS.duaFavorites,
  DB_KEYS.duroodFavorites,
  DB_KEYS.nameFavorites,
  DB_KEYS.customTasbeeh,
  DB_KEYS.fasting,
  DB_KEYS.duaFavoritesUpdatedAt,
  DB_KEYS.duroodFavoritesUpdatedAt,
  DB_KEYS.nameFavoritesUpdatedAt,
  DB_KEYS.quranBookmarksUpdatedAt,
  DB_KEYS.hadithBookmarksUpdatedAt,
  DB_KEYS.customTasbeehUpdatedAt,
];

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

/** Writes a validated backup's recognized keys back into storage. */
export async function applyBackup(file: BackupFile): Promise<void> {
  for (const key of BACKUP_KEYS) {
    if (key in file.data && file.data[key] != null) {
      await writeJSON(key, file.data[key]);
    }
  }
}
