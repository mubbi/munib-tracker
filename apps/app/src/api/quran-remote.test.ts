import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { clearStaticJsonCache } from "@/lib/static-json-fetch";

const mockGet =
  jest.fn<(editionId: string, surah: number) => Promise<Record<string, string> | null>>();
const mockSet =
  jest.fn<
    (
      editionId: string,
      surah: number,
      ayahText: Record<string, string>,
      persist?: boolean,
    ) => Promise<void>
  >();

jest.mock("@/db", () => ({
  QuranCacheRepository: {
    get: (...args: [string, number]) => mockGet(...args),
    set: (...args: [string, number, Record<string, string>, boolean?]) => mockSet(...args),
  },
}));

import { fetchRemoteEditionSurah, hasEditionAyahs } from "./quran-remote";

describe("quran-remote", () => {
  beforeEach(() => {
    clearStaticJsonCache();
    mockGet.mockReset();
    mockSet.mockReset();
    jest.restoreAllMocks();
  });

  it("hasEditionAyahs rejects empty or whitespace-only maps", () => {
    expect(hasEditionAyahs(null)).toBe(false);
    expect(hasEditionAyahs({})).toBe(false);
    expect(hasEditionAyahs({ "1": "   " })).toBe(false);
    expect(hasEditionAyahs({ "1": "In the Name of Allah" })).toBe(true);
  });

  it("parses fawaz chapter[] payloads and caches ayah text", async () => {
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue(undefined);
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        chapter: [
          { chapter: 1, verse: 1, text: "In the Name of Allah" },
          { chapter: 1, verse: 2, text: "All praise is for Allah" },
        ],
      }),
    } as Response);

    const result = await fetchRemoteEditionSurah("en-clearquran", 1);

    expect(result).toEqual({
      "1": "In the Name of Allah",
      "2": "All praise is for Allah",
    });
    expect(mockSet).toHaveBeenCalledWith("en-clearquran", 1, result);
  });

  it("refetches when the cache holds an empty map from a bad parse", async () => {
    mockGet.mockResolvedValue({});
    mockSet.mockResolvedValue(undefined);
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        chapter: [{ chapter: 1, verse: 1, text: "Saheeh text" }],
      }),
    } as Response);

    const result = await fetchRemoteEditionSurah("en-saheehintl", 1);

    expect(result).toEqual({ "1": "Saheeh text" });
    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it("still accepts legacy quran[] payloads", async () => {
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue(undefined);
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        quran: [{ verse: 1, text: "Legacy shape" }],
      }),
    } as Response);

    await expect(fetchRemoteEditionSurah("en-yusufali", 1)).resolves.toEqual({
      "1": "Legacy shape",
    });
  });
});
