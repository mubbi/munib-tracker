import type { TajweedCoachingCategory } from "@munib-tracker/shared/types";

import { isDrillHead } from "./categories";

/**
 * Reviewed coaching copy (NF-3.15 step 8). The weak ayahs come from word
 * mismatches, not tajweed judgement, so the cards only say what an ayah or a
 * word CONTAINS ("These ayahs include qalqalah — let's practise it with words
 * from your recitation"), never "you made a qalqalah mistake". Tests pin that
 * these keys are the ones the cards use.
 */
export const COACHING_COPY = {
  /** Drill card: "These ayahs include {{rule}} — let's practise it with words from your recitation." */
  planDrill: "tajweedCoaching.plan.includesDrill",
  /** Listen card: "These ayahs include {{rule}} — listen to the reciter and repeat after them." */
  planListen: "tajweedCoaching.plan.includesListen",
  /** Phase B word card: "This word has {{rule}} — listen to the reciter and try it again." */
  wordCard: "tajweedCoaching.word.body",
} as const;

/** Short, sentence-case rule name used inside the copy lines. */
export function categoryNameKey(category: TajweedCoachingCategory): string {
  return `tajweedCoaching.category.${category}`;
}

export function planItemCopyKey(category: TajweedCoachingCategory): string {
  return isDrillHead(category) ? COACHING_COPY.planDrill : COACHING_COPY.planListen;
}
