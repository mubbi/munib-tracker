/**
 * Helpers so colored / nested Arabic runs still join as cursive words.
 *
 * React Native (esp. Android Fabric + RN web) shapes each nested `<Text>` span
 * in isolation when attribute runs change. Zero-width joiners restore the
 * joining context across color boundaries without changing visible glyphs.
 */

/** U+200D — signals the shaper to join across a span boundary. */
export const ARABIC_ZWJ = "\u200D";

/**
 * True when two adjacent tajweed segments belong to the same orthographic word
 * (no whitespace at the shared edge) and should therefore join.
 */
export function shouldJoinArabicSegments(left: string, right: string): boolean {
  if (!left || !right) return false;
  if (/\s$/u.test(left) || /^\s/u.test(right)) return false;
  return true;
}

/**
 * Returns display strings for each segment with a trailing ZWJ when the next
 * segment continues the same word — safe to render as separate nested Texts.
 */
export function withArabicJoiningZwj(texts: readonly string[]): string[] {
  return texts.map((text, index) => {
    const next = texts[index + 1];
    if (next !== undefined && shouldJoinArabicSegments(text, next)) {
      return `${text}${ARABIC_ZWJ}`;
    }
    return text;
  });
}
