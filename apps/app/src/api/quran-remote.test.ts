import { BUNDLED_QURAN_EDITION_IDS } from "@munib-tracker/shared/i18n";

import { QuranCacheRepository } from "@/db";
import { DB_KEYS } from "@/db/keys";
import * as ossReport from "@/lib/report-oss-content-download-failure";
import { clearStaticJsonCache } from "@/lib/static-json-fetch";
import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { storedKeysUnder } from "@/test-support/storage";

import {
  fetchRemoteEditionSurah,
  hasEditionAyahs,
  isRemoteEdition,
  REMOTE_EDITIONS,
} from "./quran-remote";

// jest.setup.ts preloads this module graph, so report through a spy, not jest.mock.
const report = jest
  .spyOn(ossReport, "reportOssContentDownloadFailure")
  .mockImplementation(() => {});

beforeEach(async () => {
  clearStaticJsonCache();
  await QuranCacheRepository.clear();
  report.mockClear();
});

describe("hasEditionAyahs", () => {
  it.each([
    [null, false],
    [{}, false],
    [{ "1": "   " }, false],
    [{ "1": "In the Name of Allah" }, true],
  ])("%j → %p", (input, expected) => {
    expect(hasEditionAyahs(input)).toBe(expected);
  });
});

describe("isRemoteEdition", () => {
  it("is true for a fetched translation", () => {
    expect(isRemoteEdition("en-clearquran")).toBe(true);
  });

  it("is false for a bundled edition and an unknown id", () => {
    const [bundled] = [...BUNDLED_QURAN_EDITION_IDS];
    expect(isRemoteEdition(bundled ?? "")).toBe(false);
    expect(isRemoteEdition("nope")).toBe(false);
  });

  it("exposes remote editions as not bundled", () => {
    expect(REMOTE_EDITIONS.length).toBeGreaterThan(0);
    expect(REMOTE_EDITIONS.every((e) => e.bundled === false)).toBe(true);
  });
});

describe("fetchRemoteEditionSurah", () => {
  it("parses fawaz chapter[] payloads and caches ayah text", async () => {
    const fetchMock = mockFetch(
      fakeResponse({ chapter: [{ verse: 1, text: "In the Name of Allah" }] }),
    );
    await expect(fetchRemoteEditionSurah("en-clearquran", 1)).resolves.toEqual({
      "1": "In the Name of Allah",
    });
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/editions\/[^/]+\/1\.json$/);
    await expect(QuranCacheRepository.get("en-clearquran", 1)).resolves.toEqual({
      "1": "In the Name of Allah",
    });
  });

  it("refetches when the cache holds an empty map from a bad parse", async () => {
    await QuranCacheRepository.set("en-saheehintl", 2, {});
    const fetchMock = mockFetch(fakeResponse({ chapter: [{ verse: 1, text: "Saheeh text" }] }));
    await expect(fetchRemoteEditionSurah("en-saheehintl", 2)).resolves.toEqual({
      "1": "Saheeh text",
    });
    expect(fetchMock).toHaveBeenCalled();
  });

  it("returns a cached surah without fetching", async () => {
    await QuranCacheRepository.set("en-yusufali", 3, { "1": "Cached" });
    const fetchMock = mockFetch(new Error("offline"));
    await expect(fetchRemoteEditionSurah("en-yusufali", 3)).resolves.toEqual({ "1": "Cached" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still accepts legacy quran[] payloads", async () => {
    mockFetch(fakeResponse({ quran: [{ verse: 1, text: "Legacy shape" }] }));
    await expect(fetchRemoteEditionSurah("en-yusufali", 4)).resolves.toEqual({
      "1": "Legacy shape",
    });
  });

  it("reports and rejects an unknown edition", async () => {
    await expect(fetchRemoteEditionSurah("nope", 1)).rejects.toThrow(
      "Unknown remote Qur'an edition: nope",
    );
    expect(report).toHaveBeenCalledWith(expect.objectContaining({ errorCode: "unknown_content" }));
  });

  it("reports and rejects an empty payload", async () => {
    mockFetch(fakeResponse({}));
    await expect(fetchRemoteEditionSurah("en-clearquran", 5)).rejects.toThrow(
      "Empty Qur'an edition payload for en-clearquran surah 5",
    );
    expect(report).toHaveBeenCalledWith(expect.objectContaining({ errorCode: "empty_payload" }));
  });
});

describe("fetchRemoteEditionSurah — cacheQuranEditionsLocally (B1)", () => {
  afterEach(resetPreferences);

  it("persists the surah to on-device storage by default", async () => {
    mockFetch(fakeResponse({ chapter: [{ verse: 1, text: "Kept" }] }));
    await fetchRemoteEditionSurah("en-clearquran", 6);
    expect(await storedKeysUnder(DB_KEYS.quranEditionCache)).toHaveLength(1);
  });

  it("keeps the surah for the session only when the toggle is off", async () => {
    await setPreferences({ cacheQuranEditionsLocally: false });
    mockFetch(fakeResponse({ chapter: [{ verse: 1, text: "Session only" }] }));
    await expect(fetchRemoteEditionSurah("en-clearquran", 7)).resolves.toEqual({
      "1": "Session only",
    });
    expect(await storedKeysUnder(DB_KEYS.quranEditionCache)).toEqual([]);

    const fetchMock = mockFetch(new Error("offline"));
    await expect(fetchRemoteEditionSurah("en-clearquran", 7)).resolves.toEqual({
      "1": "Session only",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
