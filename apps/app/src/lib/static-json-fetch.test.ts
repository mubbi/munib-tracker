import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { clearStaticJsonCache, fetchStaticJson, staticJsonMirrorUrls } from "./static-json-fetch";

describe("fetchStaticJson", () => {
  beforeEach(() => {
    clearStaticJsonCache();
    jest.restoreAllMocks();
    // jest.setup installs `fetch` as a shared jest.fn — spyOn reuses it, so
    // reset its call history between tests.
    jest.clearAllMocks();
  });

  it("returns cached data without a second network call for the same URL", async () => {
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ chapter: [{ verse: 1, text: "Bismillah" }] }),
    } as Response);

    const url = "https://cdn.example.com/editions/eng-test/1.json";
    const first = await fetchStaticJson<{ chapter: Array<{ verse: number; text: string }> }>(url);
    const second = await fetchStaticJson(url);

    expect(first.chapter[0]?.text).toBe("Bismillah");
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("maps jsDelivr GitHub URLs to the GitHub raw mirror", () => {
    expect(
      staticJsonMirrorUrls(
        "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json",
      ),
    ).toEqual([
      "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-bukhari.min.json",
    ]);
    expect(
      staticJsonMirrorUrls(
        "https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/56.json",
      ),
    ).toEqual([
      "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/en-tafisr-ibn-kathir/56.json",
    ]);
    expect(staticJsonMirrorUrls("https://cdn.example.com/x.json")).toEqual([]);
  });

  it("falls back to GitHub raw when jsDelivr refuses the file (403 package size)", async () => {
    const url =
      "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-mustafakhattaba/1.json";
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 403 } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ chapter: [{ verse: 1, text: "In the Name of Allah" }] }),
      } as Response);

    const data = await fetchStaticJson<{ chapter: Array<{ text: string }> }>(url);
    expect(data.chapter[0]?.text).toBe("In the Name of Allah");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1]?.[0])).toBe(
      "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/eng-mustafakhattaba/1.json",
    );

    // Cached under the primary URL — no further network.
    await fetchStaticJson(url);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws the primary HTTP error when every mirror fails", async () => {
    const url =
      "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json";
    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 404 } as Response)
      .mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(fetchStaticJson(url)).rejects.toThrow(`HTTP 404 for ${url}`);
  });
});
