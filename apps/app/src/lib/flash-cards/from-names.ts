import type { NameOfAllah } from "@munib-tracker/shared/types";

import { buildMcq } from "./mcq-helpers";
import type { StudyMcq } from "./types";

/** 99 Names: transliteration/Arabic → English translation. */
export function mcqsFromNames(names: readonly NameOfAllah[]): StudyMcq[] {
  if (names.length < 4) return [];

  const translations = names.map((n) => n.translation);
  const out: StudyMcq[] = [];

  for (const name of names) {
    if (!name.transliteration.trim() || !name.translation.trim()) continue;
    const card = buildMcq({
      id: `names:meaning:${name.id}`,
      sourceId: "names",
      prompt: `What does ${name.transliteration} (${name.arabic}) mean?`,
      correct: name.translation,
      distractorPool: translations,
      explanation: name.meaning?.trim() || name.translation,
      categoryLabelKey: "flashCards.category.names",
    });
    if (card) out.push(card);
  }

  return out;
}
