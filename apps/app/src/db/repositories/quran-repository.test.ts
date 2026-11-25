import AsyncStorage from "@react-native-async-storage/async-storage";

import { DEFAULT_QURAN_PREFS, QuranRepository } from "./quran-repository";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("QuranRepository bookmarks", () => {
  it("isBookmarked follows toggleBookmark", async () => {
    await QuranRepository.toggleBookmark(2, 255);
    await expect(QuranRepository.isBookmarked(2, 255)).resolves.toBe(true);
    await expect(QuranRepository.isBookmarked(2, 256)).resolves.toBe(false);
  });

  it("toggling an existing bookmark removes it", async () => {
    await QuranRepository.toggleBookmark(2, 255);
    await expect(QuranRepository.toggleBookmark(2, 255)).resolves.toBe(false);
    await expect(QuranRepository.isBookmarked(2, 255)).resolves.toBe(false);
  });

  it("removeBookmark deletes it and bumps the watermark", async () => {
    await QuranRepository.toggleBookmark(1, 1);
    await QuranRepository.removeBookmark(1, 1);
    await expect(QuranRepository.getBookmarks()).resolves.toEqual([]);
    await expect(QuranRepository.getBookmarksUpdatedAt()).resolves.toEqual(expect.any(String));
  });

  it("restoreBookmark re-inserts the exact record and re-stamps the watermark", async () => {
    const original = { id: "qbm_old", surah: 2, ayah: 255, createdAt: "2026-01-01T00:00:00.000Z" };
    await QuranRepository.applyRemoteBookmarks([original]);
    await QuranRepository.removeBookmark(2, 255);
    const removedAt = await QuranRepository.getBookmarksUpdatedAt();
    await new Promise((r) => setTimeout(r, 5));
    await expect(QuranRepository.restoreBookmark(original)).resolves.toBe(true);
    await expect(QuranRepository.getBookmarks()).resolves.toEqual([original]);
    const restoredAt = await QuranRepository.getBookmarksUpdatedAt();
    expect((restoredAt ?? "") > (removedAt ?? "")).toBe(true);
  });

  it("restoreBookmark never overwrites an ayah re-bookmarked meanwhile", async () => {
    await QuranRepository.toggleBookmark(2, 255);
    const [current] = await QuranRepository.getBookmarks();
    await expect(
      QuranRepository.restoreBookmark({
        id: "qbm_old",
        surah: 2,
        ayah: 255,
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
    ).resolves.toBe(false);
    await expect(QuranRepository.getBookmarks()).resolves.toEqual([current]);
  });

  it("applyRemoteBookmarks without a watermark merges items only", async () => {
    await QuranRepository.applyRemoteBookmarks([
      { id: "r", surah: 3, ayah: 4, createdAt: "2026-01-01T00:00:00.000Z" },
    ]);
    expect((await QuranRepository.getBookmarks()).map((b) => b.id)).toEqual(["r"]);
    await expect(QuranRepository.getBookmarksUpdatedAt()).resolves.toBeUndefined();
  });
});

describe("QuranRepository last read", () => {
  it("applyRemoteLastRead keeps a newer local position", async () => {
    await QuranRepository.setLastRead(2, 5, 3);
    const local = await QuranRepository.getLastRead();
    await QuranRepository.applyRemoteLastRead({
      surah: 9,
      ayah: 1,
      updatedAt: "2000-01-01T00:00:00.000Z",
    });
    await expect(QuranRepository.getLastRead()).resolves.toEqual(local);
  });

  it("applyRemoteLastRead takes a newer remote position", async () => {
    const remote = { surah: 9, ayah: 1, updatedAt: "2999-01-01T00:00:00.000Z" };
    await QuranRepository.setLastRead(2, 5);
    await QuranRepository.applyRemoteLastRead(remote);
    await expect(QuranRepository.getLastRead()).resolves.toEqual(remote);
  });

  it("applyRemoteLastRead fills an empty device", async () => {
    await QuranRepository.applyRemoteLastRead({ surah: 1, ayah: 1 } as never);
    await expect(QuranRepository.getLastRead()).resolves.toMatchObject({ surah: 1 });
  });
});

describe("QuranRepository reading progress", () => {
  it("only moves the furthest ayah forward", async () => {
    await QuranRepository.recordProgress(18, 10);
    await QuranRepository.recordProgress(18, 4);
    expect((await QuranRepository.getReadingProgress())[18]?.furthestAyah).toBe(10);
  });
});

describe("QuranRepository clear", () => {
  it("wipes bookmarks, last read, progress and prefs", async () => {
    await QuranRepository.toggleBookmark(1, 1);
    await QuranRepository.setLastRead(1, 1);
    await QuranRepository.recordProgress(1, 1);
    await QuranRepository.updatePrefs({ readerLayout: "page" });

    await QuranRepository.clear();

    await expect(QuranRepository.getBookmarks()).resolves.toEqual([]);
    await expect(QuranRepository.getLastRead()).resolves.toBeNull();
    await expect(QuranRepository.getReadingProgress()).resolves.toEqual({});
    await expect(QuranRepository.getPrefs()).resolves.toEqual(DEFAULT_QURAN_PREFS);
  });
});
