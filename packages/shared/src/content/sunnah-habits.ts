import type { FiqhContentRef } from "../fiqh/differences";

/**
 * Daily Sunnah habits catalog (NF-3.5, plan §NF-3.5 + §12 "Sunnah habits").
 *
 * Titles and hints are i18n keys (`sunnahHabits.items.<id>.*`); this module only
 * carries stable ids, kinds and evidence refs. Every ref was checked against the
 * corpus the app renders and is recorded in `docs/proofs/sunnah-habits.md` (D11):
 * Qur'an against `assets/data/quran`, hadith against fawazahmed0/hadith-api
 * (`hadithnumber`). Sahih Muslim refs keep both the corpus number and the
 * Abd al-Baqi number (`arabicNumber`), which is what print editions cite.
 */

/** Where a habit's evidence lives when it is a whole bundled dataset rather than one ref. */
export type SunnahDatasetRef = { kind: "dataset"; dataset: "duroods" | "adhkar" };

export type SunnahHabitRef = FiqhContentRef | SunnahDatasetRef;

/**
 * `binary` — done / not done; `count` — a daily number with a target;
 * `linked` — derived from another store (never stored here).
 */
export type SunnahHabitKind = "binary" | "count" | "linked";

/**
 * Store a linked (or partly linked) habit is derived from:
 * - `adhkar:morning` / `adhkar:evening` — the zikr progress of that daily set;
 * - `zikr:<id>` — the tasbeeh count of one bundled zikr;
 * - `sadaqah` — any entry in the sadaqah log that day.
 */
export type SunnahHabitSource =
  | "adhkar:morning"
  | "adhkar:evening"
  | "zikr:anytime-istighfar"
  | "sadaqah";

/** In-app destination a habit row links to (routes are resolved by the app). */
export type SunnahHabitLink =
  | { kind: "zikrCategory"; category: "before_sleep" | "morning" | "evening" }
  | { kind: "quran"; surah: number; ayah?: number }
  | { kind: "tasbeeh"; zikrId: string }
  | { kind: "dua"; duaId: string }
  | { kind: "route"; route: "/duroods" | "/sadaqah" };

export interface SunnahHabitDef {
  id: string;
  kind: SunnahHabitKind;
  /** Daily target for count habits (salawat: the user's own, this is only the starting value). */
  target?: number;
  /** True when the user may change {@link target}. */
  userTarget?: boolean;
  refs: readonly SunnahHabitRef[];
  link?: SunnahHabitLink;
  /** Derived from another store (auto-checked, labelled "from …"). */
  source?: SunnahHabitSource;
  /** Done at bedtime — folded into the existing before-sleep reminder text (no extra slot). */
  bedtime?: boolean;
  /** Involves reciting the Qur'an — shows the madhhab note on reciting during hayd. */
  quranRecitation?: boolean;
}

const q = (surah: number, ayahFrom: number, ayahTo?: number): FiqhContentRef =>
  ayahTo == null ? { kind: "quran", surah, ayahFrom } : { kind: "quran", surah, ayahFrom, ayahTo };
const h = (
  collection: "bukhari" | "tirmidhi",
  number: number,
  grade: "sahih" | "hasan" | "disputed" = "sahih",
): FiqhContentRef => ({ kind: "hadith", collection, number, grade });
/** Sahih Muslim: corpus number + Abd al-Baqi number (verified against the corpus `arabicnumber`). */
const m = (corpusNumber: number, arabicNumber: string): FiqhContentRef => ({
  kind: "hadith",
  collection: "muslim",
  number: corpusNumber,
  arabicNumber,
  grade: "sahih",
});

export const SUNNAH_HABITS: readonly SunnahHabitDef[] = [
  { id: "miswak", kind: "binary", refs: [h("bukhari", 887)] },
  {
    id: "wudu_before_sleep",
    kind: "binary",
    refs: [h("bukhari", 247)],
    link: { kind: "zikrCategory", category: "before_sleep" },
    bedtime: true,
  },
  {
    id: "sleep_right_side",
    kind: "binary",
    refs: [h("bukhari", 247)],
    link: { kind: "zikrCategory", category: "before_sleep" },
    bedtime: true,
  },
  {
    id: "ayat_kursi_sleep",
    kind: "binary",
    refs: [h("bukhari", 2311)],
    link: { kind: "quran", surah: 2, ayah: 255 },
    bedtime: true,
    quranRecitation: true,
  },
  {
    id: "mulk_nightly",
    kind: "binary",
    refs: [h("tirmidhi", 2891, "hasan")],
    link: { kind: "quran", surah: 67 },
    bedtime: true,
    quranRecitation: true,
  },
  {
    id: "istighfar_100",
    kind: "linked",
    target: 100,
    refs: [m(6858, "2702.01")],
    link: { kind: "tasbeeh", zikrId: "anytime-istighfar" },
    source: "zikr:anytime-istighfar",
  },
  {
    id: "salawat",
    kind: "count",
    target: 10,
    userTarget: true,
    refs: [{ kind: "dataset", dataset: "duroods" }],
    link: { kind: "route", route: "/duroods" },
  },
  {
    id: "salam_home",
    kind: "binary",
    refs: [q(24, 61)],
    link: { kind: "dua", duaId: "daily-entering-home" },
  },
  { id: "spread_salam", kind: "binary", refs: [m(194, "54.01")] },
  {
    id: "eat_right_bismillah",
    kind: "binary",
    refs: [h("bukhari", 5376)],
    link: { kind: "dua", duaId: "daily-before-eating" },
  },
  { id: "smile", kind: "binary", refs: [h("tirmidhi", 1956)] },
  {
    id: "daily_sadaqah",
    kind: "binary",
    refs: [h("bukhari", 1442), h("bukhari", 1417)],
    link: { kind: "route", route: "/sadaqah" },
    source: "sadaqah",
  },
  {
    id: "morning_adhkar",
    kind: "linked",
    refs: [{ kind: "dataset", dataset: "adhkar" }],
    link: { kind: "zikrCategory", category: "morning" },
    source: "adhkar:morning",
  },
  {
    id: "evening_adhkar",
    kind: "linked",
    refs: [{ kind: "dataset", dataset: "adhkar" }],
    link: { kind: "zikrCategory", category: "evening" },
    source: "adhkar:evening",
  },
];

/** Consistency over volume — the habit list's guiding hadith (Bukhari 6464). */
export const SUNNAH_HABITS_PRINCIPLE_REF: FiqhContentRef = h("bukhari", 6464);

/** Prefix of user-defined habit ids. */
export const CUSTOM_HABIT_PREFIX = "custom:";

/** Starter selection offered on the first visit (the user edits it freely). */
export const DEFAULT_SUNNAH_HABIT_SELECTION: readonly string[] = [
  "morning_adhkar",
  "evening_adhkar",
  "istighfar_100",
  "ayat_kursi_sleep",
];

const BY_ID = new Map(SUNNAH_HABITS.map((habit) => [habit.id, habit]));

export function getSunnahHabit(id: string): SunnahHabitDef | undefined {
  return BY_ID.get(id);
}

export function isSunnahHabitId(id: string): boolean {
  return BY_ID.has(id);
}
