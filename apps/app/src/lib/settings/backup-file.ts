import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { cacheDirectoryUri, deletePath } from "@/lib/native-file-store";
import { isTV } from "@/lib/platform/is-tv";

import type { SaveBackupResult } from "./backup-file-types";

export { backupFileName, type SaveBackupResult } from "./backup-file-types";

function removeQuietly(uri: string): void {
  try {
    deletePath(uri);
  } catch {
    // already gone
  }
}

/**
 * Some Android share targets (Gmail, Drive) read the attachment only after the
 * share sheet has closed, so the plaintext copy outlives `shareAsync` for a
 * while (B-34). It is removed after this delay, or by the next save.
 */
export const BACKUP_FILE_CLEANUP_MS = 5 * 60 * 1000;

/** Shared backup copies still waiting for their delayed cleanup. */
const pendingCleanup = new Set<string>();

function cleanupPending(): void {
  for (const uri of pendingCleanup) removeQuietly(uri);
  pendingCleanup.clear();
}

function scheduleCleanup(uri: string): void {
  pendingCleanup.add(uri);
  setTimeout(() => {
    if (!pendingCleanup.delete(uri)) return;
    removeQuietly(uri);
  }, BACKUP_FILE_CLEANUP_MS);
}

/**
 * Native (P5-46): writes the backup JSON to a dated `.json` file in the cache
 * and opens the share sheet (Save to Files, Drive, send to yourself…). The
 * plaintext copy is deleted a few minutes after the sheet closes (or at once if
 * sharing fails). Throws when writing or sharing fails so the screen can show
 * an inline error.
 */
export async function saveBackupFile(
  text: string,
  fileName: string,
  dialogTitle: string,
): Promise<SaveBackupResult> {
  const dir = cacheDirectoryUri();
  if (isTV() || !dir || !(await Sharing.isAvailableAsync())) return "unavailable";
  const uri = `${dir}${fileName}`;
  cleanupPending();
  removeQuietly(uri);
  await new File(uri).write(text);
  try {
    await Sharing.shareAsync(uri, {
      mimeType: "application/json",
      UTI: "public.json",
      dialogTitle,
    });
  } catch (error) {
    removeQuietly(uri);
    throw error;
  }
  scheduleCleanup(uri);
  return "saved";
}

/** Lets the user pick a backup file; resolves its text, or null when cancelled. */
export async function pickBackupFileText(): Promise<string | null> {
  if (isTV()) return null;
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "text/plain", "*/*"],
    copyToCacheDirectory: true,
    multiple: false,
  });
  const asset = result.canceled ? undefined : result.assets?.[0];
  if (!asset) return null;
  try {
    return await new File(asset.uri).text();
  } finally {
    removeQuietly(asset.uri);
  }
}
