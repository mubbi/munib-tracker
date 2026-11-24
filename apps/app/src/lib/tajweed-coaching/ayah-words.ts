import type {
  TajweedCoachingCategory,
  TajweedRuleId,
  TajweedSegment,
} from "@munib-tracker/shared/types";

import { alignPracticeWords, foldArabicWord } from "@/lib/quran-companion/align-words";

import { COACHING_CATEGORIES, RULE_CATEGORY } from "./categories";

/** U+0651 ARABIC SHADDAH. */
const SHADDAH = "ّ";

/** One word of the tajweed-marked ayah text with the rules whose spans touch it. */
export type TajweedMarkupWord = {
  text: string;
  rules: TajweedRuleId[];
  shaddah: boolean;
};

/** What a study word (Quran.com order) contains, for coaching. */
export type StudyWordTajweed = {
  rules: TajweedRuleId[];
  categories: TajweedCoachingCategory[];
};

/**
 * Split parsed tajweed segments (`parseTajweedMarkup`) into words, keeping the
 * rules whose span falls inside each word. Marks-only tokens (waqf signs) are
 * dropped, the same as the study row does.
 */
export function tajweedMarkupWords(segments: readonly TajweedSegment[]): TajweedMarkupWord[] {
  const words: TajweedMarkupWord[] = [];
  let text = "";
  let rules = new Set<TajweedRuleId>();
  const flush = () => {
    if (text && foldArabicWord(text).length > 0) {
      words.push({ text, rules: [...rules], shaddah: text.includes(SHADDAH) });
    }
    text = "";
    rules = new Set();
  };
  for (const segment of segments) {
    const parts = segment.text.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        flush();
        continue;
      }
      text += part;
      if (segment.rule) rules.add(segment.rule);
    }
  }
  flush();
  return words;
}

function categoriesFor(
  rules: Iterable<TajweedRuleId>,
  shaddah: boolean,
): TajweedCoachingCategory[] {
  const set = new Set<TajweedCoachingCategory>();
  for (const rule of rules) {
    const category = RULE_CATEGORY[rule];
    if (category) set.add(category);
  }
  if (shaddah) set.add("gemination");
  return COACHING_CATEGORIES.filter((c) => set.has(c));
}

/**
 * Map the tajweed markup of one ayah onto its study words (Quran.com word
 * order, the index NF-3.24 and the practice row use). The two texts tokenise
 * differently (the markup source prepends the basmala to some first ayahs,
 * splits some joins), so words are matched with the §6 practice aligner; a
 * study word with no match gets nothing (never a guessed rule).
 */
export function studyWordTajweed(
  segments: readonly TajweedSegment[],
  studyWords: readonly string[],
): StudyWordTajweed[] {
  const markup = tajweedMarkupWords(segments);
  const alignment = alignPracticeWords(
    "",
    studyWords,
    markup.map((w) => w.text),
  );
  const rules: Set<TajweedRuleId>[] = studyWords.map(() => new Set());
  // Shaddah comes from the Uthmani study text itself (plus the markup copy).
  const shaddah: boolean[] = studyWords.map((w) => w.includes(SHADDAH));
  markup.forEach((word, m) => {
    for (const s of alignment.engineToStudy[m] ?? []) {
      for (const rule of word.rules) rules[s].add(rule);
      if (word.shaddah) shaddah[s] = true;
    }
  });
  return studyWords.map((_, s) => {
    const list = [...rules[s]];
    return { rules: list, categories: categoriesFor(list, shaddah[s]) };
  });
}
