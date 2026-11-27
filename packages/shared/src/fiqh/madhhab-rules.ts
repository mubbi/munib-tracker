import type { FiqhDomain, MadhhabId, NisabBasis } from "../types/preferences";

/**
 * Typed per-school rules consumed by calculators and trackers (NF-3.0a, plan
 * §4.1.3). Each value is the school's relied-upon (mu'tamad) position; other
 * views live in the difference catalog (`differences.ts`). Every value has a
 * proof-log entry in `docs/proofs/madhhab.md` (D11). Changing ANY value must
 * update that log and the `review` stamp — the test compares a hash of the rules
 * with `RULES_REVIEW_LOG` (`__tests__/madhhab-rules.test.ts`) and fails until a
 * new `{ hash, reviewedAt }` entry with a later date is appended.
 */

export const MADHHAB_IDS = [
  "hanafi",
  "shafii",
  "maliki",
  "hanbali",
] as const satisfies readonly MadhhabId[];

export const FIQH_DOMAINS = [
  "salah",
  "taharah",
  "fasting",
  "zakat",
  "travel",
  "hajj",
  "udhiyah",
  "inheritance",
] as const satisfies readonly FiqhDomain[];

/** Mirrors the Asr `MadhabKey` in `apps/app/src/lib/prayer-times.ts` (kept local to stay package-pure). */
export type AsrMadhabKey = "hanafi" | "shafi";

export interface WitrForm {
  /** Fewest rakahs that count as witr. */
  minRakahs: 1 | 3;
  /** The usual number prayed. */
  commonRakahs: 1 | 3;
  /** Most rakahs counted as witr. */
  maxRakahs: 1 | 3 | 11;
  /** Hanafi: three joined with one salam; Maliki: one rakah after a separate two-rakah shaf'. */
  structure: "three_one_salam" | "separated_or_joined" | "one_after_shaf";
  qunut: "all_year_before_ruku" | "ramadan_second_half_after_ruku" | "none" | "all_year_after_ruku";
}

export type TashriqSlot = { hijriDay: 9 | 10 | 13; prayer: "fajr" | "dhuhr" | "asr" };

/**
 * Inheritance parameters for the cases the schools dispute (NF-3.10 §9). The
 * shared engine reads these; everything else in faraid is common to all four.
 */
export interface MirathSchoolParams {
  /** Abu Hanifa: the grandfather excludes full/paternal siblings like the father. Others: muqasamah (Zayd's method). */
  grandfatherWithSiblings: "grandfather_excludes" | "muqasamah";
  /** Akdariyyah (husband, mother, grandfather, full sister) applies only under muqasamah. */
  akdariyyah: boolean;
  /** Mushtarakah (Himariyyah): do full brothers share the maternal siblings' third? */
  mushtarakah: "full_siblings_share" | "full_siblings_excluded";
  /** Is the paternal grandmother excluded by the father (her son)? */
  paternalGrandmotherWithFather: "excluded" | "inherits";
  /** App default: return a surplus to fard-heirs except spouses (D6 note: later Shafi'i/Maliki allow it). */
  raddEnabled: boolean;
  /** The school's classical position on the surplus. */
  raddClassical: "to_heirs" | "to_treasury";
  /**
   * Maliki "al-Malikiyyah": husband, mother (or grandmother), grandfather, 2+ maternal
   * siblings and paternal half-siblings — the grandfather takes the whole remaining
   * third and the paternal siblings get nothing (Mukhtasar Khalil). Others: Zayd's method.
   */
  malikiyyah: boolean;
  /** Distant kindred: inherit directly, or only when there is no organised treasury (later scholars). */
  dhawuAlArham: "inherit" | "inherit_when_no_treasury";
}

/** D11 review stamp — bump `reviewedAt` (and the proof log) whenever a value changes. */
export interface FiqhReviewStamp {
  reviewedBy: "ai-review";
  reviewedAt: string;
  proofLog: "docs/proofs/madhhab.md";
}

