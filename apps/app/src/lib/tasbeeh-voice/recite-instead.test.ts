import { AYAT_AL_KURSI_PASSAGE, SURAH_AL_QADR_PASSAGE, zikrRecitePassages } from "./recite-instead";

describe("Qur'anic remembrances are recited along, not counted (D68)", () => {
  it("maps ayah-span remembrances to their passages", () => {
    expect(zikrRecitePassages("before_sleep-ayat-kursi")).toEqual([AYAT_AL_KURSI_PASSAGE]);
    expect(zikrRecitePassages("before_sleep-baqarah-end")).toEqual([
      { surah: 2, ayahStart: 285, ayahEnd: 286 },
    ]);
    expect(zikrRecitePassages("before_sleep-ikhlas").map((p) => p.surah)).toEqual([112, 113, 114]);
  });

  it("maps full-surah remembrances to the whole surah", () => {
    expect(zikrRecitePassages("before_sleep-mulk")).toEqual([
      { surah: 67, ayahStart: 1, ayahEnd: 30 },
    ]);
  });

  it("offers nothing for other zikr", () => {
    expect(zikrRecitePassages("after_prayer-tasbih")).toEqual([]);
    expect(zikrRecitePassages(null)).toEqual([]);
  });

  it("points al-Qadr at the whole surah", () => {
    expect(SURAH_AL_QADR_PASSAGE).toEqual({ surah: 97, ayahStart: 1, ayahEnd: 5 });
  });
});
