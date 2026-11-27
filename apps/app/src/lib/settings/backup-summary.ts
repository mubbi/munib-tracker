import { DB_KEYS } from "@/db/keys";
import type { BackupFile } from "@/lib/backup";

/** Areas listed in the restore preview — the ones people recognise and count. */
export const BACKUP_SUMMARY_AREAS = [
  { id: "salahLogs", keys: [DB_KEYS.prayerLogs] },
  { id: "fasting", keys: [DB_KEYS.fasting, DB_KEYS.voluntaryFasting] },
  { id: "quranBookmarks", keys: [DB_KEYS.quranBookmarks] },
  { id: "hadithBookmarks", keys: [DB_KEYS.hadithBookmarks] },
  { id: "customTasbeeh", keys: [DB_KEYS.customTasbeeh] },
] as const;

export type BackupSummaryArea = (typeof BACKUP_SUMMARY_AREAS)[number]["id"];

export type BackupSummary = {
  /** ISO time the backup was made, or null when the file has none. */
  exportedAt: string | null;
  /** Non-empty areas with their item counts, in display order. */
  areas: { id: BackupSummaryArea; count: number }[];
  /** Recognised data sections in the file (all of them, not only the listed areas). */
  sections: number;
};

function itemCount(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object") return Object.keys(value).length;
  return value == null ? 0 : 1;
}

/** What a parsed backup contains — shown before the destructive restore confirm. */
export function summarizeBackup(file: BackupFile, sections: number): BackupSummary {
  const areas = BACKUP_SUMMARY_AREAS.map(({ id, keys }) => ({
    id,
    count: keys.reduce((sum, key) => sum + itemCount(file.data[key]), 0),
  })).filter((area) => area.count > 0);
  const exportedAt =
    typeof file.exportedAt === "string" && !Number.isNaN(Date.parse(file.exportedAt))
      ? file.exportedAt
      : null;
  return { exportedAt, areas, sections };
}