export interface MadhhabRules {
  /** Default Asr calculation offered when the school is picked (never applied automatically). */
  asrDefault: AsrMadhabKey;
  asrPreferred: "delay_before_yellowing" | "early";
  fajrPreferred: "isfar" | "taghlis";
  /** Info only — the calculation angle is unchanged. Hanafi records Abu Hanifa's view (many fatwas follow the Sahibayn: red). */
  ishaStartTwilight: "white" | "red";
  ishaPreferred: "delay_third" | "early";
  witr: {
    status: "wajib" | "sunnah_muakkadah";
    /** Default for Witr qaza accrual (D9 retrofit: on only for Hanafi; others may opt in). */
    qazaDefault: boolean;
    /** Maliki: witr is not made up once Fajr has been prayed. */
    qaza: "required" | "recommended" | "not_after_fajr";
    form: WitrForm;
  };
  hayd: {
    /** 0 = no minimum (Maliki, for worship). */
    minHours: number;
    maxDays: number;
    minPurityDays: number;
    nifasMaxDays: number;
    /** Maliki: a woman with a habit adds up to 3 days of istizhar (never past `maxDays`). */
    habitualIstizharDays: number;
  };
  travel: {
    /** Representative figure for calculators — the lower end of `qasrDistanceKmRange`. */
    qasrDistanceKm: number;
    /** Conversions of the classical measure differ; treat distances inside the range as "scholars differ". */
    qasrDistanceKmRange: readonly [number, number];
    qasrStatus: "wajib" | "concession" | "sunnah";
    /** Intended stay (days) that ends travel status. */
    residencyDays: number;
    /** `gte`: staying `residencyDays` or more ends travel; `gt`: only more than it. */
    residencyRule: "gte" | "gt";
    /** Shafi'i/Maliki/Hanbali count full days, excluding the arrival and departure days. */
    residencyExcludesTravelDays: boolean;
    jamTravel: boolean;
    jamRain: "none" | "maghrib_isha" | "both";
    rawatib: "optional_except_fajr" | "optional" | "left_except_fajr_witr";
  };
  zakat: {
    nisabBasis: NisabBasis;
    /** True when the school's classical texts don't settle the basis for modern currency (UI shows "scholars differ"). */
    nisabBasisContested: boolean;
    combineGoldSilver: boolean;
    combineMethod: "value" | "parts" | null;
    personalJewelleryZakatable: boolean;
  };
  fasting: {
    forgetfulEatingBreaks: boolean;
    kaffarahTriggers: readonly ("intercourse" | "deliberate_eating")[];
    fidyahMeasure: "half_sa_wheat" | "mudd";
    fidyahCashAllowed: boolean;
    fitrMeasure: "half_sa_wheat" | "sa";
    fitrCashAllowed: boolean;
    /** Info only. */
    tarawihRakahs: number;
    /** Shafi'i: fasting after mid-Sha'ban is not permitted unless habitual, joined to earlier days, qaza or a vow. */
    afterMidShaban: "restricted" | "no_specific_rule";
  };
  jumuah: { minCongregation: number; countIncludesImam: boolean };
  eid: {
    status: "wajib" | "sunnah_muakkadah" | "fard_kifayah";
    /** Extra takbirs in [first, second] rakah, excluding the opening takbir and the takbir of standing. */
    extraTakbirs: readonly [number, number];
  };
  janazahFatiha: "not_recited" | "obligatory";
  tawafWudu: "wajib" | "condition";
  rawatib: { defaultPreset: 10 | 12; dhuhrBefore: 2 | 4 };
  takbirTashriq: {
    start: TashriqSlot;
    end: TashriqSlot;
    status: "wajib" | "sunnah";
    openingTakbirs: 2 | 3;
  };
  udhiyah: { status: "wajib_for_capable" | "sunnah_muakkadah"; lastDayHijri: 12 | 13 };
  hairNailsDuringTen: "haram" | "makruh" | "mustahabb_to_refrain";
  mirath: MirathSchoolParams;
  review: FiqhReviewStamp;
}

const REVIEW: FiqhReviewStamp = {
  reviewedBy: "ai-review",
  reviewedAt: "2026-11-23",
  proofLog: "docs/proofs/madhhab.md",
};

/** Qasr range shared by the three schools that use 4 burud (16 farsakh / 48 Hashimi miles). */
const FOUR_BURUD_KM = [81, 89] as const;

const MUQASAMAH_MIRATH = {
  grandfatherWithSiblings: "muqasamah",
  akdariyyah: true,
  paternalGrandmotherWithFather: "excluded",
  raddEnabled: true,
  malikiyyah: false,
} as const;

