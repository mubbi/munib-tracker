import * as DocumentPicker from "expo-document-picker";

import type { SaveBackupResult } from "./backup-file-types";

export { backupFileName, type SaveBackupResult } from "./backup-file-types";

/** Web (P5-46): downloads the backup as a dated `.json` file. Nothing is uploaded. */
export async function saveBackupFile(
  text: string,
  fileName: string,
  _dialogTitle: string,
): Promise<SaveBackupResult> {
  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") {
    return "unavailable";
  }
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before freeing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return "saved";
}

/** Opens the browser file picker; resolves the chosen file's text, or null when cancelled. */
export async function pickBackupFileText(): Promise<string | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "text/plain", ".json"],
    multiple: false,
  });
  const asset = result.canceled ? undefined : result.assets?.[0];
  if (!asset) return null;
  if (asset.file) return asset.file.text();
  const response = await fetch(asset.uri);
  return response.text();
}
