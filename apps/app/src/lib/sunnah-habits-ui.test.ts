import { SUNNAH_HABITS } from "@munib-tracker/shared/content/sunnah-habits";

import { EMPTY_SUNNAH_HABITS, habitCheckKey } from "./sunnah-habits";
import { canOfferHabitDone, habitLinkHref, habitRecitePassage } from "./sunnah-habits-ui";

const def = (id: string) => SUNNAH_HABITS.find((h) => h.id === id);

describe("habitRecitePassage", () => {
  it("recites Ayat al-Kursi as its one ayah", () => {
    expect(habitRecitePassage(def("ayat_kursi_sleep"))).toEqual({
      surah: 2,
      ayahStart: 255,
      ayahEnd: 255,
    });
  });

  it("recites al-Mulk as the whole surah (sectioned by the sheet)", () => {
    expect(habitRecitePassage(def("mulk_nightly"))).toEqual({
      surah: 67,
      ayahStart: 1,
      ayahEnd: 30,
    });
  });

  it("returns null for habits that are not Qur'an recitation", () => {
    expect(habitRecitePassage(def("miswak"))).toBeNull();
    expect(habitRecitePassage(def("salam_home"))).toBeNull();
    expect(habitRecitePassage(undefined)).toBeNull();
  });
});

describe("habitLinkHref", () => {
  it("opens a single-ayah habit (Ayat al-Kursi) as just that passage", () => {
    expect(habitLinkHref({ kind: "quran", surah: 2, ayah: 255 })).toEqual({
      pathname: "/quran/passage",
      params: { surah: "2", from: "255", to: "255" },
    });
  });

  it("keeps whole-surah habits (al-Mulk) on the surah reader", () => {
    expect(habitLinkHref({ kind: "quran", surah: 67 })).toEqual({
      pathname: "/quran/[surah]",
      params: { surah: "67" },
    });
  });

  it("opens the tasbeeh for a tasbeeh-linked habit", () => {
    expect(habitLinkHref({ kind: "tasbeeh", zikrId: "after_azan-salawat" })).toEqual({
      pathname: "/tasbeeh/[zikrId]",
      params: { zikrId: "after_azan-salawat" },
    });
  });
});

describe("canOfferHabitDone (D74)", () => {
  const DATE = "2026-11-25";
  const base = { state: EMPTY_SUNNAH_HABITS, habitId: "ayat_kursi_sleep", date: DATE };

  it("offers it for a recitation habit not ticked today, once an ayah was credited", () => {
    expect(canOfferHabitDone({ ...base, creditedAyahs: 1 })).toBe(true);
    expect(canOfferHabitDone({ ...base, habitId: "mulk_nightly", creditedAyahs: 3 })).toBe(true);
  });

  it("never without a credited ayah, a habit id, or for a non-recitation habit", () => {
    expect(canOfferHabitDone({ ...base, creditedAyahs: 0 })).toBe(false);
    expect(canOfferHabitDone({ ...base, habitId: undefined, creditedAyahs: 1 })).toBe(false);
    expect(canOfferHabitDone({ ...base, habitId: "miswak", creditedAyahs: 1 })).toBe(false);
    expect(canOfferHabitDone({ ...base, habitId: "nope", creditedAyahs: 1 })).toBe(false);
  });

  it("not once today's habit is ticked (another day doesn't count)", () => {
    const ticked = {
      ...EMPTY_SUNNAH_HABITS,
      checks: { [habitCheckKey("ayat_kursi_sleep", DATE)]: 1 },
    };
    expect(canOfferHabitDone({ ...base, state: ticked, creditedAyahs: 1 })).toBe(false);
    expect(
      canOfferHabitDone({ ...base, state: ticked, date: "2026-11-26", creditedAyahs: 1 }),
    ).toBe(true);
  });
});
