import type { HadithItem } from "@munib-tracker/shared/types";

import { buildMcq, normalizeMcqText } from "./mcq-helpers";
import type { StudyMcq } from "./types";

/**
 * Recognition cards from bundled Nawawi Forty — pick the matching teaching text.
 * Does not invent grades or tafsir.
 */
export function mcqsFromHadith(items: readonly HadithItem[]): StudyMcq[] {
  const usable = items.filter((item) => item.english.trim().length > 40);
  if (usable.length < 4) return [];

  const openings = usable.map((item) => normalizeMcqText(item.english));
  const out: StudyMcq[] = [];

  for (const item of usable) {
    const opening = normalizeMcqText(item.english);
    const card = buildMcq({
      id: `hadith:opening:${item.id}`,
      sourceId: "hadith",
      prompt: `Which of these is a teaching from ${item.reference}?`,
      correct: opening,
      distractorPool: openings,
      explanation: item.reference,
      categoryLabelKey: "flashCards.category.hadith",
    });
    if (card) out.push(card);
  }

  return out;
}
