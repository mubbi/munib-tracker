import { fetchSurahTajweed, parseTajweedMarkup } from "@/api/quran-tajweed";
import { QuranStudyCacheRepository } from "@/db";
import * as ossReport from "@/lib/report-oss-content-download-failure";
import { clearStaticJsonCache } from "@/lib/static-json-fetch";
import { fakeResponse, mockFetch } from "@/test-support/fetch";

// jest.setup.ts preloads this module graph, so report through a spy, not jest.mock.
const report = jest
  .spyOn(ossReport, "reportOssContentDownloadFailure")
  .mockImplementation(() => {});

beforeEach(async () => {
  clearStaticJsonCache();
  await QuranStudyCacheRepository.clear();
  report.mockClear();
});

describe("parseTajweedMarkup", () => {
  it("parses live alquran.cloud single-bracket markup", () => {
    const raw = "بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ";
    const segments = parseTajweedMarkup(raw);
    expect(segments).toEqual([
      { text: "بِسْمِ " },
      { text: "ٱ", rule: "ham_wasl" },
      { text: "للَّهِ " },
      { text: "ٱ", rule: "ham_wasl" },
      { text: "ل", rule: "laam_shamsiyah" },
      { text: "رَّحْمَ" },
      { text: "ـٰ", rule: "madda_normal" },
      { text: "نِ " },
      { text: "ٱ", rule: "ham_wasl" },
      { text: "ل", rule: "laam_shamsiyah" },
      { text: "رَّح" },
      { text: "ِي", rule: "madda_necessary" },
      { text: "مِ" },
    ]);
  });

  it("also accepts double-closing-bracket samples", () => {
    const segments = parseTajweedMarkup("[h:1[ٱ]][l[ل]][n[ل]]هِ");
    expect(segments).toEqual([
      { text: "ٱ", rule: "ham_wasl" },
      { text: "ل", rule: "laam_shamsiyah" },
      { text: "ل", rule: "madda_normal" },
      { text: "هِ" },
    ]);
  });

  it("returns plain text when markup has no tags", () => {
    expect(parseTajweedMarkup("بِسْمِ")).toEqual([{ text: "بِسْمِ" }]);
  });
});

describe("parseTajweedMarkup unknown rules", () => {
  it("keeps the text of an unrecognised rule letter without a rule", () => {
    expect(parseTajweedMarkup("[z[ب]")).toEqual([{ text: "ب" }]);
  });
});

describe("fetchSurahTajweed", () => {
  it("fetches the tajweed edition and parses each ayah", async () => {
    const fetchMock = mockFetch(
      fakeResponse({ code: 200, data: { ayahs: [{ numberInSurah: 1, text: "[q[ق]" }] } }),
    );
    await expect(fetchSurahTajweed(112)).resolves.toEqual({
      "1": [{ text: "ق", rule: "qalqalah" }],
    });
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://api.alquran.cloud/v1/surah/112/quran-tajweed",
    );
  });

  it("serves a repeat request from the study cache", async () => {
    mockFetch(fakeResponse({ code: 200, data: { ayahs: [{ numberInSurah: 1, text: "x" }] } }));
    await fetchSurahTajweed(113);
    const fetchMock = mockFetch(new Error("offline"));
    await expect(fetchSurahTajweed(113)).resolves.toEqual({ "1": [{ text: "x" }] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports and rejects an empty payload", async () => {
    mockFetch(fakeResponse({ code: 200 }));
    await expect(fetchSurahTajweed(114)).rejects.toThrow("Empty tajweed payload for surah 114");
    expect(report).toHaveBeenCalledWith(expect.objectContaining({ errorCode: "empty_payload" }));
  });
});
