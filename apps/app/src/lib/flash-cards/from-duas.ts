import type { DuaItem } from "@munib-tracker/shared/types";

import { buildMcq, truncateText } from "./mcq-helpers";
import type { StudyMcq } from "./types";

/** Dua title → translation recognition (bundled corpus). */
export function mcqsFromDuas(items: readonly DuaItem[]): StudyMcq[] {
  const usable = items.filter((item) => item.title.trim() && item.translation.trim());
  if (usable.length < 4) return [];

  // Cap so the bank stays responsive while still covering many duas.
  const sample = usable.length > 120 ? usable.slice(0, 120) : usable;
  const translations = sample.map((item) => item.translation);
  const out: StudyMcq[] = [];

  for (const item of sample) {
    const card = buildMcq({
      id: `duas:meaning:${item.id}`,
      sourceId: "duas",
      prompt: `What is the meaning of the dua “${truncateText(item.title, 60)}”?`,
      correct: item.translation,
      distractorPool: translations,
      explanation: item.reference?.trim() || item.translation,
      categoryLabelKey: "flashCards.category.duas",
    });
    if (card) out.push(card);
  }

  return out;
}
