import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ossReport from "@/lib/report-oss-content-download-failure";
import { clearStaticJsonCache } from "@/lib/static-json-fetch";
import { preferencesStore } from "@/stores/preferences-store";
import { fakeResponse, mockFetchByUrl } from "@/test-support/fetch";

import {
  fetchRemoteCollection,
  getRemoteCollection,
  isRemoteCollection,
  REMOTE_COLLECTIONS,
} from "./hadith-remote";

// jest.setup.ts preloads this module graph, so report through a spy, not jest.mock.
const reportOssContentDownloadFailure = jest
  .spyOn(ossReport, "reportOssContentDownloadFailure")
  .mockImplementation(() => {});

const ENGLISH = {
  metadata: {
    sections: { "1": "Revelation", "2": "Belief", "3": "Unused" },
    section_details: {
      "2": { hadithnumber_first: 3, hadithnumber_last: 4 },
      "1": { hadithnumber_first: 1, hadithnumber_last: 2 },
      "3": { hadithnumber_first: 90, hadithnumber_last: 99 },
      "4": { hadithnumber_first: 50, hadithnumber_last: 60 },
    },
  },
  hadiths: [
    {
      hadithnumber: 1,
      text: " Actions are by intentions ",
      grades: [{ name: "Darussalam", grade: "Sahih" }],
    },
    { hadithnumber: 2, text: "   " },
    { hadithnumber: 3, text: "Islam is built on five", grades: [{ name: "x", grade: "" }] },
    { hadithnumber: 7, text: "Outside any section" },
  ],
};
const ARABIC = { hadiths: [{ hadithnumber: 1, text: " إنما الأعمال بالنيات " }] };
const URDU = { hadiths: [{ hadithnumber: 1, text: " اعمال کا دارومدار نیتوں پر ہے " }] };

/** Each test uses its own collection/locale so the session caches never collide. */
function setup(translationLocale: string, cacheHadithLocally = true) {
  preferencesStore.setState({
    prefs: { ...preferencesStore.getState().prefs, translationLocale, cacheHadithLocally } as never,
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  clearStaticJsonCache();
  reportOssContentDownloadFailure.mockClear();
});

describe("remote collection registry", () => {
  it("lists the six remote collections as not bundled", () => {
    expect(REMOTE_COLLECTIONS.map((c) => c.id)).toEqual([
      "bukhari",
      "muslim",
      "abudawud",
      "tirmidhi",
      "nasai",
      "ibnmajah",
    ]);
    expect(REMOTE_COLLECTIONS.every((c) => c.bundled === false)).toBe(true);
  });

  it.each([
    ["muslim", true],
    ["nawawi", false],
  ])("isRemoteCollection(%p) is %p", (id, expected) => {
    expect(isRemoteCollection(id)).toBe(expected);
    expect(Boolean(getRemoteCollection(id))).toBe(expected);
  });
});

describe("fetchRemoteCollection", () => {
  it("merges English, Arabic and grades into sectioned items", async () => {
    setup("en");
    const fetchMock = mockFetchByUrl({
      "eng-bukhari": fakeResponse(ENGLISH),
      "ara-bukhari": fakeResponse(ARABIC),
    });

    const data = await fetchRemoteCollection("bukhari");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(data.sections).toEqual([
      { id: "1", name: "Revelation", count: 1 },
      { id: "2", name: "Belief", count: 1 },
    ]);
    expect(data.items.map((i) => i.id)).toEqual(["bukhari:1", "bukhari:3", "bukhari:7"]);
    expect(data.items[0]).toEqual({
      id: "bukhari:1",
      collection: "bukhari",
      number: "1",
      arabic: "إنما الأعمال بالنيات",
      english: "Actions are by intentions",
      reference: "Sahih al-Bukhari 1",
      book: "Revelation",
      chapterId: "1",
      grade: "Sahih",
      gradedBy: "Darussalam",
    });
    expect(data.items[1]).not.toHaveProperty("grade");
    expect(data.items[2]).not.toHaveProperty("book");
  });

  it("adds the reader's translation edition when one exists", async () => {
    setup("ur");
    const fetchMock = mockFetchByUrl({
      "eng-muslim": fakeResponse(ENGLISH),
      "ara-muslim": fakeResponse(ARABIC),
      "urd-muslim": fakeResponse(URDU),
    });

    const data = await fetchRemoteCollection("muslim");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(data.items[0]?.translations).toEqual({ ur: "اعمال کا دارومدار نیتوں پر ہے" });
    expect(data.items[1]?.translations).toBeUndefined();
  });

  it("serves a repeat request from the cache", async () => {
    setup("en");
    mockFetchByUrl({ "eng-nasai": fakeResponse(ENGLISH), "ara-nasai": fakeResponse(ARABIC) });
    const first = await fetchRemoteCollection("nasai");

    const fetchMock = mockFetchByUrl({});
    await expect(fetchRemoteCollection("nasai")).resolves.toBe(first);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps the collection off disk when local hadith caching is off", async () => {
    setup("fr", false);
    mockFetchByUrl({
      "eng-ibnmajah": fakeResponse({ hadiths: ENGLISH.hadiths }),
      "ara-ibnmajah": fakeResponse(ARABIC),
      "fra-ibnmajah": fakeResponse({ hadiths: [] }),
    });

    const data = await fetchRemoteCollection("ibnmajah");

    expect(data.sections).toEqual([]);
    expect(data.items[0]?.arabic).toBe("إنما الأعمال بالنيات");
    const keys = await AsyncStorage.getAllKeys();
    expect(keys.some((k) => k.includes("ibnmajah"))).toBe(false);
  });

  it("reports and rejects an unknown collection", async () => {
    setup("en");
    await expect(fetchRemoteCollection("unknown")).rejects.toThrow("Unknown collection: unknown");
    expect(reportOssContentDownloadFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: "unknown_content",
        contentKey: "hadith_collection:unknown:en",
      }),
    );
  });

  it("reports and rejects an empty payload", async () => {
    setup("en");
    mockFetchByUrl({
      "eng-tirmidhi": fakeResponse({ hadiths: [{ hadithnumber: 1, text: "" }] }),
      "ara-tirmidhi": fakeResponse({ hadiths: [] }),
    });
    await expect(fetchRemoteCollection("tirmidhi")).rejects.toThrow(
      "Empty hadith collection payload for tirmidhi",
    );
    expect(reportOssContentDownloadFailure).toHaveBeenCalledWith(
      expect.objectContaining({ errorCode: "empty_payload" }),
    );
  });

  it("rejects when an edition download fails", async () => {
    setup("tr");
    mockFetchByUrl({ "ara-abudawud": fakeResponse(ARABIC) });
    await expect(fetchRemoteCollection("abudawud")).rejects.toThrow("HTTP 404");
  });
});
