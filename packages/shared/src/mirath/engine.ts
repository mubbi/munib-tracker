import { MADHHAB_IDS, MADHHAB_RULES, type MirathSchoolParams } from "../fiqh/madhhab-rules";
import { HEIR_TYPES, type HeirType } from "../types/heirs";
import type { MadhhabId } from "../types/preferences";
import { allocateCents, amountOf, centsOf, computeNetEstate } from "./estate";
import {
  add,
  cmp,
  div,
  gcd,
  isZero,
  lcm,
  min,
  mul,
  ONE,
  type Rational,
  rat,
  sub,
  sum,
  toFractionString,
  toPercent,
  ZERO,
} from "./rational";
import type {
  MirathHeirShare,
  MirathInput,
  MirathIssue,
  MirathReason,
  MirathReasonCode,
  MirathResult,
  MirathShareBasis,
  MirathSpecialCase,
  MirathStep,
} from "./types";

/**
 * Faraid engine (NF-3.10): one pipeline for all four schools, with the
 * disputed cases read from `MADHHAB_RULES[school].mirath`. Every share is an
 * exact rational; each step is logged for the "Why?" view. Rules and their
 * sources: `docs/proofs/mirath.md`. v1 covers one generation below and above
 * the immediate heirs; anything else is a "consult a scholar" case in the UI.
 *
 * Pipeline: validate → net estate → exclusion (hajb) → fixed shares (furud) →
 * residuaries ('asabah) → 'awl / radd → tashih.
 */

type Counts = Record<HeirType, number>;

const HALF = rat(1, 2);
const THIRD = rat(1, 3);
const QUARTER = rat(1, 4);
const SIXTH = rat(1, 6);
const EIGHTH = rat(1, 8);
const TWO_THIRDS = rat(2, 3);

const MALE_HEIRS: ReadonlySet<HeirType> = new Set<HeirType>([
  "husband",
  "son",
  "sons_son",
  "father",
  "paternal_grandfather",
  "full_brother",
  "paternal_brother",
  "maternal_brother",
  "full_brothers_son",
  "paternal_brothers_son",
  "full_paternal_uncle",
  "paternal_paternal_uncle",
  "full_uncles_son",
  "paternal_uncles_son",
]);

/** Heirs that can only be one person. */
const SINGLE_HEIRS: readonly HeirType[] = [
  "husband",
  "father",
  "mother",
  "paternal_grandfather",
  "paternal_grandmother",
  "maternal_grandmother",
];

const SIBLINGS: readonly HeirType[] = [
  "full_brother",
  "full_sister",
  "paternal_brother",
  "paternal_sister",
  "maternal_brother",
  "maternal_sister",
];

/** Distant male residuaries in order of precedence (class, then degree, then strength of tie). */
const DISTANT_RESIDUARIES: readonly HeirType[] = [
  "full_brothers_son",
  "paternal_brothers_son",
  "full_paternal_uncle",
  "paternal_paternal_uncle",
  "full_uncles_son",
  "paternal_uncles_son",
];

/** Highest count the calculator accepts for any heir type. */
export const MIRATH_MAX_COUNT = 50;

export function mirathParamsFor(school: MadhhabId, overrides?: Partial<MirathSchoolParams>) {
  return { ...MADHHAB_RULES[school].mirath, ...overrides } as MirathSchoolParams;
}

export function normalizeHeirCounts(heirs: MirathInput["heirs"]): Counts {
  const counts = {} as Counts;
  for (const h of HEIR_TYPES) counts[h] = heirs[h] ?? 0;
  return counts;
}

export function validateMirathInput(input: Pick<MirathInput, "heirs" | "deceased">): MirathIssue[] {
  const c = normalizeHeirCounts(input.heirs);
  const issues: MirathIssue[] = [];
  for (const h of HEIR_TYPES) {
    const n = c[h];
    if (!Number.isInteger(n) || n < 0 || n > MIRATH_MAX_COUNT)
      issues.push({ code: "count_invalid", heir: h });
  }
  if (c.wife > 4) issues.push({ code: "too_many_wives", heir: "wife" });
  if (c.husband > 0 && c.wife > 0) issues.push({ code: "husband_and_wife" });
  if (c.husband > 0 && input.deceased.gender !== "female") {
    issues.push({ code: "husband_needs_female_deceased", heir: "husband" });
  }
  if (c.wife > 0 && input.deceased.gender !== "male") {
    issues.push({ code: "wife_needs_male_deceased", heir: "wife" });
  }
  for (const h of SINGLE_HEIRS) if (c[h] > 1) issues.push({ code: "only_one_allowed", heir: h });
  return issues;
}

