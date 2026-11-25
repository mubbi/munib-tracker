import * as Sharing from "expo-sharing";

import { deletePath } from "@/lib/native-file-store";

import { BACKUP_FILE_CLEANUP_MS, saveBackupFile } from "./backup-file";

jest.mock("expo-file-system", () => ({
  File: jest.fn().mockImplementation(() => ({ write: jest.fn(async () => undefined) })),
}));
jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));
jest.mock("expo-document-picker", () => ({ getDocumentAsync: jest.fn() }));
jest.mock("@/lib/native-file-store", () => ({
  cacheDirectoryUri: () => "file:///cache/",
  deletePath: jest.fn(),
}));
jest.mock("@/lib/platform/is-tv", () => ({ isTV: () => false }));

const removed = () => (deletePath as jest.Mock).mock.calls.map(([uri]) => uri);

beforeEach(() => {
  jest.useFakeTimers();
  (deletePath as jest.Mock).mockClear();
});
afterEach(() => jest.useRealTimers());

describe("saveBackupFile (B-34)", () => {
  it("keeps the shared file for share targets that read it later, then deletes it", async () => {
    await expect(saveBackupFile("{}", "backup-a.json", "Save")).resolves.toBe("saved");
    // Only the pre-write clean slate — the shared copy survives the sheet closing.
    expect(removed()).toEqual(["file:///cache/backup-a.json"]);
    jest.advanceTimersByTime(BACKUP_FILE_CLEANUP_MS);
    expect(removed()).toEqual(["file:///cache/backup-a.json", "file:///cache/backup-a.json"]);
  });

  it("the next save removes a copy still waiting for cleanup", async () => {
    await saveBackupFile("{}", "backup-a.json", "Save");
    await saveBackupFile("{}", "backup-b.json", "Save");
    expect(removed()).toContain("file:///cache/backup-a.json");
    (deletePath as jest.Mock).mockClear();
    jest.advanceTimersByTime(BACKUP_FILE_CLEANUP_MS);
    // a was already cleaned; only b's timer still deletes.
    expect(removed()).toEqual(["file:///cache/backup-b.json"]);
  });

  it("deletes the file at once when sharing fails", async () => {
    (Sharing.shareAsync as jest.Mock).mockRejectedValueOnce(new Error("share failed"));
    await expect(saveBackupFile("{}", "backup-c.json", "Save")).rejects.toThrow("share failed");
    expect(removed()).toEqual(["file:///cache/backup-c.json", "file:///cache/backup-c.json"]);
  });
});
