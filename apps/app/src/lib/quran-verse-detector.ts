import { getSurahByNumber, getSurahMeta } from "@/lib/quran-meta";
import { parseReference } from "@/lib/reference-link";
import { ensureAyahFuse, normalize, searchQuranAyahs, tokenize } from "@/lib/search";

/** Bundled translation used for English verse matching (same as Qur'an search). */
const DETECTOR_TRANSLATION_EDITION = "en-pickthall";

let quranModuleForTests: typeof import("@/lib/quran") | undefined;

/** Jest-only: inject the Qur'an module so dynamic `import()` is not required in tests. */
export function __setQuranModuleForDetectorTests(mod: typeof import("@/lib/quran")): void {
  quranModuleForTests = mod;
}

async function getQuranModule(): Promise<typeof import("@/lib/quran")> {
  return quranModuleForTests ?? import("@/lib/quran");
}

export type VerseDetectorLang = "ar" | "en";
export type VerseMatchKind = "reference" | "alias" | "substring" | "fuzzy";

export interface VerseDetectionHit {
  surah: number;
  ayah: number;
  surahName: string;
  surahNameEnglish: string;
  /** Well-known name when the hit was resolved via an alias (e.g. Ayat al-Kursi). */
  popularName?: string;
  arabic: string;
  translation: string;
  transliteration: string;
  confidence: number;
  matchKind: VerseMatchKind;
  /** Original query that produced this hit — used for result highlighting. */
  query: string;
}

export type HighlightSegment = { text: string; matched: boolean; start: number };

/**
 * Well-known verse names that should resolve directly (presets + typed aliases).
 * Needles are stored pre-normalized so hyphen/diacritic folding stays in sync.
 */
const VERSE_ALIASES: Array<{
  needles: string[];
  surah: number;
  ayah: number;
  label: string;
}> = [
  {
    needles: [
      normalize("Ayat al-Kursi"),
      normalize("Ayatul Kursi"),
      normalize("Ayat al Kursi"),
      normalize("آية الكرسي"),
    ],
    surah: 2,
    ayah: 255,
    label: "Ayat al-Kursi",
  },
  {
    needles: [
      normalize("Al-Fatihah"),
      normalize("Al Fatihah"),
      normalize("Al-Fatiha"),
      normalize("الفاتحة"),
    ],
    surah: 1,
    ayah: 1,
    label: "Al-Fatihah",
  },
  {
    needles: [
      normalize("Al-Ikhlas"),
      normalize("Al Ikhlas"),
      normalize("Surah Ikhlas"),
      normalize("الإخلاص"),
      normalize("الاخلاص"),
    ],
    surah: 112,
    ayah: 1,
    label: "Al-Ikhlas",
  },
];

const ARABIC_SCRIPT = /[\u0600-\u06FF\u0750-\u077F]/;

/** Infer whether the snippet is Arabic or English/Latin from its characters. */
export function detectVerseInputLang(text: string): VerseDetectorLang {
  const sample = text.slice(0, 240);
  let arabic = 0;
  let latin = 0;
  for (const ch of sample) {
    if (ARABIC_SCRIPT.test(ch)) arabic += 1;
    else if (/[a-zA-Z]/.test(ch)) latin += 1;
  }
  return arabic >= latin && arabic > 0 ? "ar" : "en";
}

/**
 * Confidence for an exact (normalized) substring hit.
 * Long verses like Ayat al-Kursi must not look like weak matches just because
 * the snippet is shorter than the full ayah.
 */
function substringConfidence(normInput: string, normField: string): number {
  if (!normField.includes(normInput)) return 0;
  if (normField === normInput) return 1;
  if (normField.startsWith(normInput)) return 0.98;
  if (normField.endsWith(normInput)) return 0.96;
  const ratio = normInput.length / Math.max(normField.length, 1);
  return Math.min(0.95, 0.88 + ratio * 0.07);
}

