/**
 * Heir relationships recognised by Islamic inheritance (faraid), as listed in
 * plan NF-3.10 (`MirathInput.heirs`). Defined here first so the wasiyyah
 * builder (NF-3.9) can mark a bequest beneficiary as an heir; the Mirath engine
 * (NF-3.10, `packages/shared/src/mirath/`) adopts this type instead of
 * redeclaring it.
 */
export const HEIR_TYPES = [
  "husband",
  "wife",
  "son",
  "daughter",
  "sons_son",
  "sons_daughter",
  "father",
  "mother",
  "paternal_grandfather",
  "paternal_grandmother",
  "maternal_grandmother",
  "full_brother",
  "full_sister",
  "paternal_brother",
  "paternal_sister",
  "maternal_brother",
  "maternal_sister",
  "full_brothers_son",
  "paternal_brothers_son",
  "full_paternal_uncle",
  "paternal_paternal_uncle",
  "full_uncles_son",
  "paternal_uncles_son",
] as const;

export type HeirType = (typeof HEIR_TYPES)[number];

export function isHeirType(value: unknown): value is HeirType {
  return typeof value === "string" && (HEIR_TYPES as readonly string[]).includes(value);
}
