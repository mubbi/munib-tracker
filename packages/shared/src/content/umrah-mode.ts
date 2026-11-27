import type { FiqhContentRef, FiqhDifferenceId } from "../fiqh/differences";
import type { UmrahStep } from "../types/umrah";

/**
 * Umrah mode content (NF-3.4). Ids and refs only — every line of copy is i18n
 * (`umrahMode.*`) and the guide prose stays in `hajj-guide.ts` (each step links
 * its topic). Duas are referenced by their id in the bundled Hisnul Muslim
 * dataset (`duas.ts`) and rendered from it, never typed. Every ref was checked
 * against the corpus the app renders — `docs/proofs/umrah-mode.md` (D11).
 *
 * Muslim refs carry the corpus number plus the Abd al-Baqi number cited in print.
 */

const q = (surah: number, ayahFrom: number): FiqhContentRef => ({
  kind: "quran",
  surah,
  ayahFrom,
});

export interface UmrahStepContent {
  step: UmrahStep;
  /** Bundled dua ids (`DUA_ITEMS`) shown on the step, in order. */
  duaIds: readonly string[];
  /** Evidence line under the step. */
  evidence: readonly FiqhContentRef[];
  /** `hajj-guide.ts` topic opened by "Read the guide" (`/hajj/[topic]`). */
  guideTopicId?: string;
  /** Labelled fiqh differences rendered with `<MadhhabNote>`. */
  differenceIds?: readonly FiqhDifferenceId[];
}

/** Bundled dua ids (Hisnul Muslim numbering in `duas.ts`). */
export const UMRAH_DUA_IDS = {
  /** The talbiyah (Bukhari 1549, Muslim 1184) — with recorded audio. */
  talbiyah: "hisn-233",
  /** Takbir passing the Black Stone (Bukhari 1613). */
  blackStoneTakbir: "hisn-234",
  /** Between the Yemeni corner and the Black Stone (Abu Dawud 1892; Qur'an 2:201). */
  yemeniCorner: "hisn-235",
  /** At Safa and Marwah (Muslim 1218). */
  safaMarwah: "hisn-236",
  /** Upon entering the masjid. */
  enterMasjid: "hisn-20",
} as const;

/** Evidence groups reused by the step cards and the hayd / doubt cards. */
export const UMRAH_EVIDENCE = {
  umrahVirtue: [
    { kind: "hadith", collection: "bukhari", number: 1773, grade: "sahih" },
    { kind: "hadith", collection: "muslim", number: 3289, arabicNumber: "1349.01", grade: "sahih" },
  ],
  miqat: [{ kind: "hadith", collection: "bukhari", number: 1524, grade: "sahih" }],
  talbiyah: [
    { kind: "hadith", collection: "bukhari", number: 1549, grade: "sahih" },
    { kind: "hadith", collection: "muslim", number: 2811, arabicNumber: "1184.01", grade: "sahih" },
  ],
  /** Jabir's description: seven circuits, Maqam Ibrahim, Safa first, last course at Marwah. */
  jabir: [
    { kind: "hadith", collection: "muslim", number: 2951, arabicNumber: "1218.01", grade: "sahih" },
  ],
  tawaf: [
    { kind: "hadith", collection: "bukhari", number: 1613, grade: "sahih" },
    { kind: "hadith", collection: "abudawud", number: 1892, grade: "hasan" },
    { kind: "hadith", collection: "tirmidhi", number: 960, grade: "sahih" },
  ],
  /** "Build on what you are sure of" — the salah rule scholars apply to tawaf (al-Mughni). */
  doubt: [
    { kind: "hadith", collection: "muslim", number: 1272, arabicNumber: "571.01", grade: "sahih" },
    { kind: "book", work: "mughni" },
  ],
  /** Hayd: everything except tawaf until pure; sa'i waits for tawaf. */
  hayd: [
    { kind: "hadith", collection: "bukhari", number: 305, grade: "sahih" },
    { kind: "hadith", collection: "bukhari", number: 1650, grade: "sahih" },
  ],
  maqam: [q(2, 125)],
  sai: [q(2, 158)],
  halq: [
    { kind: "hadith", collection: "bukhari", number: 1727, grade: "sahih" },
    { kind: "hadith", collection: "abudawud", number: 1984, grade: "hasan" },
  ],
} as const satisfies Record<string, readonly FiqhContentRef[]>;

export const UMRAH_STEP_CONTENT: Readonly<Record<UmrahStep, UmrahStepContent>> = {
  prepare: {
    step: "prepare",
    duaIds: [],
    evidence: UMRAH_EVIDENCE.umrahVirtue,
    guideTopicId: "prep-packing",
  },
  miqat: {
    step: "miqat",
    duaIds: [],
    evidence: UMRAH_EVIDENCE.miqat,
    guideTopicId: "miqats",
  },
  ihram: {
    step: "ihram",
    duaIds: [],
    evidence: UMRAH_EVIDENCE.miqat,
    guideTopicId: "entering-ihram",
  },
  talbiyah: {
    step: "talbiyah",
    duaIds: [UMRAH_DUA_IDS.talbiyah],
    evidence: UMRAH_EVIDENCE.talbiyah,
    guideTopicId: "umrah-ihram-talbiyah",
  },
  arrive_haram: {
    step: "arrive_haram",
    duaIds: [UMRAH_DUA_IDS.enterMasjid],
    evidence: [],
    guideTopicId: "prep-sites",
  },
  tawaf: {
    step: "tawaf",
    duaIds: [UMRAH_DUA_IDS.blackStoneTakbir, UMRAH_DUA_IDS.yemeniCorner],
    evidence: UMRAH_EVIDENCE.tawaf,
    guideTopicId: "umrah-tawaf",
    differenceIds: ["tawaf.wudu"],
  },
  two_rakah_behind_maqam: {
    step: "two_rakah_behind_maqam",
    duaIds: [],
    evidence: [...UMRAH_EVIDENCE.maqam, ...UMRAH_EVIDENCE.jabir],
    guideTopicId: "umrah-maqam-zamzam",
  },
  zamzam: {
    step: "zamzam",
    duaIds: [],
    evidence: [],
    guideTopicId: "umrah-maqam-zamzam",
  },
  sai: {
    step: "sai",
    duaIds: [UMRAH_DUA_IDS.safaMarwah],
    evidence: [...UMRAH_EVIDENCE.sai, ...UMRAH_EVIDENCE.jabir],
    guideTopicId: "umrah-sai",
  },
  halq_taqsir: {
    step: "halq_taqsir",
    duaIds: [],
    evidence: UMRAH_EVIDENCE.halq,
    guideTopicId: "umrah-halq",
  },
  complete: {
    step: "complete",
    duaIds: [],
    evidence: UMRAH_EVIDENCE.umrahVirtue,
  },
};

/** Miqat ids in the bundled dataset, in the order Bukhari 1524 lists them. */
export const MIQAT_IDS = [
  "dhul_hulayfah",
  "al_juhfah",
  "qarn_al_manazil",
  "yalamlam",
  "dhat_irq",
] as const;
