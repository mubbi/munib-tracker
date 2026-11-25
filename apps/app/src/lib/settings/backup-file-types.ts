/** Outcome of handing a backup to the OS (share sheet / browser download). */
export type SaveBackupResult = "saved" | "unavailable";

/** `munib-tracker-backup-2026-11-25.json` — dated so several backups sort by day. */
export function backupFileName(nowIso: string): string {
  return `munib-tracker-backup-${nowIso.slice(0, 10)}.json`;
}
