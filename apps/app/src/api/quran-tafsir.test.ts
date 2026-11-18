import { QuranCacheRepository } from "@/db";
import * as ossReport from "@/lib/report-oss-content-download-failure";
import { clearStaticJsonCache } from "@/lib/static-json-fetch";
import { fakeResponse, mockFetch, mockFetchByUrl } from "@/test-support/fetch";

import {
  ayahMapFromSpa5kPayload,
  fetchTafsirAyah,
  fetchTafsirSurah,
  tafsirCacheEditionId,
} from "./quran-tafsir";

const SPA5K = "en-al-jalalayn";
const FAWAZ = "ar-tafsir-siraj";

// jest.setup.ts preloads this module graph, so report through a spy, not jest.mock.
const report = jest
  .spyOn(ossReport, "reportOssContentDownloadFailure")
  .mockImplementation(() => {});

beforeEach(async () => {
  clearStaticJsonCache();
  await QuranCacheRepository.clear();
  report.mockClear();
});

describe("tafsirCacheEditionId", () => {
  it.each([
    [SPA5K, `tafsir:${SPA5K}`],
    [`tafsir:${SPA5K}`, `tafsir:${SPA5K}`],
  ])("namespaces %p as %p", (input, expected) => {
    expect(tafsirCacheEditionId(input)).toBe(expected);
  });
});

describe("ayahMapFromSpa5kPayload", () => {
  it("parses an ayahs[] payload and drops blank text", () => {
    expect(
      ayahMapFromSpa5kPayload({
        ayahs: [
          { ayah: 1, surah: 1, text: " In the Name of God " },
          { ayah: 2, surah: 1, text: "  " },
        ],
      }),
    ).toEqual({ "1": "In the Name of God" });
  });

  it("accepts a bare array keyed by verse and skips unnumbered rows", () => {
    expect(ayahMapFromSpa5kPayload([{ verse: 4, text: "x" }, { text: "y" }, { verse: 5 }])).toEqual(
      { "4": "x" },
    );
  });

  it("treats a payload without ayahs as empty", () => {
    expect(ayahMapFromSpa5kPayload({})).toEqual({});
  });
});

describe("fetchTafsirSurah", () => {
  it("fetches a spa5k surah and caches it under the tafsir: prefix", async () => {
    const fetchMock = mockFetch(fakeResponse({ ayahs: [{ ayah: 1, text: "Praise" }] }));
    await expect(fetchTafsirSurah(SPA5K, 1)).resolves.toEqual({ "1": "Praise" });
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-al-jalalayn/1.json",
    );
    await expect(QuranCacheRepository.get(`tafsir:${SPA5K}`, 1)).resolves.toEqual({
      "1": "Praise",
    });
  });

  it("fetches a fawaz edition from the chapter list", async () => {
    const fetchMock = mockFetch(
      fakeResponse({
        chapter: [
          { verse: 1, text: "بسم" },
          { verse: 2, text: " " },
        ],
      }),
    );
    await expect(fetchTafsirSurah(FAWAZ, 2)).resolves.toEqual({ "1": "بسم" });
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/editions/ara-sirajtafseer/2.json");
  });

  it("reads the fawaz quran list when chapter is absent", async () => {
    mockFetch(fakeResponse({ quran: [{ verse: 3, text: "نص" }] }));
    await expect(fetchTafsirSurah(FAWAZ, 3)).resolves.toEqual({ "3": "نص" });
  });

  it("returns cache hits without fetching", async () => {
    await QuranCacheRepository.set(`tafsir:${SPA5K}`, 4, { "1": "Cached tafsir" });
    const fetchMock = mockFetch(new Error("offline"));
    await expect(fetchTafsirSurah(SPA5K, 4)).resolves.toEqual({ "1": "Cached tafsir" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports and rejects an unknown edition", async () => {
    await expect(fetchTafsirSurah("nope", 1)).rejects.toThrow("Unknown tafsir edition: nope");
    expect(report).toHaveBeenCalledWith(expect.objectContaining({ errorCode: "unknown_content" }));
  });

  it.each([
    ["spa5k", SPA5K, { ayahs: [] }],
    ["fawaz", FAWAZ, {}],
  ])("reports and rejects an empty %s payload", async (_label, edition, body) => {
    mockFetch(fakeResponse(body));
    await expect(fetchTafsirSurah(edition, 5)).rejects.toThrow("Empty tafsir payload");
    expect(report).toHaveBeenCalledWith(expect.objectContaining({ errorCode: "empty_payload" }));
  });
});

describe("fetchTafsirAyah", () => {
  it("answers from the surah map", async () => {
    mockFetch(fakeResponse({ ayahs: [{ ayah: 1, text: "One" }] }));
    await expect(fetchTafsirAyah(SPA5K, 6, 1)).resolves.toBe("One");
  });

  it("falls back to the spa5k single-ayah endpoint", async () => {
    mockFetchByUrl({
      "/7/2.json": fakeResponse({ text: " Two " }),
      "/7.json": fakeResponse({ ayahs: [{ ayah: 1, text: "One" }] }),
    });
    await expect(fetchTafsirAyah(SPA5K, 7, 2)).resolves.toBe("Two");
  });

  it.each([
    ["is blank", fakeResponse({ text: " " })],
    ["fails", new Error("offline")],
  ])("returns null when the single-ayah fallback %s", async (_label, reply) => {
    mockFetchByUrl({
      "/8/2.json": reply,
      "/8.json": fakeResponse({ ayahs: [{ ayah: 1, text: "One" }] }),
    });
    await expect(fetchTafsirAyah(SPA5K, 8, 2)).resolves.toBeNull();
  });

  it("has no single-ayah fallback for fawaz editions", async () => {
    mockFetch(fakeResponse({ chapter: [{ verse: 1, text: "واحد" }] }));
    await expect(fetchTafsirAyah(FAWAZ, 9, 2)).resolves.toBeNull();
  });
});
