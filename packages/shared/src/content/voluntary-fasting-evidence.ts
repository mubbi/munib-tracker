import type { FiqhContentRef } from "../fiqh/differences";
import type { VoluntaryFastKind } from "../types/fasting";

/**
 * Evidence for the voluntary fasting tracker (NF-3.2, plan §12). Every ref was
 * checked against the corpus the app renders (fawazahmed0 hadith-api) on
 * 2026-11-23 — see `docs/proofs/voluntary-fasting.md`. Hadith numbers are the
 * corpus `hadithnumber`; Sahih Muslim also carries its Abd al-Baqi number
 * (`arabicNumber`), since the corpus numbers Muslim sequentially.
 *
 * Only refs are stored here — the hadith text is always rendered from the
 * corpus, never typed (rule §2.1). UI copy lives in i18n
 * (`voluntaryFasting.evidence.*`).
 */

type HadithRef = Extract<FiqhContentRef, { kind: "hadith" }>;

const bukhari = (number: number): HadithRef => ({
  kind: "hadith",
  collection: "bukhari",
  number,
  grade: "sahih",
});
const muslim = (number: number, arabicNumber: string): HadithRef => ({
  kind: "hadith",
  collection: "muslim",
  number,
  arabicNumber,
  grade: "sahih",
});

/** Recommended kinds → their evidence. */
export const VOLUNTARY_FAST_EVIDENCE: Readonly<
  Partial<Record<VoluntaryFastKind, readonly FiqhContentRef[]>>
> = {
  // Deeds are presented on Monday and Thursday (Tirmidhi 747); Monday: "the day I was born" (Muslim 1162).
  monday: [
    { kind: "hadith", collection: "tirmidhi", number: 747, grade: "hasan" },
    muslim(2747, "1162.02"),
  ],
  thursday: [{ kind: "hadith", collection: "tirmidhi", number: 747, grade: "hasan" }],
  // Three days every month (Muslim 1162); the White Days guide (NF-2.37) carries its own refs.
  white_day: [muslim(2746, "1162.01")],
  shawwal_six: [muslim(2758, "1164.01")],
  arafah: [muslim(2746, "1162.01")],
  tasua: [muslim(2667, "1134.02")],
  ashura: [muslim(2746, "1162.01"), muslim(2667, "1134.02")],
  muharram: [muslim(2755, "1163.01")],
  shaban: [bukhari(1969)],
  // Abu Dawud 2437: graded sahih by al-Albani; 'A'ishah's report (Muslim 1176) differs — see the proof log.
  dhul_hijjah_nine: [
    { kind: "hadith", collection: "abudawud", number: 2437, grade: "disputed" },
    bukhari(969),
  ],
  dawud: [bukhari(1976), muslim(2746, "1162.01")],
};

/** Prohibited / disliked days → their evidence. */
export const VOLUNTARY_FAST_RESTRICTION_EVIDENCE = {
  eid: [bukhari(1990), muslim(2671, "1137")],
  tashriq: [muslim(2677, "1141.01")],
  fridayAlone: [bukhari(1985), muslim(2683, "1144.01"), muslim(2684, "1144.02")],
  beforeRamadan: [bukhari(1914)],
  dayOfDoubt: [
    { kind: "hadith", collection: "abudawud", number: 2334, grade: "disputed" },
    { kind: "hadith", collection: "tirmidhi", number: 686, grade: "disputed" },
  ],
  pilgrimArafah: [bukhari(1988)],
  afterMidShaban: [
    { kind: "hadith", collection: "abudawud", number: 2337, grade: "disputed" },
    { kind: "hadith", collection: "tirmidhi", number: 738, grade: "disputed" },
  ],
  hayd: [bukhari(304)],
  qazaInShaban: [bukhari(1950)],
} as const satisfies Record<string, readonly FiqhContentRef[]>;

export type VoluntaryFastRestrictionId = keyof typeof VOLUNTARY_FAST_RESTRICTION_EVIDENCE;

const COLLECTION_LABEL: Record<HadithRef["collection"], string> = {
  bukhari: "Sahih al-Bukhari",
  muslim: "Sahih Muslim",
  abudawud: "Sunan Abi Dawud",
  tirmidhi: "Jami' at-Tirmidhi",
  nasai: "Sunan an-Nasa'i",
  ibnmajah: "Sunan Ibn Majah",
};

/** Citation label, e.g. "Sahih Muslim 1162" (Muslim by its printed Abd al-Baqi number). */
export function fastingRefLabel(ref: FiqhContentRef): string {
  if (ref.kind === "quran") {
    return `Qur'an ${ref.surah}:${ref.ayahFrom}${ref.ayahTo ? `–${ref.ayahTo}` : ""}`;
  }
  if (ref.kind === "book") return ref.work;
  const printed = ref.arabicNumber ? ref.arabicNumber.split(".")[0] : String(ref.number);
  return `${COLLECTION_LABEL[ref.collection]} ${printed}`;
}
