import {
  alignPracticeWords,
  foldArabicWord,
  splitAyahWords,
} from "@/lib/quran-companion/align-words";

import { buckwalterToArabic } from "./buckwalter";
import { encodeLocations, packLocation } from "./codec";
import { type QacWord, QacWordAssembler } from "./parse";

/** Bump when the persisted index shape changes (forces a rebuild from the cached file). */
export const ROOT_INDEX_VERSION = 1;

/**
 * The on-device root index (D22: built from the unmodified file, never shipped).
 * Persisted as a rebuildable cache under `DB_KEYS.quranRootIndex`, tagged with
 * the source hash; rebuilt only when that hash (or {@link ROOT_INDEX_VERSION}) changes.
 */
export type RootIndex = {
  v: number;
  sourceHash: string;
  /** Buckwalter root → Buckwalter lemma → packed occurrence list (codec.ts). */
  roots: Record<string, Record<string, string>>;
  /** Occurrences per root (stem segments carrying that `ROOT:`). */
  counts: Record<string, number>;
  /**
   * Folded Arabic whole-word form → its root(s), comma-separated; `""` when the
   * dataset gives the word no root (particles, pronouns, some proper nouns).
   */
  forms: Record<string, string>;
  /**
   * Corpus word → bundled study-word mapping, stored only for ayahs where it is
   * not the identity. Key `surah:ayah`; value per corpus word (1-based order):
   * `.`-joined study indexes (0-based), `;`-separated; empty = not aligned, so
   * that word is shown at ayah level.
   */
  align: Record<string, string>;
  stats: RootIndexStats;
};

export type RootIndexStats = {
  words: number;
  occurrences: number;
  roots: number;
  lemmas: number;
  ayahs: number;
  /** Ayahs whose word split differs from the bundled text (joins/splits) but fully maps. */
  adjustedAyahs: number;
  /** Corpus words that could not be placed on a bundled word (ayah-level fallback). */
  unalignedWords: number;
};

export type BuildProgress = { phase: "parse"; done: number; total: number };

export type BuildRootIndexOptions = {
  sourceHash: string;
  /** Bundled Arabic for a surah: ayah number (string) → text. */
  loadSurahArabic: (surah: number) => Promise<Record<string, string>> | Record<string, string>;
  /** Yield to the UI between chunks (runWhenIdle on device, a no-op in tests). */
  yieldToUi?: () => Promise<void>;
  onProgress?: (progress: BuildProgress) => void;
  /** Lines per chunk between yields. */
  chunkLines?: number;
  /** Optional report of each ayah's alignment (dev verify script). */
  onAyahAligned?: (report: AyahAlignmentReport) => void;
};

export type AyahAlignmentReport = {
  surah: number;
  ayah: number;
  corpusWords: string[];
  studyWords: string[];
  /** Per corpus word, the study indexes it maps to ([] = unaligned). */
  mapping: number[][];
};

const DEFAULT_CHUNK_LINES = 4000;

/** Encode a per-word mapping (see {@link RootIndex.align}). */
export function encodeAlignment(mapping: number[][]): string {
  return mapping.map((m) => m.join(".")).join(";");
}

export function decodeAlignment(encoded: string): number[][] {
  return encoded.split(";").map((part) => (part ? part.split(".").map(Number) : []));
}

function isIdentity(mapping: number[][], studyCount: number): boolean {
  if (mapping.length !== studyCount) return false;
  for (let i = 0; i < mapping.length; i++) {
    const m = mapping[i];
    if (m.length !== 1 || m[0] !== i) return false;
  }
  return true;
}

/**
 * Build the index from the verified, LF-normalised file. Cooperative: it
 * yields between line chunks so the UI keeps painting while it runs.
 */
