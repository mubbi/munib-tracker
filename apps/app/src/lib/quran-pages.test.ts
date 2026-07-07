import { QURAN_TOTAL_PAGES } from "@munib-tracker/shared/constants/quran";

import {
  getAyahsOnPage,
  getPageCount,
  getPageForAyah,
  getPageStarts,
  getSurahAyahs,
  pageToStartAyah,
} from "@/lib/quran";

describe("quran page metadata", () => {
  it("indexes 604 page starts", () => {
    expect(getPageCount()).toBe(QURAN_TOTAL_PAGES);
    expect(getPageStarts()).toHaveLength(QURAN_TOTAL_PAGES);
    expect(getPageStarts()[0]).toEqual({ page: 1, surah: 1, ayah: 1 });
  });

  it("maps ayah 1:1 to page 1", () => {
    expect(getPageForAyah(1, 1)).toBe(1);
    const ayah = getSurahAyahs(1)[0];
    expect(ayah.page).toBe(1);
    expect(ayah.hizb).toBeGreaterThanOrEqual(1);
  });

  it("round-trips page start lookup", () => {
    for (const page of [2, 42, 200, 604]) {
      const start = pageToStartAyah(page);
      expect(start?.page).toBe(page);
      if (!start) continue;
      expect(getPageForAyah(start.surah, start.ayah)).toBe(page);
    }
  });

  it("returns ayahs for a cross-surah page", () => {
    const page2 = getAyahsOnPage(2);
    expect(page2.length).toBeGreaterThan(0);
    expect(page2.every((a) => a.page === 2)).toBe(true);
  });

  it("last page start is 112:1", () => {
    const last = getPageStarts()[QURAN_TOTAL_PAGES - 1];
    expect(last).toEqual({ page: 604, surah: 112, ayah: 1 });
  });
});