// ── Working state ───────────────────────────────────────────────────────────

interface Slot {
  heir: HeirType;
  count: number;
  excludedBy?: HeirType[];
  /** Group fixed share (before 'awl / radd). */
  fard?: Rational;
  /** Member of the residuary group (weight per head: male 2, female 1; or a custom weight). */
  asabah?: boolean;
  /** Per-head weight inside a residuary or shared-third pool. */
  weight: number;
  share: Rational;
  reasons: MirathReason[];
}

const reason = (code: MirathReasonCode, extra: Omit<MirathReason, "code"> = {}): MirathReason => ({
  code,
  ...extra,
});

/**
 * Base of a residuary-only case: the heads, each weighted male 2 / female 1,
 * divided by the common weight (all-male or all-female groups count heads).
 */
function residuaryHeadsBase(members: readonly Slot[]): number {
  const units = members.reduce((n, s) => n + s.count * s.weight, 0);
  const common = members.reduce((g, s) => Number(gcd(BigInt(g), BigInt(s.weight))), 0);
  return common > 0 ? units / common : units;
}

/**
 * Base after radd (al-Sirajiyyah, Bab al-Radd). Without a spouse it is the sum
 * of the radd heirs' shares in their own base (mother ⅙ + daughter ½ → 4).
 * With a spouse, the spouse's base is multiplied by the radd heirs' base over
 * its common factor with what is left after the spouse (wife ⅛ + mother +
 * daughter → 8 × 4 = 32).
 */
function raddBaseOf(furud: readonly Rational[], spouseFard?: Rational): bigint {
  const own = furud.reduce((acc, f) => lcm(acc, f.d), BigInt(1));
  const total = sum(furud);
  const heads = (total.n * own) / total.d;
  if (!spouseFard) return heads;
  const spouseBase = spouseFard.d;
  const left = spouseBase - spouseFard.n;
  return (spouseBase * heads) / gcd(left, heads);
}

