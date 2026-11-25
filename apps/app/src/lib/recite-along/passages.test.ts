import {
  FATIHAH_PASSAGE,
  fatihahCheckHref,
  HABIT_RECITE_SOURCE,
  isLongPassage,
  passageFromRef,
  passageLength,
  passagesFromRefs,
  RECITE_ALONG_SOURCE,
  reciteAlongHref,
  reciteAlongModeFor,
  splitPassage,
  wholeSurah,
} from "./passages";

describe("recite-along passages", () => {
  it("knows al-Fatihah is 1:1–7 and not long", () => {
    expect(FATIHAH_PASSAGE).toEqual({ surah: 1, ayahStart: 1, ayahEnd: 7 });
    expect(passageLength(FATIHAH_PASSAGE)).toBe(7);
    expect(isLongPassage(FATIHAH_PASSAGE)).toBe(false);
  });

  it("builds a whole surah from meta, and null for an unknown surah", () => {
    expect(wholeSurah(18)).toEqual({ surah: 18, ayahStart: 1, ayahEnd: 110 });
    expect(wholeSurah(0)).toBeNull();
    expect(wholeSurah(115)).toBeNull();
  });

  it("treats more than 20 ayahs as long and starts it in Follow", () => {
    const kahf = wholeSurah(18);
    if (!kahf) throw new Error("al-Kahf meta missing");
    expect(isLongPassage(kahf)).toBe(true);
    expect(reciteAlongModeFor(kahf, "check")).toBe("follow");
    expect(reciteAlongModeFor({ surah: 18, ayahStart: 1, ayahEnd: 20 }, "check")).toBe("check");
  });

  it("splits a passage into consecutive 10-ayah sections", () => {
    const sections = splitPassage({ surah: 18, ayahStart: 1, ayahEnd: 110 });
    expect(sections).toHaveLength(11);
    expect(sections[0]).toEqual({ surah: 18, ayahStart: 1, ayahEnd: 10 });
    expect(sections[10]).toEqual({ surah: 18, ayahStart: 101, ayahEnd: 110 });
    expect(splitPassage({ surah: 2, ayahStart: 5, ayahEnd: 12 }, 3)).toEqual([
      { surah: 2, ayahStart: 5, ayahEnd: 7 },
      { surah: 2, ayahStart: 8, ayahEnd: 10 },
      { surah: 2, ayahStart: 11, ayahEnd: 12 },
    ]);
  });

  it("turns content refs into valid, de-duplicated passages", () => {
    expect(passageFromRef({ surah: 2, ayahFrom: 255 })).toEqual({
      surah: 2,
      ayahStart: 255,
      ayahEnd: 255,
    });
    // Clamped to the surah; an impossible ref is dropped.
    expect(passageFromRef({ surah: 112, ayahFrom: 1, ayahTo: 99 })).toEqual({
      surah: 112,
      ayahStart: 1,
      ayahEnd: 4,
    });
    expect(passageFromRef({ surah: 300, ayahFrom: 1 })).toBeNull();
    expect(
      passagesFromRefs(
        [
          { surah: 1, ayahFrom: 1, ayahTo: 7 },
          { surah: 1, ayahFrom: 1, ayahTo: 7 },
          { surah: 999, ayahFrom: 1 },
          { surah: 112, ayahFrom: 1, ayahTo: 4 },
          { surah: 113, ayahFrom: 1, ayahTo: 5 },
        ],
        2,
      ),
    ).toEqual([
      { surah: 1, ayahStart: 1, ayahEnd: 7 },
      { surah: 112, ayahStart: 1, ayahEnd: 4 },
    ]);
    expect(passagesFromRefs(undefined)).toEqual([]);
  });

  it("links into the practice session with its own source", () => {
    expect(reciteAlongHref({ surah: 18, ayahStart: 1, ayahEnd: 10 }, "follow")).toEqual({
      pathname: "/quran/practice/session",
      params: { surah: "18", from: "1", to: "10", mode: "follow", source: RECITE_ALONG_SOURCE },
    });
  });

  it("marks a habit's take with source=habit and the habit id (D74)", () => {
    const p = { surah: 2, ayahStart: 255, ayahEnd: 255 };
    expect(reciteAlongHref(p, "follow", { habitId: "ayat_kursi_sleep" }).params).toEqual({
      surah: "2",
      from: "255",
      to: "255",
      mode: "follow",
      source: HABIT_RECITE_SOURCE,
      habit: "ayat_kursi_sleep",
    });
    expect(reciteAlongHref(p, "follow", { habitId: " " }).params).not.toHaveProperty("habit");
  });

  it("checks al-Fatihah with the pronunciation check where it exists, else Check mode", () => {
    expect(fatihahCheckHref(true).params).toMatchObject({
      surah: "1",
      from: "1",
      to: "7",
      mode: "pronunciation",
    });
    expect(fatihahCheckHref(false).params.mode).toBe("check");
  });
});