export async function buildRootIndex(
  text: string,
  options: BuildRootIndexOptions,
): Promise<RootIndex> {
  const yieldToUi = options.yieldToUi ?? (async () => {});
  const chunk = options.chunkLines ?? DEFAULT_CHUNK_LINES;
  const lines = text.split("\n");
  const assembler = new QacWordAssembler();

  const roots = new Map<string, Map<string, number[]>>();
  const forms = new Map<string, Set<string>>();
  const align: Record<string, string> = {};
  const stats: RootIndexStats = {
    words: 0,
    occurrences: 0,
    roots: 0,
    lemmas: 0,
    ayahs: 0,
    adjustedAyahs: 0,
    unalignedWords: 0,
  };

  let arabicSurah = -1;
  let arabic: Record<string, string> = {};
  let ayahWords: QacWord[] = [];

  const flushAyah = async () => {
    if (!ayahWords.length) return;
    const { surah, ayah } = ayahWords[0];
    if (surah !== arabicSurah) {
      arabic = await options.loadSurahArabic(surah);
      arabicSurah = surah;
    }
    const corpusWords = ayahWords.map((w) => buckwalterToArabic(w.form));
    const studyWords = splitAyahWords(arabic[String(ayah)] ?? "");
    const mapping = alignPracticeWords("", studyWords, corpusWords).engineToStudy;
    stats.ayahs++;
    for (const m of mapping) if (!m.length) stats.unalignedWords++;
    if (!isIdentity(mapping, studyWords.length)) {
      align[`${surah}:${ayah}`] = encodeAlignment(mapping);
      if (mapping.every((m) => m.length > 0)) stats.adjustedAyahs++;
    }
    options.onAyahAligned?.({ surah, ayah, corpusWords, studyWords, mapping });
    ayahWords = [];
  };

  const addWord = async (word: QacWord) => {
    const prev = ayahWords[0];
    if (prev && (prev.surah !== word.surah || prev.ayah !== word.ayah)) await flushAyah();
    ayahWords.push(word);
    stats.words++;

    const folded = foldArabicWord(buckwalterToArabic(word.form));
    let formRoots = forms.get(folded);
    if (!formRoots) {
      formRoots = new Set();
      forms.set(folded, formRoots);
    }
    const code = packLocation(word.surah, word.ayah, word.word);
    for (const stem of word.stems) {
      if (!stem.root) continue;
      formRoots.add(stem.root);
      let lemmas = roots.get(stem.root);
      if (!lemmas) {
        lemmas = new Map();
        roots.set(stem.root, lemmas);
      }
      const lemma = stem.lemma ?? "";
      let list = lemmas.get(lemma);
      if (!list) {
        list = [];
        lemmas.set(lemma, list);
      }
      list.push(code);
      stats.occurrences++;
    }
  };

  for (let start = 0; start < lines.length; start += chunk) {
    const end = Math.min(lines.length, start + chunk);
    for (let i = start; i < end; i++) {
      const done = assembler.push(lines[i]);
      if (done) await addWord(done);
    }
    options.onProgress?.({ phase: "parse", done: end, total: lines.length });
    await yieldToUi();
  }
  const last = assembler.finish();
  if (last) await addWord(last);
  await flushAyah();

  const outRoots: RootIndex["roots"] = {};
  const counts: RootIndex["counts"] = {};
  for (const [root, lemmas] of roots) {
    const outLemmas: Record<string, string> = {};
    let count = 0;
    for (const [lemma, codes] of lemmas) {
      outLemmas[lemma] = encodeLocations(codes);
      count += codes.length;
      stats.lemmas++;
    }
    outRoots[root] = outLemmas;
    counts[root] = count;
  }
  stats.roots = roots.size;

  const outForms: RootIndex["forms"] = {};
  for (const [form, set] of forms) {
    if (form) outForms[form] = [...set].sort().join(",");
  }

  return {
    v: ROOT_INDEX_VERSION,
    sourceHash: options.sourceHash,
    roots: outRoots,
    counts,
    forms: outForms,
    align,
    stats,
  };
}

/** True when a persisted index can be reused for this source file. */
export function isRootIndexCurrent(index: RootIndex | null, sourceHash: string): boolean {
  return Boolean(index && index.v === ROOT_INDEX_VERSION && index.sourceHash === sourceHash);
}
