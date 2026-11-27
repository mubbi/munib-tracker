import en from "@/i18n/en.json";
import {
  coachingState,
  practiceHistory,
  practiceSummary,
  wordDataFor,
} from "@/test-support/tajweed-coaching";

import { COACHING_COPY, categoryNameKey, planItemCopyKey } from "./copy";
import {
  type BuildPlanInput,
  buildCoachingPlan,
  type CoachingAyah,
  collectCoachingAyahs,
  countOccurrences,
  PLAN_EXAMPLE_WORDS,
  PLAN_MAX_AYAHS,
  planIsStale,
} from "./plan";

const NOW = new Date("2026-11-24T10:00:00.000Z");

/** 112:1 (shaddah on word 2), 112:3 (qalqalah on words 1 and 3), 112:2 (sun letter). */
const WORD_DATA = wordDataFor([
  { surah: 112, ayah: 1, rules: {} },
  { surah: 112, ayah: 2, rules: { 0: "ham_wasl", 1: "laam_shamsiyah" } },
  { surah: 112, ayah: 3, rules: { 1: "qalqalah", 3: "qalqalah", 2: "idgham_shafawi" } },
]);

const AYAHS: CoachingAyah[] = [
  { surah: 112, ayah: 3, source: "weak" },
  { surah: 112, ayah: 2, source: "weak" },
  { surah: 112, ayah: 1, source: "due" },
];

function input(overrides: Partial<BuildPlanInput> = {}): BuildPlanInput {
  return {
    ayahs: AYAHS,
    wordData: WORD_DATA,
    flagged: [],
    state: coachingState(),
    alignmentReliable: false,
    now: NOW,
    ...overrides,
  };
}

/** Resolve a dotted i18n key in en.json. */
function en_(key: string): string {
  return key
    .split(".")
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], en) as string;
}

describe("collectCoachingAyahs", () => {
  it("orders weak ayahs from the newest session, then flagged ayahs, then the revision queue", () => {
    const history = practiceHistory([
      practiceSummary({ id: "old", endedAt: "2026-11-01T00:00:00.000Z", weakAyahs: [1] }),
      practiceSummary({ id: "new", endedAt: "2026-11-20T00:00:00.000Z", weakAyahs: [3, 1] }),
    ]);
    const out = collectCoachingAyahs({
      history,
      due: [
        { surah: 1, ayah: 2 },
        { surah: 112, ayah: 3 },
      ],
      flagged: [{ surah: 2, ayah: 2, word: 1, at: "2026-11-21T00:00:00.000Z" }],
    });
    expect(out.map((a) => `${a.surah}:${a.ayah}:${a.source}`)).toEqual([
      "112:3:weak",
      "112:1:weak",
      "2:2:flagged",
      "1:2:due",
    ]);
  });

  it("caps the ayahs a plan is built from", () => {
    const history = practiceHistory([
      practiceSummary({ surah: 2, weakAyahs: Array.from({ length: 80 }, (_, i) => i + 1) }),
    ]);
    expect(collectCoachingAyahs({ history, due: [], flagged: [] })).toHaveLength(PLAN_MAX_AYAHS);
  });
});