function keyFor(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

function validAyah(surah: number, ayah: number): boolean {
  const meta = getSurahByNumber(surah);
  return Boolean(meta && ayah >= 1 && ayah <= meta.ayahCount);
}

/** Parse compact references like `2:255` or `Surah 2 Ayah 255`. */
function parseBareVerseReference(input: string): { surah: number; ayah: number } | null {
  const trimmed = input.trim();

  const colon = trimmed.match(/^(\d{1,3})\s*[:：]\s*(\d{1,3})$/);
  if (colon) {
    const surah = Number(colon[1]);
    const ayah = Number(colon[2]);
    return validAyah(surah, ayah) ? { surah, ayah } : null;
  }

  const numbered = trimmed.match(
    /^(?:surah|sura|qs\.?|سورة)\s*(\d{1,3})\s*(?:ayah|verse|aya|آية)?\s*(\d{1,3})$/iu,
  );
  if (numbered) {
    const surah = Number(numbered[1]);
    const ayah = Number(numbered[2]);
    return validAyah(surah, ayah) ? { surah, ayah } : null;
  }

  return null;
}

function parseReferenceHit(input: string): { surah: number; ayah: number } | null {
  const fromLabel = parseReference(input);
  if (fromLabel?.kind === "quran") {
    return { surah: fromLabel.surah, ayah: fromLabel.ayah };
  }
  return parseBareVerseReference(input);
}

function parseAliasHit(input: string): { surah: number; ayah: number; label: string } | null {
  const folded = normalize(input);
  if (!folded) return null;
  for (const alias of VERSE_ALIASES) {
    if (alias.needles.some((needle) => folded === needle || folded.includes(needle))) {
      return { surah: alias.surah, ayah: alias.ayah, label: alias.label };
    }
  }
  return null;
}

async function loadAyahHit(
  surah: number,
  ayah: number,
  matchKind: VerseMatchKind,
  confidence: number,
  query: string,
  popularName?: string,
): Promise<VerseDetectionHit | null> {
  const meta = getSurahByNumber(surah);
  if (!meta) return null;
  const quran = await getQuranModule();
  const ayahs = quran.getSurahAyahs(surah);
  const arabic = ayahs[ayah - 1]?.arabic ?? "";
  const translation =
    quran.getBundledEdition(DETECTOR_TRANSLATION_EDITION, surah)[String(ayah)] ?? "";
  const transliteration = quran.getTransliteration(surah)[String(ayah)] ?? "";
  return {
    surah,
    ayah,
    surahName: meta.nameTransliteration,
    surahNameEnglish: meta.nameEnglish,
    popularName,
    arabic,
    translation,
    transliteration,
    confidence,
    matchKind,
    query,
  };
}

/**
 * Build a normalized string alongside an index map back into `original`, so a
 * match found on the folded form can highlight the live display text.
 */
function normalizeWithMap(original: string): { norm: string; map: number[] } {
  const map: number[] = [];
  let norm = "";
  for (let i = 0; i < original.length; i += 1) {
    const piece = normalize(original[i] ?? "");
    if (!piece) continue;
    for (const ch of piece) {
      // Collapse runs of spaces in the map the same way normalize() collapses separators.
      if (ch === " " && norm.endsWith(" ")) continue;
      norm += ch;
      map.push(i);
    }
  }
  return { norm: norm.trim(), map };
}

/**
 * Split `text` into matched / unmatched segments for the given query.
 * Prefers a contiguous phrase match; falls back to highlighting query tokens.
 */
export function segmentHighlightedText(text: string, query: string): HighlightSegment[] {
  if (!text) return [];
  const q = query.trim();
  if (!q) return [{ text, matched: false, start: 0 }];

  const { norm: hayNorm, map } = normalizeWithMap(text);
  const needle = normalize(q);
  if (!needle || !hayNorm) return [{ text, matched: false, start: 0 }];

  const ranges: Array<{ start: number; end: number }> = [];

  const phraseAt = hayNorm.indexOf(needle);
  if (phraseAt >= 0 && map.length > 0) {
    const start = map[phraseAt] ?? 0;
    const endIdx = map[Math.min(phraseAt + needle.length - 1, map.length - 1)] ?? start;
    ranges.push({ start, end: endIdx + 1 });
  } else {
    const tokens = tokenize(q).filter((token) => token.length >= 3);
    for (const token of tokens) {
      let from = 0;
      while (from < hayNorm.length) {
        const at = hayNorm.indexOf(token, from);
        if (at < 0) break;
        const start = map[at] ?? 0;
        const endIdx = map[Math.min(at + token.length - 1, map.length - 1)] ?? start;
        ranges.push({ start, end: endIdx + 1 });
        from = at + token.length;
      }
    }
  }

  if (ranges.length === 0) return [{ text, matched: false, start: 0 }];

  ranges.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const range of merged) {
    if (range.start > cursor) {
      segments.push({ text: text.slice(cursor, range.start), matched: false, start: cursor });
    }
    segments.push({ text: text.slice(range.start, range.end), matched: true, start: range.start });
    cursor = range.end;
  }
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), matched: false, start: cursor });
  }
  return segments.filter((segment) => segment.text.length > 0);
}

