import {
  pushZikrDetail,
  zikrQuranDestination,
  zikrQuranHref,
  zikrQuranPath,
  zikrQuranRanges,
} from "./zikr-quran";

describe("zikrQuranHref / destination", () => {
  it("maps Surah Al-Mulk to the Qur'an reader", () => {
    expect(zikrQuranDestination("before_sleep-mulk")).toEqual({ surah: 67 });
    expect(zikrQuranHref("before_sleep-mulk")).toEqual({
      pathname: "/quran/[surah]",
      params: { surah: "67" },
    });
  });

  it("maps Surah As-Sajdah to the Qur'an reader", () => {
    expect(zikrQuranHref("before_sleep-sajdah")).toEqual({
      pathname: "/quran/[surah]",
      params: { surah: "32" },
    });
  });

  it("does not redirect ayah-range remembrances to the full surah", () => {
    expect(zikrQuranHref("before_sleep-ayat-kursi")).toBeNull();
    expect(zikrQuranHref("before_sleep-baqarah-end")).toBeNull();
    expect(zikrQuranHref("before_sleep-ikhlas")).toBeNull();
  });

  it("returns null for ordinary adhkar", () => {
    expect(zikrQuranHref("before_sleep-name")).toBeNull();
    expect(zikrQuranHref(undefined)).toBeNull();
  });
});

describe("zikrQuranRanges", () => {
  it("maps Ayat al-Kursi to 2:255", () => {
    expect(zikrQuranRanges("before_sleep-ayat-kursi")).toEqual([
      { surah: 2, ayahFrom: 255, ayahTo: 255 },
    ]);
  });

  it("maps the last two ayahs of Al-Baqarah to 2:285-286", () => {
    expect(zikrQuranRanges("before_sleep-baqarah-end")).toEqual([
      { surah: 2, ayahFrom: 285, ayahTo: 286 },
    ]);
  });

  it("maps the three Quls to full Surahs 112–114", () => {
    expect(zikrQuranRanges("before_sleep-ikhlas")).toEqual([
      { surah: 112, ayahFrom: 1, ayahTo: 4 },
      { surah: 113, ayahFrom: 1, ayahTo: 5 },
      { surah: 114, ayahFrom: 1, ayahTo: 6 },
    ]);
  });

  it("returns null for full-surah redirects and ordinary zikr", () => {
    expect(zikrQuranRanges("before_sleep-mulk")).toBeNull();
    expect(zikrQuranRanges("before_sleep-name")).toBeNull();
  });
});

describe("zikrQuranPath", () => {
  it("builds path strings for full-surah continue / share", () => {
    expect(zikrQuranPath("before_sleep-mulk")).toBe("/quran/67");
    expect(zikrQuranPath("before_sleep-ayat-kursi")).toBeNull();
  });
});

describe("pushZikrDetail", () => {
  it("pushes the Qur'an reader for full-surah items", () => {
    const push = jest.fn();
    pushZikrDetail({ push }, "before_sleep-mulk");
    expect(push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "67" },
    });
  });

  it("pushes zikr detail for ayah-range and ordinary items", () => {
    const push = jest.fn();
    pushZikrDetail({ push }, "before_sleep-ikhlas");
    expect(push).toHaveBeenCalledWith({
      pathname: "/zikr/detail/[id]",
      params: { id: "before_sleep-ikhlas" },
    });

    push.mockClear();
    pushZikrDetail({ push }, "before_sleep-name", { prayer: "fajr" });
    expect(push).toHaveBeenCalledWith({
      pathname: "/zikr/detail/[id]",
      params: { id: "before_sleep-name", prayer: "fajr" },
    });
  });
});