describe("buildCoachingPlan (Phase A)", () => {
  it("counts rule occurrences per category, with shaddah as gemination", () => {
    const counts = countOccurrences(AYAHS, WORD_DATA);
    expect(counts.get("qalqalah")).toBe(2);
    expect(counts.get("ghunna")).toBe(1);
    // 112:1 word 2 and both words of 112:2 carry a shaddah.
    expect(counts.get("gemination")).toBe(3);
    expect(counts.get("ham_wasl")).toBe(1);
  });

  it("ranks drill heads by occurrences × (1 + recent try-again rate)", () => {
    const plain = buildCoachingPlan(input());
    expect(plain?.items.slice(0, 3).map((i) => i.head)).toEqual([
      "gemination",
      "qalqalah",
      "ghunna",
    ]);

    // Every recent qalqalah take was "try again" → its score doubles (2 × 2 = 4 > 3).
    const state = coachingState({
      heads: { qalqalah: { attempts: 2, matched: 0, tryAgain: 2, notSure: 0, recent: ["t", "t"] } },
    });
    const boosted = buildCoachingPlan(input({ state }));
    expect(boosted?.items[0].head).toBe("qalqalah");
  });

  it("adds listen-and-repeat cards for rules with no drill head", () => {
    const plan = buildCoachingPlan(input());
    const listen = plan?.items.filter((i) => i.head.startsWith("listen:")).map((i) => i.head);
    expect(listen).toEqual(["listen:ham_wasl", "listen:laam_shamsiyah"]);
  });

  it("draws example words from the person's own ayahs, flagged words first", () => {
    const plan = buildCoachingPlan(
      input({ flagged: [{ surah: 112, ayah: 3, word: 3, at: "2026-11-23T00:00:00.000Z" }] }),
    );
    const qalqalah = plan?.items.find((i) => i.head === "qalqalah");
    expect(qalqalah?.words[0]).toEqual({ surah: 112, ayah: 3, wordIndex: 3 });
    expect(qalqalah?.words).toContainEqual({ surah: 112, ayah: 3, wordIndex: 1 });
    for (const item of plan?.items ?? []) {
      expect(item.words.length).toBeLessThanOrEqual(PLAN_EXAMPLE_WORDS);
    }
  });

  it("returns null when the ayahs contain nothing to coach", () => {
    expect(buildCoachingPlan(input({ ayahs: [] }))).toBeNull();
  });
});

describe("buildCoachingPlan (Phase B word cards)", () => {
  const flagged = [{ surah: 112, ayah: 3, word: 1, at: "2026-11-23T00:00:00.000Z" }];

  it("turns a flagged word inside a rule's span into a word card when alignment is reliable", () => {
    const plan = buildCoachingPlan(input({ flagged, alignmentReliable: true }));
    expect(plan?.wordCards).toEqual([
      { surah: 112, ayah: 3, wordIndex: 1, categories: ["qalqalah"] },
    ]);
  });

  it("falls back to Phase A cards only when spike S4 missed its gate (D24)", () => {
    const plan = buildCoachingPlan(input({ flagged, alignmentReliable: false }));
    expect(plan?.wordCards).toBeUndefined();
    expect(plan?.items.find((i) => i.head === "qalqalah")?.words[0]).toEqual({
      surah: 112,
      ayah: 3,
      wordIndex: 1,
    });
  });
});

describe("coaching copy (step 8)", () => {
  it("uses the reviewed 'These ayahs include …' keys, never a mistake line", () => {
    expect(planItemCopyKey("qalqalah")).toBe(COACHING_COPY.planDrill);
    expect(planItemCopyKey("madd")).toBe(COACHING_COPY.planListen);
    expect(en_(COACHING_COPY.planDrill)).toBe(
      "These ayahs include {{rule}} — let's practice it with words from your recitation.",
    );
    expect(en_(COACHING_COPY.wordCard)).toMatch(/^This word has \{\{rule\}\}/);
  });

  it("never says mistake, wrong, error or score anywhere in the feature's English copy", () => {
    const text = JSON.stringify((en as Record<string, unknown>).tajweedCoaching);
    expect(text).not.toMatch(/\b(mistake|wrong|error|score|failed)\b/i);
  });

  it("has a short name for every category", () => {
    for (const category of ["qalqalah", "ghunna", "gemination", "madd", "ham_wasl"] as const) {
      expect(typeof en_(categoryNameKey(category))).toBe("string");
    }
  });
});

describe("planIsStale", () => {
  it("is stale with no plan once there is practice, or when a newer session ended", () => {
    const history = practiceHistory([practiceSummary({ endedAt: "2026-11-24T09:00:00.000Z" })]);
    expect(planIsStale(undefined, practiceHistory([]))).toBe(false);
    expect(planIsStale(undefined, history)).toBe(true);
    expect(planIsStale({ createdAt: "2026-11-24T08:00:00.000Z", items: [] }, history)).toBe(true);
    expect(planIsStale({ createdAt: "2026-11-24T10:00:00.000Z", items: [] }, history)).toBe(false);
  });
});
