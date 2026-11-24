import type { HeirType, MirathHeirCounts } from "@munib-tracker/shared/mirath";

/**
 * NF-3.10 Mirath wizard (pure). Steps ask for the deceased's gender, then the
 * spouse, children, grandchildren, parents, grandparents, siblings and extended
 * relatives. A step is skipped when earlier answers already exclude everyone on
 * it AND they can't affect anyone else's share (e.g. a son excludes every
 * sibling; a father does too, but siblings still reduce a mother with no
 * descendant to ⅙, so that step stays). Counts from skipped steps are dropped
 * from the input so the result never lists people the user wasn't asked about.
 */
export type DeceasedGender = "male" | "female";

export type MirathStepId =
  | "deceased"
  | "spouse"
  | "children"
  | "grandchildren"
  | "parents"
  | "grandparents"
  | "siblings"
  | "extended"
  | "confirm";

export const MIRATH_STEPS: readonly MirathStepId[] = [
  "deceased",
  "spouse",
  "children",
  "grandchildren",
  "parents",
  "grandparents",
  "siblings",
  "extended",
  "confirm",
];

/** Heirs asked on each step (the spouse row depends on the deceased's gender). */
export function heirsForStep(step: MirathStepId, gender: DeceasedGender): HeirType[] {
  switch (step) {
    case "spouse":
      return [gender === "male" ? "wife" : "husband"];
    case "children":
      return ["son", "daughter"];
    case "grandchildren":
      return ["sons_son", "sons_daughter"];
    case "parents":
      return ["father", "mother"];
    case "grandparents":
      return ["paternal_grandfather", "paternal_grandmother", "maternal_grandmother"];
    case "siblings":
      return [
        "full_brother",
        "full_sister",
        "paternal_brother",
        "paternal_sister",
        "maternal_brother",
        "maternal_sister",
      ];
    case "extended":
      return [
        "full_brothers_son",
        "paternal_brothers_son",
        "full_paternal_uncle",
        "paternal_paternal_uncle",
        "full_uncles_son",
        "paternal_uncles_son",
      ];
    default:
      return [];
  }
}

const SINGLE: ReadonlySet<HeirType> = new Set<HeirType>([
  "husband",
  "father",
  "mother",
  "paternal_grandfather",
  "paternal_grandmother",
  "maternal_grandmother",
]);

/** Largest count the stepper allows for an heir type. */
export function maxCountFor(heir: HeirType): number {
  if (SINGLE.has(heir)) return 1;
  if (heir === "wife") return 4;
  return 20;
}

const has = (c: MirathHeirCounts, h: HeirType) => (c[h] ?? 0) > 0;

/**
 * Siblings can still change the mother's share: a mother is present and there
 * is no descendant (a descendant already gives her ⅙).
 */
export function siblingsReduceMother(counts: MirathHeirCounts): boolean {
  return (
    has(counts, "mother") &&
    !(
      has(counts, "son") ||
      has(counts, "daughter") ||
      has(counts, "sons_son") ||
      has(counts, "sons_daughter")
    )
  );
}

/** The siblings step is asked only for the mother's share (the father excludes the siblings). */
export function siblingsOnlyCountForMother(counts: MirathHeirCounts): boolean {
  return has(counts, "father") && siblingsReduceMother(counts);
}

/**
 * Whether a step is asked, given the answers so far. Skips are conservative:
 * a step is skipped only when ALL of its heirs are excluded in every school.
 */
export function isStepRelevant(step: MirathStepId, counts: MirathHeirCounts): boolean {
  switch (step) {
    case "grandchildren":
      return !has(counts, "son");
    case "grandparents":
      // Father excludes the grandfather; mother excludes both grandmothers. The
      // paternal grandmother still inherits with the father in the Hanbali school.
      return !(has(counts, "father") && has(counts, "mother"));
    case "siblings":
      if (has(counts, "son") || has(counts, "sons_son")) return false;
      // The father excludes every sibling, but two or more siblings still reduce
      // the mother from ⅓ to ⅙ when there is no descendant (hajb nuqsan, all four
      // schools; docs/proofs/mirath.md 2.4) — so keep asking in that case.
      if (has(counts, "father")) return siblingsReduceMother(counts);
      return true;
    case "extended":
      return !(
        has(counts, "son") ||
        has(counts, "sons_son") ||
        has(counts, "father") ||
        has(counts, "paternal_grandfather") ||
        has(counts, "full_brother") ||
        has(counts, "paternal_brother")
      );
    default:
      return true;
  }
}

/** Heirs on a step that the earlier answers already exclude in every school (hidden from the step). */
export function isHeirAsked(heir: HeirType, counts: MirathHeirCounts): boolean {
  switch (heir) {
    case "paternal_grandfather":
      return !has(counts, "father");
    case "maternal_grandmother":
      return !has(counts, "mother");
    case "paternal_grandmother":
      return !has(counts, "mother");
    default:
      return true;
  }
}

export function visibleSteps(counts: MirathHeirCounts): MirathStepId[] {
  return MIRATH_STEPS.filter((s) => isStepRelevant(s, counts));
}

/**
 * The counts actually sent to the engine: only heirs from steps (and rows) the
 * user was asked, with a spouse matching the deceased's gender.
 */
export function effectiveCounts(
  counts: MirathHeirCounts,
  gender: DeceasedGender,
): MirathHeirCounts {
  const out: MirathHeirCounts = {};
  for (const step of visibleSteps(counts)) {
    for (const heir of heirsForStep(step, gender)) {
      const n = counts[heir] ?? 0;
      if (n > 0 && isHeirAsked(heir, counts)) out[heir] = Math.min(n, maxCountFor(heir));
    }
  }
  return out;
}

export function totalHeads(counts: MirathHeirCounts): number {
  return Object.values(counts).reduce((n, v) => n + (v ?? 0), 0);
}
