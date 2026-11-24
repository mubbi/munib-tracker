/**
 * NF-3.15 tajweed coaching fixtures. Ayah words come from the BUNDLED corpus
 * (`assets/data/quran/arabic`) — no Qur'an text is typed in tests either. The
 * tajweed markup is synthetic: a whole word stands in for the rule's span.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  TajweedCoachingState,
  TajweedRuleId,
  TajweedSegment,
} from "@munib-tracker/shared/types";

import { splitAyahWords } from "@/lib/quran-companion/align-words";
import type { PracticeHistory, PracticeSummary } from "@/lib/quran-companion/types";
import { studyWordTajweed } from "@/lib/tajweed-coaching/ayah-words";
import { ayahKey } from "@/lib/tajweed-coaching/plan";
import { EMPTY_TAJWEED_COACHING } from "@/lib/tajweed-coaching/progress";

/** Study words of a bundled ayah (marks-only tokens dropped, like the practice row). */
export function bundledAyahWords(surah: number, ayah: number): string[] {
  const pad = String(surah).padStart(3, "0");
  const file = join(__dirname, `../../assets/data/quran/arabic/${pad}.json`);
  const text = (JSON.parse(readFileSync(file, "utf8")) as Record<string, string>)[String(ayah)];
  if (!text) throw new Error(`no bundled ayah ${surah}:${ayah}`);
  return splitAyahWords(text);
}

/** Synthetic markup: `rules[i]` marks word `i` (after an optional prefix such as a basmala). */
export function markupSegments(
  words: readonly string[],
  rules: Readonly<Record<number, TajweedRuleId>>,
  prefix: readonly string[] = [],
): TajweedSegment[] {
  const out: TajweedSegment[] = [];
  if (prefix.length) out.push({ text: `${prefix.join(" ")} ` });
  words.forEach((word, i) => {
    const sep = i < words.length - 1 ? " " : "";
    const rule = rules[i];
    if (rule) {
      out.push({ text: word, rule });
      if (sep) out.push({ text: sep });
    } else {
      out.push({ text: word + sep });
    }
  });
  return out;
}

/** `surah:ayah` → per-word tajweed for the given ayahs and synthetic rules. */
export function wordDataFor(
  entries: ReadonlyArray<{
    surah: number;
    ayah: number;
    rules: Readonly<Record<number, TajweedRuleId>>;
  }>,
) {
  const map = new Map<string, ReturnType<typeof studyWordTajweed>>();
  for (const { surah, ayah, rules } of entries) {
    const words = bundledAyahWords(surah, ayah);
    map.set(ayahKey(surah, ayah), studyWordTajweed(markupSegments(words, rules), words));
  }
  return map;
}

export function practiceSummary(overrides: Partial<PracticeSummary> = {}): PracticeSummary {
  return {
    id: "s1",
    mode: "follow",
    surah: 112,
    ayahStart: 1,
    ayahEnd: 4,
    startedAt: "2026-11-20T08:00:00.000Z",
    endedAt: "2026-11-20T08:05:00.000Z",
    durationMs: 300_000,
    engine: "tilawa-fastconformer",
    engineVersion: "test",
    matched: 10,
    uncertain: 0,
    confirmedMismatch: 1,
    corrected: 0,
    notReached: 0,
    weakAyahs: [],
    ...overrides,
  };
}

export function practiceHistory(items: PracticeSummary[]): PracticeHistory {
  return { schemaVersion: 1, items };
}

export function coachingState(overrides: Partial<TajweedCoachingState> = {}): TajweedCoachingState {
  return { ...EMPTY_TAJWEED_COACHING, heads: {}, ...overrides };
}
