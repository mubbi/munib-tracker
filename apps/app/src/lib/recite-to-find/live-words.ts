import {
  alignPracticeWords,
  identityAlignment,
  splitAyahWords,
  studyIndexesFor,
} from "@/lib/quran-companion/align-words";

export type LiveAyahWords = {
  /** The bundled ayah text split into display words (never altered). */
  words: string[];
  /** Indexes into `words` the listener has heard so far. */
  heard: ReadonlySet<number>;
};

/**
 * Recite to find, live feedback: which words of the bundled ayah text the
 * listener has heard. The engine reports *engine* word indexes; they are
 * aligned onto the bundled words (§6 alignment) when the engine's word list is
 * known, else mapped 1:1 when both have the same count — otherwise nothing is
 * marked (never guess a word).
 */
export function liveAyahWords(
  arabic: string,
  engineWords: readonly string[],
  matched: readonly number[],
  totalWords: number,
): LiveAyahWords {
  const words = splitAyahWords(arabic);
  if (!words.length || !matched.length) return { words, heard: new Set() };
  const alignment = engineWords.length
    ? alignPracticeWords(arabic, words, engineWords)
    : totalWords === words.length
      ? identityAlignment(words.length)
      : null;
  if (!alignment) return { words, heard: new Set() };
  return { words, heard: new Set(studyIndexesFor(alignment, matched)) };
}
