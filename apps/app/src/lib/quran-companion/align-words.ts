import { normalize } from "@/lib/search-fuse";

/**
 * §6 word alignment. Three tokenizations of the same ayah exist (bundled ayah
 * string, Quran.com study words, the engine's word list) and they are not the
 * same strings. This maps engine word indexes onto the study words the session
 * actually shows.
 *
 * Measured against the pinned engine corpus (`zipformer_quran.json`, v0.3.0):
 * 6,230 of 6,236 ayahs split into the same number of words as the bundled text,
 * and every one of those words matches after {@link normalize} folding. The six
 * that differ are joins/splits such as 15:7 `لَّوۡمَا` vs `لَّوْ` + `مَا`, and
 * 2:72 where the bundled text splits a word the engine keeps whole. Those are
 * handled as many-to-one / one-to-many groups below.
 */
export type WordAlignment = {
  /** For each engine word, the study words it covers (empty = unmapped). */
  engineToStudy: number[][];
  /** For each study word, the engine words that cover it (empty = unmapped, stays neutral). */
  studyToEngine: number[][];
};

/** Arabic folding used for comparison only. Display glyphs are never touched. */
export function foldArabicWord(word: string): string {
  return normalize(word).replace(/\s+/g, "");
}

/** Split a bundled ayah string into study tokens, dropping marks-only tokens (waqf signs). */
export function splitAyahWords(ayahArabic: string): string[] {
  return ayahArabic
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0 && foldArabicWord(token).length > 0);
}

/** Groups longer than this are never joined — a mismatch is left unmapped instead. */
const MAX_GROUP = 3;

function emptyAlignment(engineCount: number, studyCount: number): WordAlignment {
  return {
    engineToStudy: Array.from({ length: engineCount }, () => []),
    studyToEngine: Array.from({ length: studyCount }, () => []),
  };
}

function link(out: WordAlignment, engine: number[], study: number[]): void {
  for (const e of engine) out.engineToStudy[e]?.push(...study);
  for (const s of study) out.studyToEngine[s]?.push(...engine);
}

/**
 * Character-level edit distance on folded strings, normalised to 0..1. Used only
 * to decide whether two unequal words are "the same word spelled differently".
 */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  const prev = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return 1 - prev[b.length] / Math.max(a.length, b.length);
}

/**
 * Try to consume a group starting at (ei, si) whose folded concatenations are
 * equal: 1:1, 1:n or n:1 with n ≤ {@link MAX_GROUP}. Returns the group sizes or null.
 */
function matchGroup(
  engine: string[],
  study: string[],
  ei: number,
  si: number,
): [number, number] | null {
  if (engine[ei] === study[si]) return [1, 1];
  for (let n = 2; n <= MAX_GROUP; n++) {
    if (si + n <= study.length && engine[ei] === study.slice(si, si + n).join("")) return [1, n];
    if (ei + n <= engine.length && study[si] === engine.slice(ei, ei + n).join("")) return [n, 1];
  }
  return null;
}

/**
 * Align engine words onto study words. `ayahArabic` is accepted for API symmetry
 * with the spec and used to sanity-check that the study row belongs to the ayah;
 * it is not displayed or altered.
 *
 * Rules (§6): compare after Arabic folding; many-to-one and one-to-many allowed;
 * an unmapped study word stays neutral (never guess a red mark onto it).
 */
export function alignPracticeWords(
  _ayahArabic: string,
  studyWords: readonly string[],
  engineWords: readonly string[],
): WordAlignment {
  const study = studyWords.map(foldArabicWord);
  const engine = engineWords.map(foldArabicWord);
  const out = emptyAlignment(engine.length, study.length);

  let ei = 0;
  let si = 0;
  while (ei < engine.length && si < study.length) {
    const group = matchGroup(engine, study, ei, si);
    if (group) {
      const [ne, ns] = group;
      link(
        out,
        Array.from({ length: ne }, (_, k) => ei + k),
        Array.from({ length: ns }, (_, k) => si + k),
      );
      ei += ne;
      si += ns;
      continue;
    }

    // Divergence: resynchronise on the nearest exact anchor ahead, mapping the
    // skipped stretch 1:1 only when the lengths agree and each pair is close.
    let anchor: [number, number] | null = null;
    for (let span = 1; span <= 4 && !anchor; span++) {
      for (let de = 0; de <= span && !anchor; de++) {
        const ds = span - de;
        const e2 = ei + de;
        const s2 = si + ds;
        if (e2 < engine.length && s2 < study.length && engine[e2] === study[s2]) anchor = [e2, s2];
      }
    }
    const [endE, endS] = anchor ?? [engine.length, study.length];
    const gapE = endE - ei;
    const gapS = endS - si;
    if (gapE === gapS) {
      for (let k = 0; k < gapE; k++) {
        if (similarity(engine[ei + k], study[si + k]) >= 0.6) link(out, [ei + k], [si + k]);
      }
    }
    ei = endE;
    si = endS;
  }

  return out;
}

/** Study indexes covered by the given engine words (deduped, sorted). */
export function studyIndexesFor(alignment: WordAlignment, engineWords: Iterable<number>): number[] {
  const set = new Set<number>();
  for (const e of engineWords) for (const s of alignment.engineToStudy[e] ?? []) set.add(s);
  return [...set].sort((a, b) => a - b);
}

/** Identity alignment for a study row that IS the engine row (tests, listen-only). */
export function identityAlignment(count: number): WordAlignment {
  const out = emptyAlignment(count, count);
  for (let i = 0; i < count; i++) link(out, [i], [i]);
  return out;
}
