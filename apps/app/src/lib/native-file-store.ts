import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";

/**
 * Thin helpers over the class-based `expo-file-system` API (`File` / `Directory`
 * / `Paths`) that keep the on-disk layout and URI strings identical to the old
 * legacy-API (`documentDirectory`/`downloadAsync`) code, so caches written by earlier app versions are
 * still found after the upgrade.
 *
 * - {@link documentDirectoryUri} / {@link cacheDirectoryUri} return the same
 *   `file:///…/` string (trailing slash included) that legacy
 *   `documentDirectory` / `cacheDirectory` exposed — both read the same native
 *   constant. Callers keep building paths by string concatenation.
 * - {@link downloadToUri} reproduces legacy `downloadAsync` semantics: it
 *   overwrites the destination and *resolves* with the HTTP status on a non-2xx
 *   response instead of rejecting, so existing status handling keeps working.
 */

function withTrailingSlash(uri: string): string {
  return uri.endsWith("/") ? uri : `${uri}/`;
}

let documentDir: string | null = null;
let cacheDir: string | null = null;

function readBaseDirectory(read: () => Directory): string | null {
  // Web has no file system (the module only warns and returns empty paths).
  if (Platform.OS === "web") return null;
  try {
    const uri = read().uri;
    return uri ? withTrailingSlash(uri) : null;
  } catch {
    return null;
  }
}

/** Persistent app documents directory (`file:///…/`), or null when unavailable / on web. */
export function documentDirectoryUri(): string | null {
  if (documentDir == null) documentDir = readBaseDirectory(() => Paths.document);
  return documentDir;
}

/** OS-evictable cache directory (`file:///…/`), or null when unavailable / on web. */
export function cacheDirectoryUri(): string | null {
  if (cacheDir == null) cacheDir = readBaseDirectory(() => Paths.cache);
  return cacheDir;
}

/** Legacy `getInfoAsync` for a file: `{ exists, size }` (size undefined when missing). */
export function fileInfo(uri: string): { exists: boolean; size?: number } {
  const info = new File(uri).info();
  return { exists: info.exists, size: info.size };
}

/** Whether a directory exists at `uri`. */
export function directoryExists(uri: string): boolean {
  return new Directory(uri).exists;
}

/** Legacy `makeDirectoryAsync(uri, { intermediates: true })` — no-op when present. */
export function ensureDirectory(uri: string): void {
  const dir = new Directory(uri);
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
}

/** One directory entry: its name, full URI, size in bytes (null if unknown) and kind. */
export type DirectoryEntry = {
  name: string;
  uri: string;
  size: number | null;
  isDirectory: boolean;
};

/** Legacy `readDirectoryAsync` + per-entry `getInfoAsync`, in one pass. */
export function listDirectory(uri: string): DirectoryEntry[] {
  return new Directory(uri).list().map((entry) => ({
    name: entry.name,
    uri: entry.uri,
    size: typeof entry.size === "number" ? entry.size : null,
    isDirectory: entry instanceof Directory,
  }));
}

/**
 * Legacy `deleteAsync(uri, { idempotent: true })`: removes a file or a whole
 * directory tree, and does nothing when nothing exists at `uri`.
 */
export function deletePath(uri: string): void {
  const info = Paths.info(uri);
  if (!info.exists) return;
  if (info.isDirectory) new Directory(uri).delete();
  else new File(uri).delete();
}

/** Legacy `moveAsync({ from, to })` for a file. */
export async function moveFile(from: string, to: string): Promise<void> {
  await new File(from).move(new File(to));
}

/**
 * Pull the HTTP status out of an `UnableToDownload` rejection. The native
 * messages are "response has status: 404" (Android), "response has status 404"
 * (iOS) and "HTTP 404" / "server returned HTTP 404" (download tasks).
 */
export function httpStatusFromDownloadError(error: unknown): number | undefined {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const match = /(?:status:?|HTTP)\s*(\d{3})\b/i.exec(message);
  return match ? Number(match[1]) : undefined;
}

/**
 * Download `remoteUri` to the file at `localUri` (parent directory must exist),
 * overwriting any existing file. Resolves `{ uri: localUri, status }` like legacy
 * `downloadAsync`: `status` is 200 on success (the new API does not expose the
 * exact 2xx code) or the server's status on an HTTP error. Network failures
 * still reject. `uri` is always the caller's `localUri` string so cache-hit and
 * fresh-download paths return the same URI form.
 */
export async function downloadToUri(
  remoteUri: string,
  localUri: string,
  headers?: Record<string, string>,
): Promise<{ uri: string; status: number }> {
  try {
    await File.downloadFileAsync(remoteUri, new File(localUri), {
      idempotent: true,
      ...(headers ? { headers } : {}),
    });
    return { uri: localUri, status: 200 };
  } catch (error) {
    const status = httpStatusFromDownloadError(error);
    if (status != null) return { uri: localUri, status };
    throw error;
  }
}