async function scanSubstringMatches(
  rawInput: string,
  lang: VerseDetectorLang,
  limit: number,
): Promise<VerseDetectionHit[]> {
  const normInput = normalize(rawInput);
  const compactLen = normInput.replace(/\s/g, "").length;
  const minLen = lang === "ar" ? 4 : 8;
  if (compactLen < minLen) return [];

  const quran = await getQuranModule();
  const hits: VerseDetectionHit[] = [];

  for (const surah of getSurahMeta()) {
    const translation = quran.getBundledEdition(DETECTOR_TRANSLATION_EDITION, surah.number);
    const transliteration = quran.getTransliteration(surah.number);
    const ayahs = quran.getSurahAyahs(surah.number);

    for (let ayah = 1; ayah <= surah.ayahCount; ayah += 1) {
      const arabic = ayahs[ayah - 1]?.arabic ?? "";
      const trans = translation[String(ayah)] ?? "";
      const translit = transliteration[String(ayah)] ?? "";

      const candidates =
        lang === "ar" ? [normalize(arabic)] : [normalize(trans), normalize(translit)];

      let best = 0;
      for (const field of candidates) {
        if (!field || field.replace(/\s/g, "").length < minLen) continue;
        if (!field.includes(normInput)) continue;
        best = Math.max(best, substringConfidence(normInput, field));
      }
      if (best <= 0) continue;

      hits.push({
        surah: surah.number,
        ayah,
        surahName: surah.nameTransliteration,
        surahNameEnglish: surah.nameEnglish,
        arabic,
        translation: trans,
        transliteration: translit,
        confidence: best,
        matchKind: "substring",
        query: rawInput,
      });
    }
  }

  hits.sort((a, b) => b.confidence - a.confidence);
  return hits.slice(0, limit);
}

function mergeHits(ordered: VerseDetectionHit[], limit: number): VerseDetectionHit[] {
  const seen = new Set<string>();
  const merged: VerseDetectionHit[] = [];
  const ranked = [...ordered].sort((a, b) => b.confidence - a.confidence);
  for (const hit of ranked) {
    const key = keyFor(hit.surah, hit.ayah);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(hit);
    if (merged.length >= limit) break;
  }
  return merged;
}

export type DetectQuranVersesOptions = {
  /** Bias matching toward Arabic or English fields; auto-detected when omitted. */
  lang?: VerseDetectorLang;
  limit?: number;
};

/**
 * Detect Qur'an ayahs from a spoken or typed snippet (Arabic or English).
 * Combines aliases, citation parsing, substring matching, and fuzzy search.
 */
export async function detectQuranVerses(
  input: string,
  options: DetectQuranVersesOptions = {},
): Promise<VerseDetectionHit[]> {
  const trimmed = input.trim();
  if (trimmed.length < 3) return [];

  const limit = options.limit ?? 8;
  const lang = options.lang ?? detectVerseInputLang(trimmed);

  const alias = parseAliasHit(trimmed);
  if (alias) {
    const hit = await loadAyahHit(alias.surah, alias.ayah, "alias", 1, trimmed, alias.label);
    return hit ? [hit] : [];
  }

  const reference = parseReferenceHit(trimmed);
  if (reference) {
    const hit = await loadAyahHit(reference.surah, reference.ayah, "reference", 1, trimmed);
    return hit ? [hit] : [];
  }

  await ensureAyahFuse();

  const [substringHits, fuzzyGroup] = await Promise.all([
    scanSubstringMatches(trimmed, lang, limit),
    Promise.resolve(searchQuranAyahs(trimmed, limit)),
  ]);

  const fuzzyHits: VerseDetectionHit[] = [];
  fuzzyGroup.results.forEach((result, index) => {
    const surah = Number(result.params?.surah);
    const ayah = Number(result.params?.ayah);
    if (!validAyah(surah, ayah)) return;
    const meta = getSurahByNumber(surah);
    if (!meta) return;
    fuzzyHits.push({
      surah,
      ayah,
      surahName: meta.nameTransliteration,
      surahNameEnglish: meta.nameEnglish,
      arabic: result.arabic ?? "",
      translation: result.subtitle ?? "",
      transliteration: "",
      // Fuzzy ranks below exact substring / alias hits.
      confidence: Math.max(0.4, 0.72 - index * 0.04),
      matchKind: "fuzzy",
      query: trimmed,
    });
  });

  if (fuzzyHits.some((hit) => !hit.transliteration)) {
    const quran = await getQuranModule();
    for (const hit of fuzzyHits) {
      if (hit.transliteration) continue;
      hit.transliteration = quran.getTransliteration(hit.surah)[String(hit.ayah)] ?? "";
    }
  }

  // Attach popular names when a hit coincides with a known verse.
  const merged = mergeHits([...substringHits, ...fuzzyHits], limit);
  for (const hit of merged) {
    if (hit.popularName) continue;
    const known = VERSE_ALIASES.find(
      (alias) => alias.surah === hit.surah && alias.ayah === hit.ayah,
    );
    if (known) hit.popularName = known.label;
  }
  return merged;
}
