import type { FiqhContentRef } from "../fiqh/differences";
import type { UdhiyahAnimal } from "../types/dhul-hijjah";

/**
 * Dhul-Hijjah mode content (NF-3.3, plan §NF-3.3 + §12 "Dhul-Hijjah").
 *
 * Ids and refs only — all copy is i18n (`dhulHijjah.*`). Each ref was checked
 * against the corpus the app renders and recorded in `docs/proofs/dhul-hijjah.md`
 * (D11). Musnad Ahmad is not in the bundled corpus, so the "increase tahlil,
 * takbir and tahmid" hadith is cited as a book ref with its differing gradings
 * (see the proof log) and never rendered as text.
 */

const q = (surah: number, ayahFrom: number, ayahTo?: number): FiqhContentRef =>
  ayahTo == null ? { kind: "quran", surah, ayahFrom } : { kind: "quran", surah, ayahFrom, ayahTo };

/** Evidence shown on the dashboard, in display order. */
export const DHUL_HIJJAH_EVIDENCE = {
  /** Deeds in the ten days are the most beloved (Ibn 'Abbas). */
  tenDaysVirtue: [{ kind: "hadith", collection: "bukhari", number: 969, grade: "sahih" }, q(89, 2)],
  /** Remember Allah on the appointed / known days. */
  remembrance: [q(22, 28), q(2, 203)],
  /** The best dua is the dua of the day of Arafah — gradings differ (proof log). */
  arafahDua: [{ kind: "hadith", collection: "tirmidhi", number: 3585, grade: "disputed" }],
  /** Fasting the day of Arafah (Abu Qatada). Corpus muslim:2746 = Abd al-Baqi 1162.01. */
  arafahFast: [
    { kind: "hadith", collection: "muslim", number: 2746, arabicNumber: "1162.01", grade: "sahih" },
  ],
  /** The days of Tashriq are days of eating, drinking (and remembering Allah). */
  tashriqDays: [
    { kind: "hadith", collection: "muslim", number: 2677, arabicNumber: "1141.01", grade: "sahih" },
    { kind: "hadith", collection: "muslim", number: 2678, arabicNumber: "1141.02", grade: "sahih" },
  ],
  /** Whoever intends to sacrifice: leave hair and nails in the ten. */
  hairNails: [
    { kind: "hadith", collection: "muslim", number: 5119, arabicNumber: "1977.03", grade: "sahih" },
  ],
} as const satisfies Record<string, readonly FiqhContentRef[]>;

/**
 * Musnad Ahmad 5446 (Ibn 'Umar): "increase in them the tahlil, takbir and
 * tahmid". Outside the bundled corpus — shown only as a citation with the
 * "gradings differ" label (Ahmad Shakir: sahih isnad; Dar al-Salam / al-Risalah
 * edition: sahih by its supports, this isnad weak for Yazid ibn Abi Ziyad).
 */
export const AHMAD_5446_CITATION = {
  collection: "ahmad",
  number: 5446,
  grade: "disputed",
} as const;

/** Daily deeds checklist on the ten-days dashboard. */
export type DhulHijjahDeedId = "fast" | "zikr" | "quran" | "sadaqah" | "qiyam";

export const DHUL_HIJJAH_DEEDS: readonly DhulHijjahDeedId[] = [
  "fast",
  "zikr",
  "quran",
  "sadaqah",
  "qiyam",
];

/**
 * Tahlil / takbir / tahmid counters for the ten days. Each is a NEW zikr id
 * (so its daily count is its own) whose text is drawn from an existing bundled
 * adhkar item — never typed. `target` is an app default the user can exceed;
 * the hadith says "increase" without a number.
 */
export const DHUL_HIJJAH_ZIKR = [
  { id: "dhul_hijjah-takbir", sourceId: "after_prayer-takbir", target: 100 },
  { id: "dhul_hijjah-tahlil", sourceId: "anytime-tahlil", target: 100 },
  { id: "dhul_hijjah-tahmid", sourceId: "after_prayer-tahmid", target: 100 },
] as const;

export type DhulHijjahZikrId = (typeof DHUL_HIJJAH_ZIKR)[number]["id"];

/**
 * Minimum ages most often stated for an udhiyah animal (D11: the proof log
 * records the per-school wording). `months` is the full-age minimum; `sheep`
 * also carries the majority's six-month allowance for a robust jadha'.
 */
export const UDHIYAH_MIN_AGE_MONTHS: Readonly<
  Record<"sheep" | "goat" | "cow" | "camel", { months: number; robustMonths?: number }>
> = {
  sheep: { months: 12, robustMonths: 6 },
  goat: { months: 12 },
  cow: { months: 24 },
  camel: { months: 60 },
};

/** Which age row an animal choice uses. */
export function udhiyahAgeRow(animal: UdhiyahAnimal): keyof typeof UDHIYAH_MIN_AGE_MONTHS {
  if (animal === "cow_share") return "cow";
  if (animal === "camel_share") return "camel";
  return animal;
}

/** A cow or camel may be shared by up to seven. */
export const UDHIYAH_MAX_SHARES = 7;
