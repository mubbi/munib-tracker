/**
 * Educational rulings for zakat calculator sections — not a fatwa.
 * Excerpts are resolved from i18n (`zakat.sectionInfo.*`, plus shared quran/hadith).
 */

export const ZAKAT_CALC_SECTION_IDS = [
  "currency",
  "liquid",
  "metals",
  "investments",
  "property",
  "livestock",
  "agriculture",
  "deductions",
  "nisab",
] as const;

export type ZakatCalcSectionId = (typeof ZAKAT_CALC_SECTION_IDS)[number];

export type ZakatSectionRefKind = "quran" | "hadith";

/** Points at shared `zakat.quran.{n}` / `zakat.hadith.{n}` excerpt arrays (0-based). */
export type ZakatSectionRef = {
  kind: ZakatSectionRefKind;
  /** Index into `zakat.quran` or `zakat.hadith` when using shared excerpts. */
  sharedIndex?: number;
  /** Optional override citation label (otherwise derived). */
  labelKey?: string;
};

export type ZakatCalcSectionMeta = {
  id: ZakatCalcSectionId;
  /** Link into the longer topic guides on /zakat/[topic]. */
  guideTopic?: "basics" | "hawl" | "nisab" | "zakatable" | "exempt" | "debts" | "otherRates";
  refs: ZakatSectionRef[];
};

/**
 * Which texts back each calculator block. Bodies live in i18n so schools can
 * keep soft language ("generally", "many scholars") without hardcoding English.
 */
export const ZAKAT_CALC_SECTIONS: Record<ZakatCalcSectionId, ZakatCalcSectionMeta> = {
  currency: {
    id: "currency",
    guideTopic: "basics",
    refs: [{ kind: "hadith", sharedIndex: 1 }],
  },
  liquid: {
    id: "liquid",
    guideTopic: "zakatable",
    refs: [
      { kind: "quran", sharedIndex: 1 },
      { kind: "hadith", sharedIndex: 2 },
    ],
  },
  metals: {
    id: "metals",
    guideTopic: "nisab",
    refs: [
      { kind: "hadith", sharedIndex: 2 },
      { kind: "hadith", sharedIndex: 3 },
    ],
  },
  investments: {
    id: "investments",
    guideTopic: "zakatable",
    refs: [
      { kind: "quran", sharedIndex: 2 },
      { kind: "hadith", sharedIndex: 1 },
    ],
  },
  property: {
    id: "property",
    guideTopic: "exempt",
    refs: [
      { kind: "quran", sharedIndex: 2 },
      { kind: "hadith", sharedIndex: 0 },
    ],
  },
  livestock: {
    id: "livestock",
    guideTopic: "otherRates",
    refs: [
      { kind: "hadith", sharedIndex: 1 },
      { kind: "hadith", sharedIndex: 3 },
    ],
  },
  agriculture: {
    id: "agriculture",
    guideTopic: "otherRates",
    refs: [
      { kind: "quran", sharedIndex: 2 },
      { kind: "hadith", sharedIndex: 1 },
    ],
  },
  deductions: {
    id: "deductions",
    guideTopic: "debts",
    refs: [
      { kind: "quran", sharedIndex: 0 },
      { kind: "hadith", sharedIndex: 3 },
    ],
  },
  nisab: {
    id: "nisab",
    guideTopic: "nisab",
    refs: [
      { kind: "hadith", sharedIndex: 3 },
      { kind: "quran", sharedIndex: 1 },
    ],
  },
};
