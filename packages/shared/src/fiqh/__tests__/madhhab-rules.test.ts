import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { FIQH_DIFFERENCES, getFiqhDifference } from "../differences";
import { MADHHAB_IDS, MADHHAB_RULES } from "../madhhab-rules";

/**
 * D11 review log for MADHHAB_RULES (plan §4.1.6). APPEND-ONLY: when a ruling
 * changes, (1) record it in docs/proofs/madhhab.md, (2) bump `REVIEW.reviewedAt`
 * in madhhab-rules.ts to the review date, (3) append `{ hash, reviewedAt }` here
 * with the hash the failing test prints. Never edit an earlier entry — the
 * dates must strictly increase, so a rules change can't reuse the old stamp.
 */
const RULES_REVIEW_LOG: ReadonlyArray<{ hash: string; reviewedAt: string }> = [
  {
    hash: "5585e15d09db0dad2ad63be19871ca3dea84059a8a84e882b2e901f0f7d0d8aa",
    reviewedAt: "2026-11-23",
  },
];

function stableJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value != null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, stableJson(record[key])]),
    );
  }
  return value;
}

/** sha256 of every school's rules WITHOUT the `review` stamp (key order independent). */
function rulesHash(): string {
  const rules = Object.fromEntries(
    MADHHAB_IDS.map((school) => {
      const { review: _review, ...rest } = MADHHAB_RULES[school];
      return [school, rest];
    }),
  );
  return createHash("sha256")
    .update(JSON.stringify(stableJson(rules)))
    .digest("hex");
}

describe.concurrent("MADHHAB_RULES review stamp", () => {
  it("a rules change must come with a new reviewedAt (append to RULES_REVIEW_LOG)", () => {
    const latest = RULES_REVIEW_LOG[RULES_REVIEW_LOG.length - 1];
    const current = { hash: rulesHash(), reviewedAt: MADHHAB_RULES.hanafi.review.reviewedAt };
    expect(
      current,
      "MADHHAB_RULES changed (or its review stamp did): update docs/proofs/madhhab.md, bump " +
        "REVIEW.reviewedAt in madhhab-rules.ts, and append this { hash, reviewedAt } to RULES_REVIEW_LOG.",
    ).toEqual(latest);
  });

  it("keeps the review log append-only with strictly increasing dates", () => {
    for (let i = 1; i < RULES_REVIEW_LOG.length; i++) {
      const prev = RULES_REVIEW_LOG[i - 1];
      const entry = RULES_REVIEW_LOG[i];
      expect(entry?.reviewedAt.localeCompare(prev?.reviewedAt ?? "")).toBe(1);
      expect(entry?.hash).not.toBe(prev?.hash);
    }
  });

  it("uses one review stamp for every school", () => {
    const stamps = new Set(
      MADHHAB_IDS.map((school) => JSON.stringify(MADHHAB_RULES[school].review)),
    );
    expect(stamps.size).toBe(1);
  });
});

