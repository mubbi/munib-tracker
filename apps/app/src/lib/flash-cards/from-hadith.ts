import type { HadithItem } from "@munib-tracker/shared/types";

import { buildMcq, FLASH_OPTION_MAX } from "./mcq-helpers";
import type { StudyMcq } from "./types";

/** Drop the narrator preamble ("I heard the Messenger of Allah say: …") so the teaching leads. */
function teachingText(english: string): string {
  const text = english.replace(/\s+/g, " ").trim();
  const match = text.match(/^.{0,260}?\b(?:say|said|saying|says)\b[^"“:,]{0,40}[:,]\s*["“]?/i);
  const rest = match ? text.slice(match[0].length).trim() : text;
  return rest.length >= 30 ? rest.charAt(0).toUpperCase() + rest.slice(1) : text;
}

/**
 * Recognition cards from bundled Nawawi Forty — pick the matching teaching text.
 * Does not invent grades or tafsir.
 */
export function mcqsFromHadith(items: readonly HadithItem[]): StudyMcq[] {
  // Long narrations can't be shortened without losing meaning, so only keep hadith
  // whose teaching fits a flash card whole.
  const usable = items.filter((item) => {
    const length = teachingText(item.english).length;
    return length > 25 && length <= FLASH_OPTION_MAX;
  });
  if (usable.length < 4) return [];

  const openings = usable.map((item) => teachingText(item.english));
  const out: StudyMcq[] = [];

  for (const item of usable) {
    const opening = teachingText(item.english);
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
