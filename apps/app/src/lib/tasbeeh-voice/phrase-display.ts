import { phraseMatchText } from "./arabic-text";
import { phraseTokens } from "./phrase-tokens";
import { PHRASE_KEYS, type PhraseKey } from "./phrases";

/**
 * The catalog phrase a free-text Arabic counter (custom tasbeeh, durood) matches
 * exactly, after folding — so the model spotter (D24: switched off) could listen
 * for it. Any zikr can count hands-free by pauses or by a taught voice pattern
 * (D49); this only decides whether the spotter path applies.
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
