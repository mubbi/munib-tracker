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

import { ayahMapFromSpa5kPayload, fetchTafsirSurah, tafsirCacheEditionId } from "./quran-tafsir";

describe("quran-tafsir", () => {
  beforeEach(() => {
    clearStaticJsonCache();
    mockGet.mockReset();
    mockSet.mockReset();
    jest.restoreAllMocks();
  });

  it("namespaces cache edition ids", () => {
    expect(tafsirCacheEditionId("en-al-jalalayn")).toBe("tafsir:en-al-jalalayn");
    expect(tafsirCacheEditionId("tafsir:en-al-jalalayn")).toBe("tafsir:en-al-jalalayn");
  });

  it("parses spa5k ayahs[] payloads", () => {
    expect(
      ayahMapFromSpa5kPayload({
        ayahs: [
          { ayah: 1, surah: 1, text: "In the Name of God" },
          { ayah: 2, surah: 1, text: "  " },
          { ayah: 3, surah: 1, text: "Praise be to God" },
        ],
      }),
    ).toEqual({
      "1": "In the Name of God",
      "3": "Praise be to God",
    });
  });

  it("fetches spa5k surah JSON and caches under tafsir: prefix", async () => {
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue(undefined);
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        ayahs: [
          { ayah: 1, surah: 1, text: "In the Name of God the Compassionate the Merciful" },
          { ayah: 2, surah: 1, text: "Praise be to God" },
        ],
      }),
    } as Response);

    const result = await fetchTafsirSurah("en-al-jalalayn", 1);

    expect(result).toEqual({
      "1": "In the Name of God the Compassionate the Merciful",
      "2": "Praise be to God",
    });
    expect(mockGet).toHaveBeenCalledWith("tafsir:en-al-jalalayn", 1);
    expect(mockSet).toHaveBeenCalledWith("tafsir:en-al-jalalayn", 1, result);
    expect(String(globalThis.fetch).length).toBeGreaterThan(0);
    expect(jest.mocked(globalThis.fetch).mock.calls[0]?.[0]).toContain(
      "/tafsir/en-al-jalalayn/1.json",
    );
  });

  it("returns cache hits without fetching", async () => {
    mockGet.mockResolvedValue({ "1": "Cached tafsir" });
    jest.spyOn(globalThis, "fetch").mockImplementation(() => {
      throw new Error("network should not be called");
    });

    const result = await fetchTafsirSurah("en-al-jalalayn", 1);

    expect(result).toEqual({ "1": "Cached tafsir" });
    expect(mockGet).toHaveBeenCalledWith("tafsir:en-al-jalalayn", 1);
  });
});
