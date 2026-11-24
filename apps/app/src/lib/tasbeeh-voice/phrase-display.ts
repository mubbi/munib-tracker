import type { ZikrItem } from "@munib-tracker/shared/types";

import { arabicWords, phraseMatchText } from "./arabic-text";
import { phraseTokens } from "./phrase-tokens";
import { PHRASE_KEYS, type PhraseKey, VOICE_PHRASES } from "./phrases";

/**
 * What the listening chip shows for a phrase: the Arabic straight from the
 * dataset entry (a word slice for "La ilaha illallah"), plus the entry itself so
 * the caller can resolve its translation in the reader's language. When the
 * phrase is a slice, the entry's translation covers more than the phrase, so no
 * translation is offered (the phrase name label is shown instead).
 */
export type PhraseDisplay = {
  arabic: string;
  /** The whole entry, when the phrase IS the entry (translation applies). */
  item: ZikrItem | null;
};

export function phraseDisplay(
  phrase: PhraseKey,
  getZikr: (id: string) => ZikrItem | undefined,
): PhraseDisplay | null {
  const ref = VOICE_PHRASES[phrase].display;
  const item = getZikr(ref.id);
  if (!item) return null;
  if (!ref.words) return { arabic: item.arabic, item };
  return {
    arabic: arabicWords(item.arabic).slice(ref.words[0], ref.words[1]).join(" "),
    item: null,
  };
}

/**
 * The catalog phrase a free-text Arabic counter (custom tasbeeh) matches
 * exactly, after folding — so a custom counter of "SubhanAllah" can listen. A
 * custom phrase that is not in the catalog gets no voice counting in v1.
 */
export function phraseForArabic(arabic: string | null | undefined): PhraseKey | null {
  if (!arabic) return null;
  const text = phraseMatchText(arabic);
  if (!text) return null;
  const tokens = phraseTokens();
  for (const key of PHRASE_KEYS) {
    if (tokens.phrases[key].variants.some((variant) => variant.text === text)) return key;
  }
  return null;
}