describe.concurrent("MADHHAB_RULES", () => {
  it("matches the reviewed snapshot — a change needs a new proof-log entry and review stamp", () => {
    // If this fails you changed a ruling: update docs/proofs/madhhab.md, bump
    // `review.reviewedAt` in madhhab-rules.ts, then refresh the snapshot.
    expect(MADHHAB_RULES).toMatchSnapshot();
  });

  it.each(MADHHAB_IDS)("%s carries the D11 ai-review stamp", (school) => {
    const { review } = MADHHAB_RULES[school];
    expect(review.reviewedBy).toBe("ai-review");
    expect(review.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(review.proofLog).toBe("docs/proofs/madhhab.md");
  });

  it("covers exactly the four schools", () => {
    expect(Object.keys(MADHHAB_RULES).sort()).toEqual([...MADHHAB_IDS].sort());
  });

  it.each(MADHHAB_IDS)("%s keeps its numeric ranges coherent", (school) => {
    const { hayd, travel, eid } = MADHHAB_RULES[school];
    expect(hayd.maxDays).toBeGreaterThan(hayd.minHours / 24);
    expect(hayd.nifasMaxDays).toBeGreaterThanOrEqual(hayd.maxDays);
    expect(travel.qasrDistanceKmRange[0]).toBe(travel.qasrDistanceKm);
    expect(travel.qasrDistanceKmRange[1]).toBeGreaterThanOrEqual(travel.qasrDistanceKmRange[0]);
    expect(eid.extraTakbirs).toHaveLength(2);
  });

  it("encodes the plan's acceptance defaults (Hanafi vs Shafi'i)", () => {
    const { hanafi, shafii } = MADHHAB_RULES;
    expect(hanafi.witr).toMatchObject({ status: "wajib", qazaDefault: true });
    expect(hanafi.hayd.maxDays).toBe(10);
    expect(hanafi.travel).toMatchObject({ qasrDistanceKm: 77, jamTravel: false });
    expect(hanafi.zakat).toMatchObject({ nisabBasis: "lower", personalJewelleryZakatable: true });
    expect(shafii.witr).toMatchObject({ status: "sunnah_muakkadah", qazaDefault: false });
    expect(shafii.hayd.maxDays).toBe(15);
    expect(shafii.travel.jamTravel).toBe(true);
    expect(shafii.zakat.personalJewelleryZakatable).toBe(false);
  });

  it("follows D8 for the rawatib preset (Hanafi 12, others 10)", () => {
    expect(MADHHAB_IDS.map((s) => MADHHAB_RULES[s].rawatib.defaultPreset)).toEqual([
      12, 10, 10, 10,
    ]);
  });

  it("only Hanafi defaults Witr qaza on (D9 retrofit)", () => {
    expect(MADHHAB_IDS.filter((s) => MADHHAB_RULES[s].witr.qazaDefault)).toEqual(["hanafi"]);
  });
});

/** Catalog rows whose per-school `value` must agree with the typed rules. */
const CONSISTENCY: Array<
  [Parameters<typeof getFiqhDifference>[0], (s: (typeof MADHHAB_IDS)[number]) => unknown]
> = [
  ["witr.status", (s) => MADHHAB_RULES[s].witr.status],
  ["witr.form", (s) => MADHHAB_RULES[s].witr.form.structure],
  ["witr.qaza", (s) => MADHHAB_RULES[s].witr.qaza],
  ["fajr.preferred", (s) => MADHHAB_RULES[s].fajrPreferred],
  ["asr.preferred", (s) => MADHHAB_RULES[s].asrPreferred],
  ["isha.start", (s) => MADHHAB_RULES[s].ishaStartTwilight],
  ["isha.preferred", (s) => MADHHAB_RULES[s].ishaPreferred],
  ["hayd.min", (s) => MADHHAB_RULES[s].hayd.minHours],
  ["hayd.max", (s) => MADHHAB_RULES[s].hayd.maxDays],
  ["hayd.minPurity", (s) => MADHHAB_RULES[s].hayd.minPurityDays],
  ["nifas.max", (s) => MADHHAB_RULES[s].hayd.nifasMaxDays],
  ["qasr.status", (s) => MADHHAB_RULES[s].travel.qasrStatus],
  ["qasr.residency", (s) => MADHHAB_RULES[s].travel.residencyDays],
  ["jam.rain", (s) => MADHHAB_RULES[s].travel.jamRain],
  ["travel.rawatib", (s) => MADHHAB_RULES[s].travel.rawatib],
  ["zakat.nisabBasis", (s) => MADHHAB_RULES[s].zakat.nisabBasis],
  ["fidyah.measure", (s) => MADHHAB_RULES[s].fasting.fidyahMeasure],
  ["fitr.measure", (s) => MADHHAB_RULES[s].fasting.fitrMeasure],
  ["fasting.afterMidShaban", (s) => MADHHAB_RULES[s].fasting.afterMidShaban],
  ["jumuah.minCongregation", (s) => MADHHAB_RULES[s].jumuah.minCongregation],
  ["eid.status", (s) => MADHHAB_RULES[s].eid.status],
  ["eid.extraTakbirs", (s) => MADHHAB_RULES[s].eid.extraTakbirs.join("+")],
  ["janazah.fatiha", (s) => MADHHAB_RULES[s].janazahFatiha],
  ["tawaf.wudu", (s) => MADHHAB_RULES[s].tawafWudu],
  ["rawatib.preset", (s) => MADHHAB_RULES[s].rawatib.defaultPreset],
  ["tarawih.rakahs", (s) => MADHHAB_RULES[s].fasting.tarawihRakahs],
  ["udhiyah.status", (s) => MADHHAB_RULES[s].udhiyah.status],
  ["udhiyah.hairNails", (s) => MADHHAB_RULES[s].hairNailsDuringTen],
  ["mirath.grandfatherSiblings", (s) => MADHHAB_RULES[s].mirath.grandfatherWithSiblings],
  ["mirath.mushtarakah", (s) => MADHHAB_RULES[s].mirath.mushtarakah],
  ["mirath.paternalGrandmother", (s) => MADHHAB_RULES[s].mirath.paternalGrandmotherWithFather],
  ["mirath.radd", (s) => MADHHAB_RULES[s].mirath.raddClassical],
  ["mirath.malikiyyah", (s) => (MADHHAB_RULES[s].mirath.malikiyyah ? "applies" : "not_applied")],
];

describe.concurrent("FIQH_DIFFERENCES ↔ MADHHAB_RULES", () => {
  it.each(CONSISTENCY)("%s agrees with the typed rules for every school", (id, pick) => {
    const diff = getFiqhDifference(id);
    for (const school of MADHHAB_IDS) {
      expect({ school, value: diff.positions[school].value }).toEqual({
        school,
        value: pick(school),
      });
    }
  });

  it("checks a large share of the catalog against the rules", () => {
    // Guide-note-only rows (`guideNoteOnly`: salah method, wudu details) have no
    // typed rule — no calculator or tracker consumes them — so they're excluded.
    const ruleBacked = FIQH_DIFFERENCES.filter((d) => !d.guideNoteOnly);
    expect(CONSISTENCY.length).toBeGreaterThanOrEqual(ruleBacked.length * 0.7);
  });

  it("never marks a rule-checked row as guide-note-only", () => {
    const marked = CONSISTENCY.map(([id]) => id).filter(
      (id) => getFiqhDifference(id).guideNoteOnly,
    );
    expect(marked).toEqual([]);
  });
});