/** Runs the pipeline for one school. */
export function calculateMirath(input: MirathInput): MirathResult {
  const params = mirathParamsFor(input.school, input.params);
  const steps: MirathStep[] = [];
  const issues = validateMirathInput(input);
  const estateCalc = input.estate ? computeNetEstate(input.estate) : undefined;
  if (estateCalc) issues.push(...estateCalc.issues.filter((i) => i.code === "estate_negative"));

  const base = {
    school: input.school,
    params,
    issues,
    asl: BigInt(1),
    tashihBase: BigInt(1),
    awl: false,
    radd: false,
    specialCases: [] as MirathSpecialCase[],
    estate: estateCalc?.estate,
    steps,
  };
  if (issues.length) {
    steps.push({ code: "validate", data: { ok: false } });
    return { ...base, outcome: "invalid", heirs: [] };
  }
  steps.push({ code: "validate", data: { ok: true } });
  if (estateCalc) {
    issues.push(...estateCalc.issues);
    const e = estateCalc.estate;
    steps.push({
      code: "estate",
      data: {
        gross: e.gross,
        funeral: e.funeral,
        debts: e.debts,
        net: e.net,
        bequests: e.bequests,
        bequestCapped: e.bequestCapped,
        distributable: e.distributable,
      },
    });
  }

  const c = normalizeHeirCounts(input.heirs);
  const slots = new Map<HeirType, Slot>();
  for (const h of HEIR_TYPES) {
    if (c[h] > 0)
      slots.set(h, {
        heir: h,
        count: c[h],
        weight: MALE_HEIRS.has(h) ? 2 : 1,
        share: ZERO,
        reasons: [],
      });
  }
  const present = (h: HeirType) => c[h] > 0;
  const active = (h: HeirType) => present(h) && !slots.get(h)?.excludedBy;
  const activeOf = (...hs: HeirType[]) => hs.filter(active);
  const exclude = (h: HeirType, by: HeirType[]) => {
    const slot = slots.get(h);
    if (!slot || !by.length) return;
    const unique = [...new Set(by)];
    slot.excludedBy = unique;
    slot.reasons.push(reason("excluded", { by: unique }));
  };

  if (!slots.size) {
    steps.push({ code: "unallocated", data: { reason: "dhawu_al_arham" } });
    return { ...base, outcome: "dhawu_al_arham", heirs: [] };
  }

  const specialCases: MirathSpecialCase[] = [];
  const descendant =
    present("son") || present("daughter") || present("sons_son") || present("sons_daughter");
  const maleDescendant = present("son") || present("sons_son");
  const siblingTotal = SIBLINGS.reduce((n, h) => n + c[h], 0);

  // ── 3. Exclusion (hajb hirman) ────────────────────────────────────────────
  exclude("sons_son", activeOf("son"));
  {
    const by = activeOf("son");
    if (!by.length && c.daughter >= 2 && !active("sons_son")) by.push("daughter");
    exclude("sons_daughter", by);
  }
  exclude("paternal_grandfather", activeOf("father"));
  {
    const by = activeOf("mother");
    if (params.paternalGrandmotherWithFather === "excluded") by.push(...activeOf("father"));
    exclude("paternal_grandmother", by);
  }
  exclude("maternal_grandmother", activeOf("mother"));

  const gfExcludesSiblings = params.grandfatherWithSiblings === "grandfather_excludes";
  const siblingBlockers = () => [
    ...activeOf("son", "sons_son", "father"),
    ...(gfExcludesSiblings ? activeOf("paternal_grandfather") : []),
  ];
  const basicSiblingBlockers = siblingBlockers();
  for (const h of ["full_brother", "full_sister"] as const) exclude(h, basicSiblingBlockers);

  // Grandfather with full / paternal siblings, Zayd's method (Shafi'i, Maliki, Hanbali).
  const muqasamah =
    !gfExcludesSiblings &&
    active("paternal_grandfather") &&
    !basicSiblingBlockers.length &&
    (present("full_brother") ||
      present("full_sister") ||
      present("paternal_brother") ||
      present("paternal_sister"));

  const femaleDescendantActive = active("daughter") || active("sons_daughter");
  const fullSisterWithDaughters =
    !muqasamah && active("full_sister") && !active("full_brother") && femaleDescendantActive;
  {
    const by = siblingBlockers();
    if (!muqasamah) {
      by.push(...activeOf("full_brother"));
      if (fullSisterWithDaughters) by.push("full_sister");
    }
    exclude("paternal_brother", by);
  }
  {
    const by = siblingBlockers();
    if (!muqasamah) {
      by.push(...activeOf("full_brother"));
      if (fullSisterWithDaughters) by.push("full_sister");
      else if (c.full_sister >= 2 && active("full_sister") && !active("paternal_brother")) {
        by.push("full_sister");
      }
    }
    exclude("paternal_sister", by);
  }
  {
    const by = [
      ...activeOf("son", "daughter", "sons_son", "sons_daughter", "father", "paternal_grandfather"),
    ];
    exclude("maternal_brother", by);
    exclude("maternal_sister", by);
  }
  const paternalSisterWithDaughters =
    !muqasamah &&
    active("paternal_sister") &&
    !active("paternal_brother") &&
    femaleDescendantActive;
  {
    const ahead: HeirType[] = [
      ...activeOf("son", "sons_son", "father", "paternal_grandfather", "full_brother"),
    ];
    if (fullSisterWithDaughters) ahead.push("full_sister");
    ahead.push(...activeOf("paternal_brother"));
    if (paternalSisterWithDaughters) ahead.push("paternal_sister");
    for (const h of DISTANT_RESIDUARIES) {
      exclude(h, [...ahead]);
      if (active(h)) ahead.push(h);
    }
  }
  steps.push({
    code: "exclusion",
    data: { excluded: [...slots.values()].filter((s) => s.excludedBy).length },
  });

  // ── Special-case detection ────────────────────────────────────────────────
  const spouse: HeirType | null = present("husband") ? "husband" : present("wife") ? "wife" : null;
  const umariyyatayn =
    spouse != null && active("father") && active("mother") && !descendant && siblingTotal < 2;
  const motherOrGrandmother =
    active("mother") || active("paternal_grandmother") || active("maternal_grandmother");
  const maternalCount = c.maternal_brother + c.maternal_sister;
  const mushtarakah =
    present("husband") &&
    motherOrGrandmother &&
    !descendant &&
    !active("father") &&
    !active("paternal_grandfather") &&
    maternalCount >= 2 &&
    active("full_brother");
  const mushtarakahShare = mushtarakah && params.mushtarakah === "full_siblings_share";
  const siblingsWithGf = {
    fb: c.full_brother,
    fs: c.full_sister,
    pb: c.paternal_brother,
    ps: c.paternal_sister,
  };
  const akdariyyah =
    muqasamah &&
    params.akdariyyah &&
    present("husband") &&
    active("mother") &&
    !descendant &&
    siblingsWithGf.fb + siblingsWithGf.pb === 0 &&
    siblingsWithGf.fs + siblingsWithGf.ps === 1;
  const malikiyyahShape =
    muqasamah && present("husband") && motherOrGrandmother && !descendant && maternalCount >= 2;
  const malikiyyah =
    malikiyyahShape &&
    params.malikiyyah &&
    siblingsWithGf.fb + siblingsWithGf.fs === 0 &&
    siblingsWithGf.pb + siblingsWithGf.ps > 0;
  const shibhMalikiyyah =
    malikiyyahShape && params.malikiyyah && siblingsWithGf.fb > 0 && !malikiyyah;
  if (umariyyatayn) specialCases.push("umariyyatayn");
  if (mushtarakah) specialCases.push("mushtarakah");
  if (muqasamah) specialCases.push("grandfather_siblings");
  if (akdariyyah) specialCases.push("akdariyyah");
  if (malikiyyah) specialCases.push("malikiyyah");
  if (shibhMalikiyyah) specialCases.push("shibh_malikiyyah");

  // ── 4. Fixed shares (furud) ───────────────────────────────────────────────
  const setFard = (
    h: HeirType,
    fard: Rational,
    code: MirathReasonCode,
    extra: Partial<MirathReason> = {},
  ) => {
    const slot = slots.get(h);
    if (!slot) return;
    slot.fard = fard;
    slot.reasons.push(reason(code, { fraction: toFractionString(fard), ...extra }));
  };
  const setAsabah = (h: HeirType, code: MirathReasonCode | null, by?: HeirType[]) => {
    const slot = slots.get(h);
    if (!slot) return;
    slot.asabah = true;
    if (code) slot.reasons.push(reason(code, by ? { by } : {}));
  };

  if (present("husband"))
    setFard(
      "husband",
      descendant ? QUARTER : HALF,
      descendant ? "husband_quarter" : "husband_half",
    );
  if (present("wife"))
    setFard("wife", descendant ? EIGHTH : QUARTER, descendant ? "wife_eighth" : "wife_quarter");
  const spouseFard = spouse ? (slots.get(spouse)?.fard ?? ZERO) : ZERO;

  if (active("mother")) {
    if (descendant) setFard("mother", SIXTH, "mother_sixth_descendant");
    else if (siblingTotal >= 2) setFard("mother", SIXTH, "mother_sixth_siblings");
    else if (umariyyatayn) {
      setFard("mother", div(sub(ONE, spouseFard), rat(3)), "mother_third_of_remainder");
      slots.get("mother")?.reasons.push(reason("umariyyatayn"));
    } else setFard("mother", THIRD, "mother_third");
  }

  for (const [h, prefix] of [
    ["father", "father"],
    ["paternal_grandfather", "grandfather"],
  ] as const) {
    if (!active(h)) continue;
    if (h === "paternal_grandfather" && muqasamah) continue; // handled below
    if (maleDescendant) setFard(h, SIXTH, `${prefix}_sixth`);
    else if (descendant) {
      setFard(h, SIXTH, `${prefix}_sixth_and_residue`);
      setAsabah(h, null);
    } else setAsabah(h, `${prefix}_residue`);
  }

  {
    const gms = activeOf("paternal_grandmother", "maternal_grandmother");
    for (const g of gms) {
      setFard(g, div(SIXTH, rat(gms.length)), "grandmother_sixth", {
        fraction: toFractionString(SIXTH),
        ...(gms.length > 1 ? { by: gms.filter((x) => x !== g) } : {}),
      });
    }
  }

  if (present("daughter")) {
    if (active("son")) setAsabah("daughter", "residuary_with_male", ["son"]);
    else if (c.daughter === 1) setFard("daughter", HALF, "daughter_half");
    else setFard("daughter", TWO_THIRDS, "daughters_two_thirds");
  }
  if (active("sons_daughter")) {
    if (active("sons_son")) setAsabah("sons_daughter", "residuary_with_male", ["sons_son"]);
    else if (c.daughter === 0) {
      if (c.sons_daughter === 1) setFard("sons_daughter", HALF, "sons_daughter_half");
      else setFard("sons_daughter", TWO_THIRDS, "sons_daughters_two_thirds");
    } else setFard("sons_daughter", SIXTH, "sons_daughter_sixth", { by: ["daughter"] });
  }

  if (!muqasamah) {
    if (active("full_sister") && !mushtarakahShare) {
      if (active("full_brother")) setAsabah("full_sister", "residuary_with_male", ["full_brother"]);
      else if (fullSisterWithDaughters)
        setAsabah("full_sister", "residuary_with_daughters", activeOf("daughter", "sons_daughter"));
      else if (c.full_sister === 1) setFard("full_sister", HALF, "sister_half");
      else setFard("full_sister", TWO_THIRDS, "sisters_two_thirds");
    }
    if (active("paternal_sister")) {
      if (active("paternal_brother"))
        setAsabah("paternal_sister", "residuary_with_male", ["paternal_brother"]);
      else if (paternalSisterWithDaughters)
        setAsabah(
          "paternal_sister",
          "residuary_with_daughters",
          activeOf("daughter", "sons_daughter"),
        );
      else if (active("full_sister"))
        setFard("paternal_sister", SIXTH, "paternal_sister_sixth", { by: ["full_sister"] });
      else if (c.paternal_sister === 1) setFard("paternal_sister", HALF, "sister_half");
      else setFard("paternal_sister", TWO_THIRDS, "sisters_two_thirds");
    }
  }

  {
    const maternal = activeOf("maternal_brother", "maternal_sister");
    if (maternal.length) {
      const pool = maternalCount === 1 ? SIXTH : THIRD;
      const code: MirathReasonCode = maternalCount === 1 ? "maternal_sixth" : "maternal_third";
      const sharers: HeirType[] = [...maternal];
      if (mushtarakahShare) sharers.push(...activeOf("full_brother", "full_sister"));
      const heads = sharers.reduce((n, h) => n + c[h], 0);
      for (const h of sharers) {
        setFard(h, div(mul(pool, rat(c[h])), rat(heads)), code, {
          fraction: toFractionString(pool),
        });
        const slot = slots.get(h);
        if (slot) slot.weight = 1; // male = female in the maternal third (Qur'an 4:12)
        if (mushtarakahShare && (h === "full_brother" || h === "full_sister")) {
          slot?.reasons.push(reason("mushtarakah_share", { by: maternal }));
        }
      }
    }
  }
  steps.push({
    code: "furud",
    data: {
      total: toFractionString(sum([...slots.values()].flatMap((s) => (s.fard ? [s.fard] : [])))),
    },
  });

  // ── 5. Residuaries ('asabah) ──────────────────────────────────────────────
  if (!muqasamah && !mushtarakahShare) {
    const groups: HeirType[][] = [
      ["son", "daughter"],
      ["sons_son", "sons_daughter"],
      ["father"],
      ["paternal_grandfather"],
      ["full_brother", "full_sister"],
      ["full_sister"],
      ["paternal_brother", "paternal_sister"],
      ["paternal_sister"],
      ...DISTANT_RESIDUARIES.map((h) => [h]),
    ];
    for (const group of groups) {
      const lead = group[0] as HeirType;
      if (!active(lead)) continue;
      const leadSlot = slots.get(lead);
      if (!leadSlot) continue;
      if (!leadSlot.asabah) {
        // Brothers / sons and distant males are residuaries by themselves.
        if (lead === "full_sister" || lead === "paternal_sister") {
          if (!leadSlot.reasons.some((r) => r.code === "residuary_with_daughters")) continue;
        } else setAsabah(lead, "residuary_self");
      }
      break;
    }
    if (mushtarakah) {
      for (const h of activeOf("full_brother", "full_sister")) {
        slots.get(h)?.reasons.push(reason("mushtarakah_excluded"));
      }
    }
  }

  let F = sum([...slots.values()].flatMap((s) => (s.fard ? [s.fard] : [])));
  let asl = [...slots.values()].reduce((acc, s) => (s.fard ? lcm(acc, s.fard.d) : acc), BigInt(1));
  let awlBase: bigint | undefined;
  let raddBase: bigint | undefined;
  let awl = false;
  let radd = false;
  let unallocated: MirathResult["unallocated"];

  const residuaryHeads = (members: Slot[]) => members.reduce((n, s) => n + s.count * s.weight, 0);
  const splitPool = (pool: Rational, members: Slot[]) => {
    const units = residuaryHeads(members);
    if (!units) return;
    for (const s of members)
      s.share = add(s.share, div(mul(pool, rat(s.count * s.weight)), rat(units)));
  };

  if (muqasamah) {
    const gf = slots.get("paternal_grandfather") as Slot;
    const sib = (["full_brother", "full_sister", "paternal_brother", "paternal_sister"] as const)
      .map((h) => slots.get(h))
      .filter((s): s is Slot => !!s);
    if (akdariyyah) {
      // Husband ½, mother ⅓, grandfather ⅙, sister ½ → base 6 raised to 9; then the
      // grandfather and sister pool 4/9 and split it 2:1 → base 27.
      const sister = sib[0] as Slot;
      gf.fard = SIXTH;
      sister.fard = HALF;
      F = add(F, add(SIXTH, HALF));
      asl = lcm(asl, BigInt(6));
      awl = true;
      awlBase = (F.n * asl) / F.d;
      for (const s of slots.values())
        if (s.fard && s !== gf && s !== sister) s.share = div(s.fard, F);
      const pool = div(add(SIXTH, HALF), F);
      gf.share = mul(pool, rat(2, 3));
      sister.share = mul(pool, rat(1, 3));
      gf.reasons.push(
        reason("akdariyyah", { fraction: toFractionString(SIXTH), by: [sister.heir] }),
      );
      sister.reasons.push(
        reason("akdariyyah", { fraction: toFractionString(HALF), by: ["paternal_grandfather"] }),
      );
      steps.push({ code: "awl", data: { from: Number(asl), to: Number(awlBase) } });
    } else {
      const R = sub(ONE, F);
      const hasFard = !isZero(F);
      if (malikiyyah) {
        gf.share = R;
        gf.reasons.push(reason("malikiyyah", { fraction: toFractionString(R) }));
        for (const s of sib)
          s.reasons.push(
            reason("malikiyyah", { by: ["paternal_grandfather"] }),
            reason("nothing_left"),
          );
        for (const s of slots.values()) if (s.fard) s.share = s.fard;
      } else if (hasFard && cmp(R, SIXTH) <= 0) {
        gf.fard = SIXTH;
        gf.reasons.push(reason("muqasamah_sixth", { fraction: toFractionString(SIXTH) }));
        for (const s of sib) s.reasons.push(reason("nothing_left"));
        F = add(F, SIXTH);
        asl = lcm(asl, BigInt(6));
      } else {
        const units =
          2 * (siblingsWithGf.fb + siblingsWithGf.pb) + siblingsWithGf.fs + siblingsWithGf.ps;
        const share = div(mul(R, rat(2)), rat(2 + units));
        const third = hasFard ? div(R, rat(3)) : THIRD;
        let best: { value: Rational; code: MirathReasonCode } = {
          value: share,
          code: "muqasamah_share",
        };
        if (cmp(third, best.value) > 0) best = { value: third, code: "muqasamah_third" };
        if (hasFard && cmp(SIXTH, best.value) > 0) best = { value: SIXTH, code: "muqasamah_sixth" };
        gf.share = best.value;
        gf.reasons.push(
          reason(best.code, { fraction: toFractionString(best.value), by: sib.map((s) => s.heir) }),
        );
        const pool = sub(R, best.value);
        const full = sib.filter((s) => s.heir === "full_brother" || s.heir === "full_sister");
        const paternal = sib.filter(
          (s) => s.heir === "paternal_brother" || s.heir === "paternal_sister",
        );
        for (const s of sib)
          s.reasons.push(reason("muqasamah_siblings", { by: ["paternal_grandfather"] }));
        if (full.length && paternal.length) {
          // Mu'addah: paternal siblings were counted against the grandfather; full siblings reclaim.
          if (siblingsWithGf.fb > 0) {
            splitPool(pool, full);
            for (const s of paternal)
              s.reasons.push(
                reason("muaddah_counted", { by: full.map((f) => f.heir) }),
                reason("nothing_left"),
              );
          } else {
            const cap = siblingsWithGf.fs === 1 ? HALF : TWO_THIRDS;
            const reclaimed = min(pool, cap);
            splitPool(reclaimed, full);
            for (const s of full)
              s.reasons.push(reason("muaddah_reclaim", { fraction: toFractionString(cap) }));
            const rest = sub(pool, reclaimed);
            if (isZero(rest)) {
              for (const s of paternal)
                s.reasons.push(
                  reason("muaddah_counted", { by: ["full_sister"] }),
                  reason("nothing_left"),
                );
            } else splitPool(rest, paternal);
          }
        } else splitPool(pool, sib);
        for (const s of slots.values()) if (s.fard) s.share = s.fard;
      }
      if (gf.fard) {
        // ⅙ to the grandfather, possibly with 'awl; siblings get nothing.
        if (cmp(F, ONE) > 0) {
          awl = true;
          awlBase = (F.n * asl) / F.d;
          steps.push({ code: "awl", data: { from: Number(asl), to: Number(awlBase) } });
        }
        for (const s of slots.values())
          if (s.fard) s.share = div(s.fard, cmp(F, ONE) > 0 ? F : ONE);
      }
    }
    steps.push({ code: "asabah", data: { grandfatherWithSiblings: true } });
  } else {
    const residuaries = [...slots.values()].filter((s) => s.asabah && !s.excludedBy);
    for (const s of slots.values()) if (s.fard) s.share = s.fard;
    if (cmp(F, ONE) > 0) {
      awl = true;
      awlBase = (F.n * asl) / F.d;
      for (const s of slots.values()) if (s.fard) s.share = div(s.fard, F);
      steps.push({ code: "awl", data: { from: Number(asl), to: Number(awlBase) } });
      for (const s of residuaries) if (!s.fard) s.reasons.push(reason("nothing_left"));
    } else if (residuaries.length) {
      const residue = sub(ONE, F);
      if (isZero(residue)) {
        for (const s of residuaries) if (!s.fard) s.reasons.push(reason("nothing_left"));
      } else splitPool(residue, residuaries);
      steps.push({ code: "asabah", data: { residue: toFractionString(residue) } });
    } else if (cmp(F, ONE) < 0) {
      const surplus = sub(ONE, F);
      const candidates = [...slots.values()].filter(
        (s) => s.fard && s.heir !== "husband" && s.heir !== "wife",
      );
      if (candidates.length && params.raddEnabled) {
        radd = true;
        const rest = sub(ONE, spouseFard);
        const pool = sum(candidates.map((s) => s.fard as Rational));
        for (const s of candidates) {
          s.share = div(mul(rest, s.fard as Rational), pool);
          s.reasons.push(reason("radd"));
        }
        raddBase = raddBaseOf(
          candidates.map((s) => s.fard as Rational),
          isZero(spouseFard) ? undefined : spouseFard,
        );
        steps.push({
          code: "radd",
          data: { surplus: toFractionString(surplus), base: Number(raddBase) },
        });
      } else {
        unallocated = { share: surplus, reason: candidates.length ? "treasury" : "spouse_only" };
        steps.push({
          code: "unallocated",
          data: { reason: unallocated.reason, share: toFractionString(surplus) },
        });
      }
    }
    if (mushtarakah && !mushtarakahShare) {
      for (const h of activeOf("full_brother", "full_sister")) {
        const slot = slots.get(h);
        if (slot && !slot.reasons.some((r) => r.code === "nothing_left"))
          slot.reasons.push(reason("nothing_left"));
      }
    }
  }
  if (awl)
    for (const s of slots.values()) if (s.fard && !isZero(s.share)) s.reasons.push(reason("awl"));

  // Classical base when only residuaries inherit: the residuary heads, a male
  // counting as two females only when both sexes share (3 sons → 3, not 6). A
  // grandfather who takes a third of the whole instead of sharing makes it 3.
  if (isZero(F)) {
    const heirsWithShare = [...slots.values()].filter((s) => !isZero(s.share));
    const gfThird = slots
      .get("paternal_grandfather")
      ?.reasons.some((r) => r.code === "muqasamah_third");
    asl = gfThird ? BigInt(3) : BigInt(Math.max(1, residuaryHeadsBase(heirsWithShare)));
  }

  // ── 10. Tashih ────────────────────────────────────────────────────────────
  const list = [...slots.values()];
  let tashih = BigInt(1);
  for (const s of list) tashih = lcm(tashih, div(s.share, rat(s.count)).d);
  if (unallocated) tashih = lcm(tashih, unallocated.share.d);
  steps.push({ code: "tashih", data: { base: Number(tashih) } });

  const total = add(sum(list.map((s) => s.share)), unallocated?.share ?? ZERO);
  if (cmp(total, ONE) !== 0) {
    throw new Error(`Mirath shares do not sum to 1 (${toFractionString(total)})`);
  }

  // Amounts (cents-exact): split the distributable estate by group share.
  let amounts: bigint[] | undefined;
  if (estateCalc) {
    const weights = [...list.map((s) => s.share), ...(unallocated ? [unallocated.share] : [])];
    amounts = allocateCents(centsOf(estateCalc.estate.distributable), weights);
    if (unallocated)
      unallocated = { ...unallocated, amount: amountOf(amounts[list.length] ?? BigInt(0)) };
  }

  const heirs: MirathHeirShare[] = list.map((s, i) => {
    const perHead = div(s.share, rat(s.count));
    const inherits = !isZero(s.share);
    const basis: MirathShareBasis = !inherits
      ? "none"
      : s.fard && s.asabah && cmp(s.share, s.fard) > 0
        ? "fard_and_asabah"
        : s.fard || s.reasons.some((r) => r.code === "akdariyyah")
          ? "fard"
          : "asabah";
    const groupCents = amounts?.[i];
    // Whole cents per head: when the group total doesn't divide evenly, some
    // heads get one cent more so the heads still add up to the group total.
    const lowCents = groupCents != null ? groupCents / BigInt(s.count) : undefined;
    const oddCents = groupCents != null ? groupCents % BigInt(s.count) : undefined;
    return {
      heir: s.heir,
      count: s.count,
      inherits,
      basis,
      share: s.share,
      perHead,
      sharesOfBase: (s.share.n * tashih) / s.share.d,
      perHeadSharesOfBase: (perHead.n * tashih) / perHead.d,
      percent: toPercent(s.share),
      ...(groupCents != null &&
        lowCents != null && {
          amount: amountOf(groupCents),
          perHeadAmount: amountOf(lowCents),
          perHeadAmountMax: amountOf(lowCents + (oddCents ? BigInt(1) : BigInt(0))),
          perHeadAmountMaxCount: Number(oddCents ?? 0),
        }),
      reasons: s.reasons,
    };
  });

  return {
    ...base,
    outcome: heirs.some((h) => h.inherits) ? "distributed" : "dhawu_al_arham",
    heirs,
    asl,
    ...(awlBase != null && { awlBase }),
    ...(raddBase != null && { raddBase }),
    tashihBase: tashih,
    awl,
    radd,
    specialCases,
    ...(unallocated && { unallocated }),
  };
}

/** Runs the same heirs under all four schools (all-views mode and the comparison table). */
export function calculateAllSchools(
  input: Omit<MirathInput, "school">,
): Record<MadhhabId, MirathResult> {
  const out = {} as Record<MadhhabId, MirathResult>;
  for (const school of MADHHAB_IDS) out[school] = calculateMirath({ ...input, school });
  return out;
}

/** Heir types whose share differs between at least two schools. */
export function differingHeirs(results: Record<MadhhabId, MirathResult>): HeirType[] {
  const out = new Set<HeirType>();
  const first = results[MADHHAB_IDS[0]];
  for (const school of MADHHAB_IDS.slice(1)) {
    const other = results[school];
    for (const h of HEIR_TYPES) {
      const a = first.heirs.find((x) => x.heir === h)?.share ?? ZERO;
      const b = other.heirs.find((x) => x.heir === h)?.share ?? ZERO;
      if (cmp(a, b) !== 0) out.add(h);
    }
  }
  return HEIR_TYPES.filter((h) => out.has(h));
}
