/**
 * Citation verification protocol for Learn educational modules.
 *
 * Goiqrah (and similar sites) are gap checklists only — never copy their prose.
 *
 * Include a claim only when:
 * 1. Qur'an — surah:ayah is correct against standard Uthmani ayah numbering.
 * 2. Hadith — collection + number (or well-known graded narration) is checkable
 *    (e.g. sunnah.com / standard editions). Prefer sahih/hasan; label grades.
 * 3. Biography / early history — classical seerah (Ibn Hisham, Tabari, Ibn Kathir)
 *    for narrative; do not invent dates or miracles.
 * 4. Fiqh differences — label madhhab when presenting school-specific practice.
 *
 * Skip or rewrite when:
 * - Only unsourced popular paraphrase exists
 * - Folk practices (e.g. olive-oil ruqyah steps) lack authentic basis
 * - Modern/political history lacks primary sourcing (out of early-history scope)
 * - Fund screener / compliance ratings (product out of scope)
 *
 * Scripture *translations* of Arabic ritual text stay OSS via the app resolvers —
 * never AI-generate verse/hadith meaning bodies in i18n JSON or overlays.
 *
 * ── Evidence register (plan §12, D11) ──────────────────────────────────────
 * Every Qur'an / hadith ref a feature renders BY REFERENCE is recorded as an
 * {@link EvidenceRegistryEntry}: the shared catalogs are collected in
 * `content/evidence-registry.ts` (`SHARED_EVIDENCE_REGISTRY`), and the app's
 * evidence cards are added by `apps/app/src/lib/evidence-registry.test.ts`.
 * That test resolves every ref against the BUNDLED corpus where the collection
 * is bundled (Qur'an, Nawawi 40, Riyad as-Salihin) and applies the format /
 * known-range check below to remote collections, so a typo'd ref fails CI.
 */

export const CONTENT_VERIFICATION_PROTOCOL_VERSION = 2;

/** A ref the app renders by reference, normalised for verification. */
export type VerifiableRef =
  | { kind: "quran"; surah: number; ayah: number; ayahTo?: number }
  /** `number` is the corpus number the app's reader uses (not the printed one for Muslim). */
  | { kind: "hadith"; collection: string; number: number };

export interface EvidenceRegistryEntry {
  ref: VerifiableRef;
  /** Where it is rendered (catalog row, feature evidence card…). */
  source: string;
  /**
   * Proof log(s) that record it (`docs/proofs/<feature>.md`); the ref must appear
   * in at least one. Empty for older bundled-corpus pools with no proof log.
   */
  proofs: readonly string[];
}

/** Hadith collections bundled with the app (`apps/app/assets/data/hadith/`): ids resolve offline. */
export const BUNDLED_HADITH_COLLECTIONS = ["nawawi40", "riyad_assalihin"] as const;

/**
 * Remote collections (fawazahmed0/hadith-api@1, loaded cache-first) → highest
 * corpus number (`info.json` section details, checked 2026-11-24). Refs into
 * these get a format + known-range check only; the proof logs record the text.
 */
export const REMOTE_HADITH_MAX_NUMBER = {
  bukhari: 7563,
  muslim: 7563,
  abudawud: 5274,
  tirmidhi: 3956,
  nasai: 5758,
  ibnmajah: 4341,
} as const;

/** Surahs and the longest surah's ayah count — a format check; the app test checks the corpus. */
const SURAH_COUNT = 114;
const MAX_AYAH = 286;

const isPositiveInt = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n) && n > 0;

/** `quran:2:255`, `bukhari:6464`, `riyad_assalihin:312` → a normalised ref (null if malformed). */
export function parseCorpusId(id: string): VerifiableRef | null {
  const parts = id.split(":");
  if (parts[0] === "quran" && parts.length === 3) {
    const surah = Number(parts[1]);
    const ayah = Number(parts[2]);
    return isPositiveInt(surah) && isPositiveInt(ayah) ? { kind: "quran", surah, ayah } : null;
  }
  if (parts.length !== 2 || !parts[0] || !/^\d+$/.test(parts[1] ?? "")) return null;
  return { kind: "hadith", collection: parts[0], number: Number(parts[1]) };
}

/** Stable key for a ref (`quran:4:11`, `quran:23:1-2`, `bukhari:6464`). */
export function refKey(ref: VerifiableRef): string {
  if (ref.kind === "quran") {
    const to = ref.ayahTo != null && ref.ayahTo !== ref.ayah ? `-${ref.ayahTo}` : "";
    return `quran:${ref.surah}:${ref.ayah}${to}`;
  }
  return `${ref.collection}:${ref.number}`;
}

/** Why a ref is malformed / out of the known range, or null when it passes the format check. */
export function refFormatIssue(ref: VerifiableRef): string | null {
  if (ref.kind === "quran") {
    if (!isPositiveInt(ref.surah) || ref.surah > SURAH_COUNT) return "surah out of range";
    if (!isPositiveInt(ref.ayah) || ref.ayah > MAX_AYAH) return "ayah out of range";
    if (ref.ayahTo != null && (!isPositiveInt(ref.ayahTo) || ref.ayahTo < ref.ayah)) {
      return "ayah range reversed";
    }
    return null;
  }
  if (!isPositiveInt(ref.number)) return "hadith number is not a positive integer";
  if ((BUNDLED_HADITH_COLLECTIONS as readonly string[]).includes(ref.collection)) return null;
  const max = (REMOTE_HADITH_MAX_NUMBER as Record<string, number>)[ref.collection];
  if (max == null) return `unknown hadith collection "${ref.collection}"`;
  if (ref.number > max) return `${ref.collection} has no hadith ${ref.number} (max ${max})`;
  return null;
}

export function isBundledHadithCollection(collection: string): boolean {
  return (BUNDLED_HADITH_COLLECTIONS as readonly string[]).includes(collection);
}
