import { getLocalDateString } from "@munib-tracker/shared/utils";

import { resolveHadithItem } from "@/lib/prayer-info";
import { getBundledEdition, getSurahAyahs, getSurahByNumber } from "@/lib/quran";

/** Curated entries resolved from bundled Qur'an + hadith (never hand-written religious text). */
export type KhatmMotivationEntry =
  | { kind: "hadith"; id: string }
  | { kind: "quran"; surah: number; ayah: number }
  | { kind: "quote"; id: string };

export const KHATM_MOTIVATION_POOL: KhatmMotivationEntry[] = [
  { kind: "hadith", id: "riyad_assalihin:312" },
  { kind: "hadith", id: "riyad_assalihin:313" },
  { kind: "hadith", id: "riyad_assalihin:314" },
  { kind: "hadith", id: "riyad_assalihin:320" },
  { kind: "hadith", id: "riyad_assalihin:322" },
  { kind: "hadith", id: "riyad_assalihin:323" },
  { kind: "hadith", id: "riyad_assalihin:1370" },
  { kind: "quran", surah: 54, ayah: 17 },
  { kind: "quran", surah: 73, ayah: 4 },
  { kind: "quran", surah: 39, ayah: 23 },
  { kind: "quote", id: "steady" },
  { kind: "quote", id: "portion" },
  { kind: "quote", id: "return" },
];

export type ResolvedKhatmMotivation = {
  key: string;
  kind: KhatmMotivationEntry["kind"];
  arabic?: string;
  body: string;
  reference?: string;
};

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable daily seed so the card refreshes each calendar day. */
export function dayMotivationSeed(date: string = getLocalDateString()): number {
  let hash = 0;
  for (let i = 0; i < date.length; i += 1) {
    hash = (Math.imul(31, hash) + date.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function resolveQuran(surah: number, ayah: number): ResolvedKhatmMotivation | null {
  const meta = getSurahByNumber(surah);
  const ayahs = getSurahAyahs(surah);
  const item = ayahs[ayah - 1];
  if (!meta || !item) return null;

  const translation =
    getBundledEdition("en-pickthall", surah)[String(ayah)] ??
    getBundledEdition("en-transliteration", surah)[String(ayah)] ??
    "";

  return {
    key: `quran:${surah}:${ayah}`,
    kind: "quran",
    arabic: item.arabic,
    body: normalizeText(translation),
    reference: `${meta.nameTransliteration} ${surah}:${ayah}`,
  };
}

function resolveHadith(id: string): ResolvedKhatmMotivation | null {
  const item = resolveHadithItem(id);
  if (!item) return null;

  return {
    key: `hadith:${id}`,
    kind: "hadith",
    arabic: item.arabic ? normalizeText(item.arabic) : undefined,
    body: normalizeText(item.english),
    reference: item.reference,
  };
}

/** App copy only — motivational framing, not religious text. */
export function resolveKhatmQuote(
  id: string,
  t: (key: string) => string,
): ResolvedKhatmMotivation | null {
  const text = t(`khatm.motivationQuote.${id}.text`);
  if (!text || text === `khatm.motivationQuote.${id}.text`) return null;

  const source = t(`khatm.motivationQuote.${id}.source`);
  return {
    key: `quote:${id}`,
    kind: "quote",
    body: text,
    reference: source === `khatm.motivationQuote.${id}.source` ? undefined : source,
  };
}

export function resolveKhatmMotivationEntry(
  entry: KhatmMotivationEntry,
  t: (key: string) => string,
): ResolvedKhatmMotivation | null {
  switch (entry.kind) {
    case "hadith":
      return resolveHadith(entry.id);
    case "quran":
      return resolveQuran(entry.surah, entry.ayah);
    case "quote":
      return resolveKhatmQuote(entry.id, t);
    default:
      return null;
  }
}

/** Pick a motivation card; retries if an entry fails to resolve. */
export function pickKhatmMotivation(
  seed: number,
  t: (key: string) => string,
): ResolvedKhatmMotivation {
  const pool = KHATM_MOTIVATION_POOL;
  const rand = mulberry32(seed);
  const start = Math.floor(rand() * pool.length);

  for (let offset = 0; offset < pool.length; offset += 1) {
    const entry = pool[(start + offset) % pool.length];
    const resolved = resolveKhatmMotivationEntry(entry, t);
    if (resolved) return resolved;
  }

  return {
    key: "fallback",
    kind: "quote",
    body: t("khatm.motivationQuote.steady.text"),
    reference: t("khatm.motivationQuote.steady.source"),
  };
}
