import type {
  TajweedCoachingCategory,
  TajweedDrillHeadId,
  TajweedListenCategory,
  TajweedPlanItemKey,
  TajweedRuleId,
} from "@munib-tracker/shared/types";

/**
 * NF-3.15 step 4: tajweed markup rules → coaching categories.
 *
 * - `qalqalah` → the `qalqalah` drill head;
 * - the nasal rules (`ghunnah`, `idgham_ghunnah`, `ikhafa`, `ikhafa_shafawi`,
 *   `iqlab`, `idgham_shafawi`) → the `ghunna` drill head;
 * - letters with shaddah (from the Uthmani text, not the markup) → `gemination`;
 * - rules with no head (madd variants, `ham_wasl`, `laam_shamsiyah`, and
 *   `idgham_wo_ghunnah`) → listen-and-repeat cards, never judged;
 * - `slnt` (silent letters) is a reading aid with nothing to pronounce → none.
 */
export const RULE_CATEGORY: Readonly<Record<TajweedRuleId, TajweedCoachingCategory | null>> = {
  qalqalah: "qalqalah",
  ghunnah: "ghunna",
  idgham_ghunnah: "ghunna",
  ikhafa: "ghunna",
  ikhafa_shafawi: "ghunna",
  iqlab: "ghunna",
  idgham_shafawi: "ghunna",
  madda_normal: "madd",
  madda_permissible: "madd",
  madda_necessary: "madd",
  madda_obligatory: "madd",
  ham_wasl: "ham_wasl",
  laam_shamsiyah: "laam_shamsiyah",
  idgham_wo_ghunnah: "idgham_wo_ghunnah",
  slnt: null,
};

export const DRILL_HEAD_IDS: readonly TajweedDrillHeadId[] = ["qalqalah", "ghunna", "gemination"];

export const LISTEN_CATEGORIES: readonly TajweedListenCategory[] = [
  "madd",
  "ham_wasl",
  "laam_shamsiyah",
  "idgham_wo_ghunnah",
];

export function isDrillHead(category: string): category is TajweedDrillHeadId {
  return (DRILL_HEAD_IDS as readonly string[]).includes(category);
}

export function isListenCategory(category: string): category is TajweedListenCategory {
  return (LISTEN_CATEGORIES as readonly string[]).includes(category);
}

export function planItemKey(category: TajweedCoachingCategory): TajweedPlanItemKey {
  return isDrillHead(category) ? category : `listen:${category}`;
}

/** Plan item key → its category, or null for an unknown (newer-client) key. */
export function planItemCategory(key: string): TajweedCoachingCategory | null {
  if (isDrillHead(key)) return key;
  if (key.startsWith("listen:")) {
    const category = key.slice("listen:".length);
    return isListenCategory(category) ? category : null;
  }
  return null;
}

/** Route param for `/learn-quran/tajweed/coach/[item]` (no colon in a URL segment). */
export function categoryParam(category: TajweedCoachingCategory): string {
  return category;
}

export function categoryFromParam(param: string | undefined): TajweedCoachingCategory | null {
  if (!param) return null;
  return isDrillHead(param) || isListenCategory(param) ? param : null;
}

/** Every coaching category, drill heads first (the order cards and tabs use). */
export const COACHING_CATEGORIES: readonly TajweedCoachingCategory[] = [
  ...DRILL_HEAD_IDS,
  ...LISTEN_CATEGORIES,
];