export const MADHHAB_RULES: Readonly<Record<MadhhabId, MadhhabRules>> = {
  hanafi: {
    asrDefault: "hanafi",
    asrPreferred: "delay_before_yellowing",
    fajrPreferred: "isfar",
    ishaStartTwilight: "white",
    ishaPreferred: "delay_third",
    witr: {
      status: "wajib",
      qazaDefault: true,
      qaza: "required",
      form: {
        minRakahs: 3,
        commonRakahs: 3,
        maxRakahs: 3,
        structure: "three_one_salam",
        qunut: "all_year_before_ruku",
      },
    },
    hayd: {
      minHours: 72,
      maxDays: 10,
      minPurityDays: 15,
      nifasMaxDays: 40,
      habitualIstizharDays: 0,
    },
    travel: {
      qasrDistanceKm: 77,
      qasrDistanceKmRange: [77, 78],
      qasrStatus: "wajib",
      residencyDays: 15,
      residencyRule: "gte",
      residencyExcludesTravelDays: false,
      jamTravel: false,
      jamRain: "none",
      rawatib: "optional_except_fajr",
    },
    zakat: {
      nisabBasis: "lower",
      nisabBasisContested: false,
      combineGoldSilver: true,
      combineMethod: "value",
      personalJewelleryZakatable: true,
    },
    fasting: {
      forgetfulEatingBreaks: false,
      kaffarahTriggers: ["intercourse", "deliberate_eating"],
      fidyahMeasure: "half_sa_wheat",
      fidyahCashAllowed: true,
      fitrMeasure: "half_sa_wheat",
      fitrCashAllowed: true,
      tarawihRakahs: 20,
      afterMidShaban: "no_specific_rule",
    },
    jumuah: { minCongregation: 3, countIncludesImam: false },
    eid: { status: "wajib", extraTakbirs: [3, 3] },
    janazahFatiha: "not_recited",
    tawafWudu: "wajib",
    rawatib: { defaultPreset: 12, dhuhrBefore: 4 },
    takbirTashriq: {
      start: { hijriDay: 9, prayer: "fajr" },
      end: { hijriDay: 13, prayer: "asr" },
      status: "wajib",
      openingTakbirs: 2,
    },
    udhiyah: { status: "wajib_for_capable", lastDayHijri: 12 },
    hairNailsDuringTen: "mustahabb_to_refrain",
    mirath: {
      grandfatherWithSiblings: "grandfather_excludes",
      akdariyyah: false,
      mushtarakah: "full_siblings_excluded",
      paternalGrandmotherWithFather: "excluded",
      raddEnabled: true,
      raddClassical: "to_heirs",
      dhawuAlArham: "inherit",
      malikiyyah: false,
    },
    review: REVIEW,
  },
  shafii: {
    asrDefault: "shafi",
    asrPreferred: "early",
    fajrPreferred: "taghlis",
    ishaStartTwilight: "red",
    ishaPreferred: "early",
    witr: {
      status: "sunnah_muakkadah",
      qazaDefault: false,
      qaza: "recommended",
      form: {
        minRakahs: 1,
        commonRakahs: 3,
        maxRakahs: 11,
        structure: "separated_or_joined",
        qunut: "ramadan_second_half_after_ruku",
      },
    },
    hayd: {
      minHours: 24,
      maxDays: 15,
      minPurityDays: 15,
      nifasMaxDays: 60,
      habitualIstizharDays: 0,
    },
    travel: {
      qasrDistanceKm: FOUR_BURUD_KM[0],
      qasrDistanceKmRange: FOUR_BURUD_KM,
      qasrStatus: "concession",
      residencyDays: 4,
      residencyRule: "gte",
      residencyExcludesTravelDays: true,
      jamTravel: true,
      jamRain: "both",
      rawatib: "optional",
    },
    zakat: {
      nisabBasis: "gold",
      nisabBasisContested: true,
      combineGoldSilver: false,
      combineMethod: null,
      personalJewelleryZakatable: false,
    },
    fasting: {
      forgetfulEatingBreaks: false,
      kaffarahTriggers: ["intercourse"],
      fidyahMeasure: "mudd",
      fidyahCashAllowed: false,
      fitrMeasure: "sa",
      fitrCashAllowed: false,
      tarawihRakahs: 20,
      afterMidShaban: "restricted",
    },
    jumuah: { minCongregation: 40, countIncludesImam: true },
    eid: { status: "sunnah_muakkadah", extraTakbirs: [7, 5] },
    janazahFatiha: "obligatory",
    tawafWudu: "condition",
    rawatib: { defaultPreset: 10, dhuhrBefore: 2 },
    takbirTashriq: {
      start: { hijriDay: 9, prayer: "fajr" },
      end: { hijriDay: 13, prayer: "asr" },
      status: "sunnah",
      openingTakbirs: 3,
    },
    udhiyah: { status: "sunnah_muakkadah", lastDayHijri: 13 },
    hairNailsDuringTen: "makruh",
    mirath: {
      ...MUQASAMAH_MIRATH,
      mushtarakah: "full_siblings_share",
      raddClassical: "to_treasury",
      dhawuAlArham: "inherit_when_no_treasury",
    },
    review: REVIEW,
  },
  maliki: {
    asrDefault: "shafi",
    asrPreferred: "early",
    fajrPreferred: "taghlis",
    ishaStartTwilight: "red",
    ishaPreferred: "early",
    witr: {
      status: "sunnah_muakkadah",
      qazaDefault: false,
      qaza: "not_after_fajr",
      form: {
        minRakahs: 1,
        commonRakahs: 1,
        maxRakahs: 1,
        structure: "one_after_shaf",
        qunut: "none",
      },
    },
    hayd: {
      minHours: 0,
      maxDays: 15,
      minPurityDays: 15,
      nifasMaxDays: 60,
      habitualIstizharDays: 3,
    },
    travel: {
      qasrDistanceKm: FOUR_BURUD_KM[0],
      qasrDistanceKmRange: FOUR_BURUD_KM,
      qasrStatus: "sunnah",
      residencyDays: 4,
      residencyRule: "gte",
      residencyExcludesTravelDays: true,
      jamTravel: true,
      jamRain: "maghrib_isha",
      rawatib: "optional",
    },
    zakat: {
      nisabBasis: "gold",
      nisabBasisContested: true,
      combineGoldSilver: true,
      combineMethod: "parts",
      personalJewelleryZakatable: false,
    },
    fasting: {
      forgetfulEatingBreaks: true,
      kaffarahTriggers: ["intercourse", "deliberate_eating"],
      fidyahMeasure: "mudd",
      fidyahCashAllowed: false,
      fitrMeasure: "sa",
      fitrCashAllowed: false,
      tarawihRakahs: 20,
      afterMidShaban: "no_specific_rule",
    },
    jumuah: { minCongregation: 12, countIncludesImam: false },
    eid: { status: "sunnah_muakkadah", extraTakbirs: [6, 5] },
    janazahFatiha: "not_recited",
    tawafWudu: "condition",
    rawatib: { defaultPreset: 10, dhuhrBefore: 2 },
    takbirTashriq: {
      start: { hijriDay: 10, prayer: "dhuhr" },
      end: { hijriDay: 13, prayer: "fajr" },
      status: "sunnah",
      openingTakbirs: 3,
    },
    udhiyah: { status: "sunnah_muakkadah", lastDayHijri: 12 },
    hairNailsDuringTen: "makruh",
    mirath: {
      ...MUQASAMAH_MIRATH,
      malikiyyah: true,
      mushtarakah: "full_siblings_share",
      raddClassical: "to_treasury",
      dhawuAlArham: "inherit_when_no_treasury",
    },
    review: REVIEW,
  },
  hanbali: {
    asrDefault: "shafi",
    asrPreferred: "early",
    fajrPreferred: "taghlis",
    ishaStartTwilight: "red",
    ishaPreferred: "delay_third",
    witr: {
      status: "sunnah_muakkadah",
      qazaDefault: false,
      qaza: "recommended",
      form: {
        minRakahs: 1,
        commonRakahs: 3,
        maxRakahs: 11,
        structure: "separated_or_joined",
        qunut: "all_year_after_ruku",
      },
    },
    hayd: {
      minHours: 24,
      maxDays: 15,
      minPurityDays: 13,
      nifasMaxDays: 40,
      habitualIstizharDays: 0,
    },
    travel: {
      qasrDistanceKm: FOUR_BURUD_KM[0],
      qasrDistanceKmRange: FOUR_BURUD_KM,
      qasrStatus: "concession",
      residencyDays: 4,
      residencyRule: "gt",
      residencyExcludesTravelDays: false,
      jamTravel: true,
      jamRain: "maghrib_isha",
      rawatib: "left_except_fajr_witr",
    },
    zakat: {
      nisabBasis: "lower",
      nisabBasisContested: false,
      combineGoldSilver: true,
      combineMethod: "parts",
      personalJewelleryZakatable: false,
    },
    fasting: {
      forgetfulEatingBreaks: false,
      kaffarahTriggers: ["intercourse"],
      fidyahMeasure: "mudd",
      fidyahCashAllowed: false,
      fitrMeasure: "sa",
      fitrCashAllowed: false,
      tarawihRakahs: 20,
      afterMidShaban: "no_specific_rule",
    },
    jumuah: { minCongregation: 40, countIncludesImam: true },
    eid: { status: "fard_kifayah", extraTakbirs: [6, 5] },
    janazahFatiha: "obligatory",
    tawafWudu: "condition",
    rawatib: { defaultPreset: 10, dhuhrBefore: 2 },
    takbirTashriq: {
      start: { hijriDay: 9, prayer: "fajr" },
      end: { hijriDay: 13, prayer: "asr" },
      status: "sunnah",
      openingTakbirs: 2,
    },
    udhiyah: { status: "sunnah_muakkadah", lastDayHijri: 12 },
    hairNailsDuringTen: "haram",
    mirath: {
      ...MUQASAMAH_MIRATH,
      mushtarakah: "full_siblings_excluded",
      paternalGrandmotherWithFather: "inherits",
      raddClassical: "to_heirs",
      dhawuAlArham: "inherit",
    },
    review: REVIEW,
  },
};
