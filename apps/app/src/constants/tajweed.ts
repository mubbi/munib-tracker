import type { TajweedRuleId } from "@munib-tracker/shared/types";

/**
 * Ordered tajweed legend entries (ayah study). Colors match common Tanzil /
 * alquran.cloud palettes; learn routes point at Learn Qur'an tajweed lessons.
 */

export type TajweedRuleDef = {
  id: TajweedRuleId;
  /** i18n key under `quran.tajweed.rules.*` */
  labelKey: string;
  /** i18n key under `quran.tajweed.hints.*` for tooltip detail after the label. */
  hintKey: string;
  colorLight: string;
  colorDark: string;
  /** Learn Qur'an tajweed lesson id (`/learn-quran/tajweed/[id]`). */
  lessonId: string;
};

export const TAJWEED_RULES: readonly TajweedRuleDef[] = [
  {
    id: "ghunnah",
    labelKey: "quran.tajweed.rules.ghunnah",
    hintKey: "quran.tajweed.hints.ghunnah",
    colorLight: "#FF7E1E",
    colorDark: "#FF9A4D",
    lessonId: "ghunnah",
  },
  {
    id: "ikhafa",
    labelKey: "quran.tajweed.rules.ikhafa",
    hintKey: "quran.tajweed.hints.ikhafa",
    colorLight: "#9400A8",
    colorDark: "#C44DD6",
    lessonId: "noon-sakin",
  },
  {
    id: "ikhafa_shafawi",
    labelKey: "quran.tajweed.rules.ikhafaShafawi",
    hintKey: "quran.tajweed.hints.ikhafaShafawi",
    colorLight: "#D500B7",
    colorDark: "#F06AD9",
    lessonId: "meem-sakin",
  },
  {
    id: "idgham_ghunnah",
    labelKey: "quran.tajweed.rules.idghamGhunnah",
    hintKey: "quran.tajweed.hints.idghamGhunnah",
    colorLight: "#169200",
    colorDark: "#4CBF33",
    lessonId: "noon-sakin",
  },
  {
    id: "idgham_wo_ghunnah",
    labelKey: "quran.tajweed.rules.idghamNoGhunnah",
    hintKey: "quran.tajweed.hints.idghamNoGhunnah",
    colorLight: "#169200",
    colorDark: "#3AA824",
    lessonId: "noon-sakin",
  },
  {
    id: "idgham_shafawi",
    labelKey: "quran.tajweed.rules.idghamShafawi",
    hintKey: "quran.tajweed.hints.idghamShafawi",
    colorLight: "#58B800",
    colorDark: "#7AD12B",
    lessonId: "meem-sakin",
  },
  {
    id: "iqlab",
    labelKey: "quran.tajweed.rules.iqlab",
    hintKey: "quran.tajweed.hints.iqlab",
    colorLight: "#26BFFD",
    colorDark: "#5CCFFF",
    lessonId: "noon-sakin",
  },
  {
    id: "qalqalah",
    labelKey: "quran.tajweed.rules.qalqalah",
    hintKey: "quran.tajweed.hints.qalqalah",
    colorLight: "#DD0008",
    colorDark: "#FF4D52",
    lessonId: "qalqalah",
  },
  {
    id: "madda_normal",
    labelKey: "quran.tajweed.rules.maddNormal",
    hintKey: "quran.tajweed.hints.maddNormal",
    colorLight: "#537FFF",
    colorDark: "#7A9AFF",
    lessonId: "madd",
  },
  {
    id: "madda_permissible",
    labelKey: "quran.tajweed.rules.maddPermissible",
    hintKey: "quran.tajweed.hints.maddPermissible",
    colorLight: "#4050FF",
    colorDark: "#6B77FF",
    lessonId: "madd",
  },
  {
    id: "madda_obligatory",
    labelKey: "quran.tajweed.rules.maddObligatory",
    hintKey: "quran.tajweed.hints.maddObligatory",
    colorLight: "#2144C1",
    colorDark: "#4A6AE0",
    lessonId: "madd",
  },
  {
    id: "madda_necessary",
    labelKey: "quran.tajweed.rules.maddNecessary",
    hintKey: "quran.tajweed.hints.maddNecessary",
    colorLight: "#000EBC",
    colorDark: "#3D4AD4",
    lessonId: "madd",
  },
  {
    id: "ham_wasl",
    labelKey: "quran.tajweed.rules.hamWasl",
    hintKey: "quran.tajweed.hints.hamWasl",
    colorLight: "#AAAAAB",
    colorDark: "#C0C0C2",
    lessonId: "hamzat-wasl",
  },
  {
    id: "laam_shamsiyah",
    labelKey: "quran.tajweed.rules.lamShamsiyah",
    hintKey: "quran.tajweed.hints.lamShamsiyah",
    colorLight: "#EABE05",
    colorDark: "#F0D24A",
    lessonId: "lam-shamsiyah",
  },
  {
    id: "slnt",
    labelKey: "quran.tajweed.rules.silent",
    hintKey: "quran.tajweed.hints.silent",
    colorLight: "#CCCCCC",
    colorDark: "#9A9A9A",
    lessonId: "silent",
  },
] as const;

const RULE_BY_ID = new Map(TAJWEED_RULES.map((rule) => [rule.id, rule]));

export function getTajweedRule(id: TajweedRuleId | undefined): TajweedRuleDef | undefined {
  if (!id) return undefined;
  return RULE_BY_ID.get(id);
}

/**
 * Map everyayah.com reciter directory → Quran.com recitation id used for word
 * timing segments. Missing entries disable highlight-follow (tap-to-play still works).
 *
 * @see https://api.quran.com/api/v4/resources/recitations
 */
export const RECITER_DIR_TO_QURAN_COM_ID: Record<string, number> = {
  Alafasy_128kbps: 7,
  Abdul_Basit_Murattal_192kbps: 2,
  Husary_128kbps: 5,
  Minshawy_Murattal_128kbps: 10,
  "Abdurrahmaan_As-Sudais_192kbps": 3,
  "Abu_Bakr_Ash-Shaatree_128kbps": 4,
  "Saood_ash-Shuraym_128kbps": 8,
  Hudhaify_128kbps: 9,
};

export function quranComRecitationId(reciterDir: string): number | null {
  return RECITER_DIR_TO_QURAN_COM_ID[reciterDir] ?? null;
}
