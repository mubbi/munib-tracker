import type { Surah } from "@munib-tracker/shared/types";

import { buildMcq } from "./mcq-helpers";
import type { StudyMcq } from "./types";

/** Surah meta recognition — ayah counts and revelation place from bundled meta. */
export function mcqsFromQuranMeta(surahs: readonly Surah[]): StudyMcq[] {
  if (surahs.length < 4) return [];

  const ayahCounts = [...new Set(surahs.map((s) => String(s.ayahCount)))];
  const out: StudyMcq[] = [];

  for (const surah of surahs) {
    const name = surah.nameTransliteration || surah.nameEnglish;
    const ayahCard = buildMcq({
      id: `quran:ayah-count:${surah.number}`,
      sourceId: "quran",
      prompt: `How many ayahs are in Surah ${name}?`,
      correct: String(surah.ayahCount),
      distractorPool: ayahCounts,
      explanation: `${surah.nameEnglish} (${name}) has ${surah.ayahCount} ayahs.`,
      categoryLabelKey: "flashCards.category.quran",
    });
    if (ayahCard) out.push(ayahCard);

    const placeCorrect = surah.revelationPlace === "makkah" ? "Makkah" : "Madinah";
    const placeCard = buildMcq({
      id: `quran:revelation:${surah.number}`,
      sourceId: "quran",
      prompt: `Where was Surah ${name} primarily revealed?`,
      correct: placeCorrect,
      distractorPool: ["Makkah", "Madinah", "Jerusalem", "Ta'if"],
      explanation: `Surah ${name} is classified as ${placeCorrect}i in the traditional mus'haf listing.`,
      categoryLabelKey: "flashCards.category.quran",
    });
    if (placeCard) out.push(placeCard);
  }

  return out;
}
