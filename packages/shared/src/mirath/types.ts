import type { MirathSchoolParams } from "../fiqh/madhhab-rules";
import type { HeirType } from "../types/heirs";
import type { MadhhabId } from "../types/preferences";
import type { Rational } from "./rational";

export type { HeirType } from "../types/heirs";

/** Living, Muslim heirs who did not kill the deceased, by count (the UI confirms the impediments). */
export type MirathHeirCounts = Partial<Record<HeirType, number>>;

export interface MirathEstateInput {
  gross: number;
  funeral: number;
  debts: number;
  bequests: number;
  currency: string;
}

export interface MirathInput {
  school: MadhhabId;
  deceased: { gender: "male" | "female" };
  estate?: MirathEstateInput;
  heirs: MirathHeirCounts;
  /** Scholar-given overrides of the school's disputed-case parameters (rarely used). */
  params?: Partial<MirathSchoolParams>;
}

export type MirathIssueCode =
  | "count_invalid"
  | "too_many_wives"
  | "husband_and_wife"
  | "husband_needs_female_deceased"
  | "wife_needs_male_deceased"
  | "only_one_allowed"
  | "estate_negative"
  | "debts_exceed_estate";

export interface MirathIssue {
  code: MirathIssueCode;
  heir?: HeirType;
}

/** Net estate after funeral costs and debts, then bequests capped at ⅓ (Bukhari 2742). */
export interface MirathNetEstate {
  currency: string;
  gross: number;
  funeral: number;
  debts: number;
  net: number;
  bequestsRequested: number;
  bequests: number;
  bequestCapped: boolean;
  distributable: number;
}

/** Why an heir gets (or doesn't get) what they get — rendered as "Why?" per heir. */
export type MirathReasonCode =
  // exclusion
  | "excluded"
  | "nothing_left"
  // fixed shares
  | "husband_half"
  | "husband_quarter"
  | "wife_quarter"
  | "wife_eighth"
  | "mother_third"
  | "mother_sixth_descendant"
  | "mother_sixth_siblings"
  | "mother_third_of_remainder"
  | "father_sixth"
  | "father_sixth_and_residue"
  | "father_residue"
  | "grandfather_sixth"
  | "grandfather_sixth_and_residue"
  | "grandfather_residue"
  | "grandmother_sixth"
  | "daughter_half"
  | "daughters_two_thirds"
  | "sons_daughter_half"
  | "sons_daughters_two_thirds"
  | "sons_daughter_sixth"
  | "sister_half"
  | "sisters_two_thirds"
  | "paternal_sister_sixth"
  | "maternal_sixth"
  | "maternal_third"
  // residuaries
  | "residuary_self"
  | "residuary_with_male"
  | "residuary_with_daughters"
  // adjustments + special cases
  | "awl"
  | "radd"
  | "umariyyatayn"
  | "mushtarakah_share"
  | "mushtarakah_excluded"
  | "akdariyyah"
  | "malikiyyah"
  | "muqasamah_share"
  | "muqasamah_third"
  | "muqasamah_sixth"
  | "muqasamah_siblings"
  | "muaddah_counted"
  | "muaddah_reclaim";

export interface MirathReason {
  code: MirathReasonCode;
  /** Fraction as text ("1/6") where the reason names one. */
  fraction?: string;
  /** Heirs responsible (exclusion / sharing partner). */
  by?: HeirType[];
}

export type MirathShareBasis = "fard" | "asabah" | "fard_and_asabah" | "none";

export interface MirathHeirShare {
  heir: HeirType;
  count: number;
  inherits: boolean;
  basis: MirathShareBasis;
  /** Whole group's share of the distributable estate (after 'awl / radd). */
  share: Rational;
  /** One head's share. */
  perHead: Rational;
  /** Integer shares of `tashihBase` (group / one head). */
  sharesOfBase: bigint;
  perHeadSharesOfBase: bigint;
  /** Display percentage of the group's share. */
  percent: number;
  /** Amounts in the estate currency when an estate was given (cents-exact sum). */
  amount?: number;
  /** One head's amount in whole cents (the lower one when the group total doesn't divide evenly). */
  perHeadAmount?: number;
  /** `perHeadAmount` + one cent when the cents don't divide evenly, else equal to it. */
  perHeadAmountMax?: number;
  /** How many heads get `perHeadAmountMax` (0 when every head gets the same). */
  perHeadAmountMaxCount?: number;
  reasons: MirathReason[];
}

export type MirathSpecialCase =
  | "umariyyatayn"
  | "mushtarakah"
  | "akdariyyah"
  | "malikiyyah"
  | "shibh_malikiyyah"
  | "grandfather_siblings";

export type MirathStepCode =
  | "validate"
  | "estate"
  | "exclusion"
  | "furud"
  | "asabah"
  | "awl"
  | "radd"
  | "unallocated"
  | "tashih";

export interface MirathStep {
  code: MirathStepCode;
  /** Free-form numbers for the explanation view (fractions as text). */
  data?: Record<string, string | number | boolean>;
}

export type MirathOutcome =
  /** Shares assigned (possibly with 'awl or radd). */
  | "distributed"
  /** No heir in v1's list: distant kindred / treasury — consult a scholar. */
  | "dhawu_al_arham"
  | "invalid";

export type MirathUnallocatedReason =
  /** Only a spouse: the rest goes to distant kindred, else (scholars differ) back to the spouse or the treasury. */
  | "spouse_only"
  /** Radd turned off (classical Shafi'i / Maliki): the surplus goes to the public treasury. */
  | "treasury";

export interface MirathResult {
  school: MadhhabId;
  params: MirathSchoolParams;
  outcome: MirathOutcome;
  issues: MirathIssue[];
  heirs: MirathHeirShare[];
  /** Original base (LCM of the fixed-share denominators; heads when only residuaries). */
  asl: bigint;
  /** Raised base after 'awl, else undefined. */
  awlBase?: bigint;
  /** Base after radd (sum of the radd heirs' shares; combined with the spouse's base), else undefined. */
  raddBase?: bigint;
  /** Smallest base giving every head a whole number of shares. */
  tashihBase: bigint;
  awl: boolean;
  radd: boolean;
  specialCases: MirathSpecialCase[];
  unallocated?: { share: Rational; reason: MirathUnallocatedReason; amount?: number };
  estate?: MirathNetEstate;
  steps: MirathStep[];
}
