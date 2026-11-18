/**
 * In-memory `@/lib/native-file-store` (the expo-file-system wrapper):
 *
 *   jest.mock("@/lib/native-file-store", () => require("@/test-support/mocks/native-file-store").nativeFileStoreMock);
 *   import { mockNativeFiles, mockNativeFileStore, resetNativeFileStoreMock } from "@/test-support/mocks/native-file-store";
 *   beforeEach(resetNativeFileStoreMock);
 *
 * `mockNativeFiles` maps a URI to its entry; downloads succeed (status 200) and
 * write an entry unless `mockDownloadToUri` is overridden. Directories "exist"
 * while `mockNativeFileStore.directoriesExist` is true (an `Error` makes the
 * check throw).
 */

export type MockNativeFile = { size: number; md5?: string; text?: string; isDirectory?: boolean };

export const mockNativeFiles = new Map<string, MockNativeFile>();

export const mockNativeFileStore: {
  documentDir: string | null;
  cacheDir: string | null;
  directoriesExist: boolean | Error;
} = { documentDir: "file:///doc/", cacheDir: "file:///cache/", directoriesExist: true };

const defaultDownload = async (
  _remote: string,
  localUri: string,
  _headers?: Record<string, string>,
) => {
  mockNativeFiles.set(localUri, { size: 1 });
  return { uri: localUri, status: 200 };
};

export const mockDownloadToUri = jest.fn(defaultDownload);
/** Deletes a file, or a directory (URI ending in "/") with everything under it. */
export const mockDeletePath = jest.fn((uri: string) => {
  for (const key of [...mockNativeFiles.keys()]) {
    if (key === uri || (uri.endsWith("/") && key.startsWith(uri))) mockNativeFiles.delete(key);
  }
});
export const mockEnsureDirectory = jest.fn();

export function resetNativeFileStoreMock(): void {
  mockNativeFiles.clear();
  mockNativeFileStore.documentDir = "file:///doc/";
  mockNativeFileStore.cacheDir = "file:///cache/";
  mockNativeFileStore.directoriesExist = true;
  mockDownloadToUri.mockReset().mockImplementation(defaultDownload);
  mockDeletePath.mockClear();
  mockEnsureDirectory.mockClear();
}

export const nativeFileStoreMock = {
  __esModule: true,
  documentDirectoryUri: () => mockNativeFileStore.documentDir,
  cacheDirectoryUri: () => mockNativeFileStore.cacheDir,
  ensureDirectory: (uri: string) => mockEnsureDirectory(uri),
  directoryExists: () => {
    if (mockNativeFileStore.directoriesExist instanceof Error)
      throw mockNativeFileStore.directoriesExist;
    return mockNativeFileStore.directoriesExist;
  },
  fileInfo: (uri: string) => {
    const entry = mockNativeFiles.get(uri);
    return { exists: !!entry, size: entry?.size };
  },
  listDirectory: (dir: string) =>
    [...mockNativeFiles.entries()]
      .filter(([uri]) => uri.startsWith(dir))
      .map(([uri, entry]) => ({
        name: uri.slice(dir.length),
        uri,
        size: entry.size,
        isDirectory: !!entry.isDirectory,
      })),
  deletePath: (uri: string) => mockDeletePath(uri),
  moveFile: async (from: string, to: string) => {
    const entry = mockNativeFiles.get(from);
    if (entry) mockNativeFiles.set(to, entry);
    mockNativeFiles.delete(from);
  },
  httpStatusFromDownloadError: (error: unknown) => {
    const match = /HTTP (\d{3})/.exec(error instanceof Error ? error.message : String(error ?? ""));
    return match ? Number(match[1]) : undefined;
  },
  downloadToUri: (remote: string, local: string, headers?: Record<string, string>) =>
    mockDownloadToUri(remote, local, headers),
};
