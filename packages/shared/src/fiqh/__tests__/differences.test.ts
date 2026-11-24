import { describe, expect, it } from "vitest";

import {
  CLASSICAL_WORKS,
  differencesForDomain,
  FIQH_DIFFERENCE_IDS,
  FIQH_DIFFERENCES,
  fiqhDifferenceKeys,
  getFiqhDifference,
  isFiqhDifferenceId,
  otherSchools,
} from "../differences";
import { FIQH_DOMAINS, MADHHAB_IDS } from "../madhhab-rules";

/** Plan §4.1.3 "New features" rows that must be in the catalog. */
const NEW_FEATURE_ROWS = [
  "rawatib.preset",
  "tashriq.takbir",
  "udhiyah.status",
  "udhiyah.hairNails",
  "fasting.afterMidShaban",
  "mirath.grandfatherSiblings",
] as const;

describe.concurrent("FIQH_DIFFERENCES", () => {
  it("has exactly one row per declared id, in order", () => {
    expect(FIQH_DIFFERENCES.map((d) => d.id)).toEqual([...FIQH_DIFFERENCE_IDS]);
  });

  it.each(NEW_FEATURE_ROWS)("includes the new-feature row %s", (id) => {
    expect(isFiqhDifferenceId(id)).toBe(true);
  });

  it.each(FIQH_DIFFERENCES.map((d) => [d.id, d] as const))("%s is well-formed", (id, diff) => {
    expect(FIQH_DOMAINS).toContain(diff.domain);
    expect(diff.titleKey).toBe(`fiqh.diff.${id}.title`);
    expect(Object.keys(diff.positions).sort()).toEqual([...MADHHAB_IDS].sort());
    for (const position of Object.values(diff.positions)) {
      expect(position.summaryKey.startsWith(`fiqh.diff.${id}.`)).toBe(true);
      expect(position.summaryKey).not.toBe(diff.titleKey);
      // Every position cites at least its school's own manuals.
      expect(position.refs?.some((r) => r.kind === "book")).toBe(true);
    }
    expect(diff.usedIn.length).toBeGreaterThan(0);
    for (const where of diff.usedIn) expect(where).toMatch(/^\/[\w\-()/[\]]*(#[\w-]+)?$/);
  });

  it("labels a majority only when three or more schools share the summary", () => {
    for (const diff of FIQH_DIFFERENCES) {
      if (!diff.majority) continue;
      expect(diff.majority.length).toBeGreaterThanOrEqual(3);
      const values = new Set(diff.majority.map((s) => diff.positions[s].value));
      expect({ id: diff.id, distinct: values.size }).toEqual({ id: diff.id, distinct: 1 });
    }
  });

  it("references only well-formed Qur'an, hadith and classical-work refs", () => {
    const allRefs = FIQH_DIFFERENCES.flatMap((d) => [
      ...(d.refs ?? []),
      ...Object.values(d.positions).flatMap((p) => p.refs ?? []),
    ]);
    for (const ref of allRefs) {
      if (ref.kind === "quran") {
        expect(ref.surah).toBeGreaterThanOrEqual(1);
        expect(ref.surah).toBeLessThanOrEqual(114);
        expect(ref.ayahFrom).toBeGreaterThanOrEqual(1);
      } else if (ref.kind === "hadith") {
        expect(Number.isInteger(ref.number)).toBe(true);
        expect(ref.number).toBeGreaterThan(0);
        // Muslim's corpus numbering differs from print: keep the Abd al-Baqi number alongside.
        if (ref.collection === "muslim") expect(ref.arabicNumber).toMatch(/^\d+(\.\d{2})?$/);
      } else {
        expect(CLASSICAL_WORKS[ref.work]).toBeDefined();
      }
    }
  });

  it("lists every translation key once (titles + shared summaries)", () => {
    const keys = fiqhDifferenceKeys();
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain("fiqh.diff.witr.status.title");
    expect(keys).toContain("fiqh.diff.witr.status.majority");
    // No key may be both a leaf and a namespace (nested i18n JSON would clash).
    for (const key of keys) {
      expect(keys.some((other) => other.startsWith(`${key}.`))).toBe(false);
    }
  });

  it("throws on an unknown id and filters by domain", () => {
    expect(() => getFiqhDifference("nope" as never)).toThrow(/Unknown fiqh difference/);
    expect(differencesForDomain("travel").every((d) => d.domain === "travel")).toBe(true);
    expect(differencesForDomain("inheritance").map((d) => d.id)).toContain("mirath.radd");
  });

  it("returns the other three schools for the disclosure", () => {
    expect(otherSchools("maliki")).toEqual(["hanafi", "shafii", "hanbali"]);
  });
});
