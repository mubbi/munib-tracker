import { describe, expect, it } from "vitest";

import {
  DEFAULT_SUNNAH_HABIT_SELECTION,
  getSunnahHabit,
  isSunnahHabitId,
  SUNNAH_HABITS,
  SUNNAH_HABITS_PRINCIPLE_REF,
} from "./sunnah-habits";

/** Plan §12 "Sunnah habits" — every listed ref must be cited by the catalog (proof log D11). */
const PLAN_REFS = [
  "bukhari:887",
  "bukhari:247",
  "bukhari:2311",
  "bukhari:5376",
  "bukhari:1442",
  "tirmidhi:2891",
  "tirmidhi:1956",
  // Muslim 2702 / 54 in Abd al-Baqi numbering = corpus 6858 / 194.
  "muslim:6858",
  "muslim:194",
  "quran:24:61",
];

function refKey(ref: (typeof SUNNAH_HABITS)[number]["refs"][number]): string {
  if (ref.kind === "hadith") return `${ref.collection}:${ref.number}`;
  if (ref.kind === "quran") return `quran:${ref.surah}:${ref.ayahFrom}`;
  if (ref.kind === "dataset") return `dataset:${ref.dataset}`;
  return `book:${ref.work}`;
}

describe.concurrent("SUNNAH_HABITS", () => {
  it("has unique ids", () => {
    const ids = SUNNAH_HABITS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cites every §12 ref", () => {
    const cited = new Set(SUNNAH_HABITS.flatMap((h) => h.refs.map(refKey)));
    for (const ref of PLAN_REFS) expect(cited).toContain(ref);
    expect(refKey(SUNNAH_HABITS_PRINCIPLE_REF)).toBe("bukhari:6464");
  });

  it("keeps the Abd al-Baqi number on every Muslim ref", () => {
    for (const habit of SUNNAH_HABITS) {
      for (const ref of habit.refs) {
        if (ref.kind === "hadith" && ref.collection === "muslim") {
          expect(ref.arabicNumber).toMatch(/^\d+\.\d{2}$/);
        }
      }
    }
  });

  it("gives every habit evidence, and count/linked-count habits a target", () => {
    for (const habit of SUNNAH_HABITS) {
      expect(habit.refs.length).toBeGreaterThan(0);
      if (habit.kind === "count") expect(habit.target).toBeGreaterThan(0);
    }
    expect(getSunnahHabit("istighfar_100")?.target).toBe(100);
  });

  it("derives linked habits from a source store", () => {
    for (const habit of SUNNAH_HABITS.filter((h) => h.kind === "linked")) {
      expect(habit.source).toBeDefined();
    }
  });

  it("counts salawat on the tasbeeh with a user target, still tickable by hand", () => {
    expect(getSunnahHabit("salawat")).toMatchObject({
      kind: "linked",
      userTarget: true,
      manualTick: true,
      link: { kind: "tasbeeh", zikrId: "after_azan-salawat" },
      source: "zikr:after_azan-salawat",
    });
  });

  it("starts with valid default habits", () => {
    for (const id of DEFAULT_SUNNAH_HABIT_SELECTION) expect(isSunnahHabitId(id)).toBe(true);
    expect(isSunnahHabitId("custom:x")).toBe(false);
  });
});
