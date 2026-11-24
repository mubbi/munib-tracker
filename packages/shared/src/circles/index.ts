/**
 * Circles (NF-3.16 family, NF-3.17 partner, NF-3.18 group khatm) — shared
 * vocabulary and pure rules used by both `apps/api` (authoritative checks) and
 * `apps/app` (UI hints). See `docs/CIRCLES.md`.
 */

export const CIRCLE_TYPES = ["family", "partner", "khatm_group"] as const;
export type CircleType = (typeof CIRCLE_TYPES)[number];

export const CIRCLE_ROLES = ["owner", "admin", "parent", "member", "child"] as const;
export type CircleRole = (typeof CIRCLE_ROLES)[number];

export const CIRCLE_MEMBER_KINDS = ["user", "child"] as const;
export type CircleMemberKind = (typeof CIRCLE_MEMBER_KINDS)[number];

/** Roles an invite may grant, per circle type (owner is never invitable). */
export const INVITABLE_ROLES: Record<CircleType, readonly CircleRole[]> = {
  family: ["parent", "member"],
  partner: ["member"],
  khatm_group: ["admin", "member"],
};

/** Roles that manage a circle (invite, rename, remove members). */
export const MANAGER_ROLES: Record<CircleType, readonly CircleRole[]> = {
  family: ["owner", "parent"],
  // Partner circles are flat: every member may invite (capped at 5 members).
  partner: ["owner", "member"],
  khatm_group: ["owner", "admin"],
};

/** The five fard prayers — the ONLY content of a family `fard_status` signal (D7). */
export const FARD_PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type FardPrayer = (typeof FARD_PRAYERS)[number];
export type FardStatusValue = Record<FardPrayer, boolean>;

/**
 * Closed set of shared daily signals. `fard_status` (family), `rest_day`
 * (family, generic "rest day" with no reason — never hayd), `goal_done`
 * (partner; there is deliberately no "missed" state). Khatm progress lives in
 * `khatm_parts`, not in signals.
 */
export const CIRCLE_SIGNAL_KINDS = ["fard_status", "rest_day", "goal_done"] as const;
export type CircleSignalKind = (typeof CIRCLE_SIGNAL_KINDS)[number];

export const SIGNAL_KINDS_BY_CIRCLE: Record<CircleType, readonly CircleSignalKind[]> = {
  family: ["fard_status", "rest_day"],
  partner: ["goal_done"],
  khatm_group: [],
};

export const CIRCLE_NUDGE_KINDS = ["dua", "reminder"] as const;
export type CircleNudgeKind = (typeof CIRCLE_NUDGE_KINDS)[number];

export const KHATM_UNITS = ["juz", "hizb", "surah"] as const;
export type KhatmUnit = (typeof KHATM_UNITS)[number];

/** 30 juz (default), 60 hizb or 114 surahs. */
export const KHATM_UNIT_PART_COUNT: Record<KhatmUnit, number> = {
  juz: 30,
  hizb: 60,
  surah: 114,
};

export const KHATM_ASSIGNMENT_MODES = ["self_pick", "round_robin", "creator_assigns"] as const;
export type KhatmAssignmentMode = (typeof KHATM_ASSIGNMENT_MODES)[number];

export const KHATM_PART_STATUSES = ["open", "assigned", "reading", "done"] as const;
export type KhatmPartStatus = (typeof KHATM_PART_STATUSES)[number];

export const KHATM_STATUSES = ["active", "completed"] as const;
export type KhatmStatus = (typeof KHATM_STATUSES)[number];

export const CIRCLE_LIMITS = {
  nameMaxLength: 60,
  displayNameMaxLength: 32,
  nicknameMaxLength: 24,
  khatmTitleMaxLength: 80,
  khatmIntentionMaxLength: 280,
  rewardTitleMaxLength: 60,
  rewardMaxDays: 60,
  partnerMaxMembers: 5,
  partnerMinMembers: 2,
  familyMaxChildren: 12,
  khatmGroupMaxMembers: 200,
  maxActiveCirclesPerUser: 30,
  /** Invites created per user per rolling 24 h. */
  invitesPerUserPerDay: 20,
  /** Nudges per KIND per (sender, receiver) pair per circle per UTC day (D32: one dua + one reminder; `nudgeLimitDay`). */
  nudgesPerPairPerKindPerDay: 1,
  inviteDefaultTtlHours: 7 * 24,
  inviteMaxTtlHours: 30 * 24,
  /** One-time child-device link token TTL (QR). */
  childLinkTtlMinutes: 5,
  /** Signals may be written for today (+1 for time-zone slack) back to this many days. */
  signalBackfillDays: 14,
  /** Max day span of one signals read. */
  signalReadMaxDays: 35,
  /** Signals older than this are purged (data minimisation). */
  signalRetentionDays: 90,
  /** A member's signals are purged this long after they leave. */
  leftMemberRetentionDays: 30,
  nudgeRetentionDays: 30,
  /**
   * D34: child profiles transferred to a co-parent (the consenting parent
   * deleted their account) are deleted if consent isn't re-confirmed in time.
   */
  childConsentTransferDays: 30,
} as const;

/**
 * D34 error code (403 body `code`): the child profile was transferred to a
 * co-parent and parental consent is not yet re-confirmed. Parent-side
 * processing waits, and the server accepts no new data from the child device —
 * the child app keeps taps queued locally and uploads them once consent is
 * re-confirmed (a deleted profile discards the queue).
 */
export const CHILD_CONSENT_PENDING_CODE = "CHILD_CONSENT_PENDING";

/** `max_uses` default per circle type (§9.0). */
export const INVITE_DEFAULT_MAX_USES: Record<CircleType, number> = {
  family: 1,
  partner: 1,
  khatm_group: 200,
};

// ---------------------------------------------------------------------------
// Kids (D7): nickname + birth year only. Ages are approximate by design.
// ---------------------------------------------------------------------------

/** Kids mode applies below 13. */
export const KIDS_MODE_MAX_AGE = 13;
/** Under 7: "learning" — no tracking expectations (Abu Dawud 495 sets 7). */
export const KIDS_TRACKING_START_AGE = 7;
/** Graduation is re-offered at 15 (bulugh presumed by the majority). */
export const GRADUATION_REPROMPT_AGE = 15;

export type ChildAgeBand = "learning" | "gentle" | "graduate";

/**
 * Upper-bound age in whole years from a birth year (the child may be one year
 * younger). Only the birth year is stored, so this is deliberately coarse.
 */
export function approximateAge(birthYear: number, now: Date = new Date()): number {
  return now.getUTCFullYear() - birthYear;
}

/**
 * A child profile may be created when the child can still be under 13 this
 * year (approximate age ≤ 13) and the birth year is not in the future.
 */
export function isValidChildBirthYear(birthYear: number, now: Date = new Date()): boolean {
  if (!Number.isInteger(birthYear)) return false;
  const age = approximateAge(birthYear, now);
  return age >= 0 && age <= KIDS_MODE_MAX_AGE;
}

export function childAgeBand(birthYear: number, now: Date = new Date()): ChildAgeBand {
  const age = approximateAge(birthYear, now);
  if (age < KIDS_TRACKING_START_AGE) return "learning";
  if (age < KIDS_MODE_MAX_AGE) return "gentle";
  return "graduate";
}

/** True once the child is (approximately) old enough to be offered graduation. */
export function isGraduationAge(birthYear: number, now: Date = new Date()): boolean {
  return approximateAge(birthYear, now) >= KIDS_MODE_MAX_AGE;
}

/**
 * Graduation prompt stage (NF-3.16 "Graduation"):
 * - `offer` — from 13 (or earlier when a parent unlocked it);
 * - `reprompt` — from 15, offered again as a distinct prompt even if the
 *   first offer was dismissed. 15 is when the majority presume bulugh absent
 *   its physical signs; schools differ, so copy never states an age of
 *   obligation (docs/proofs/family-kids.md §3);
 * - `none` — not yet.
 */
export type GraduationPromptStage = "none" | "offer" | "reprompt";

export function graduationPromptStage(
  birthYear: number,
  graduationUnlocked: boolean,
  now: Date = new Date(),
): GraduationPromptStage {
  const age = approximateAge(birthYear, now);
  if (age >= GRADUATION_REPROMPT_AGE) return "reprompt";
  if (graduationUnlocked || age >= KIDS_MODE_MAX_AGE) return "offer";
  return "none";
}

/**
 * Whether to show the graduation prompt given the stage the child last
 * dismissed ("Not now"). Dismissing the 13 offer hides it until the 15
 * re-prompt; dismissing the re-prompt hides it for good (the parent's screen
 * and the graduate route still offer it).
 */
export function shouldShowGraduationPrompt(
  stage: GraduationPromptStage,
  dismissedStage: GraduationPromptStage | null | undefined,
): boolean {
  if (stage === "none") return false;
  return dismissedStage !== stage && dismissedStage !== "reprompt";
}

// ---------------------------------------------------------------------------
// Invite codes: 10 chars, RFC 4648 base32, stored hashed server-side.
// ---------------------------------------------------------------------------

export const INVITE_CODE_LENGTH = 10;
export const INVITE_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const INVITE_CODE_RE = /^[A-Z2-7]{10}$/;

/** Uppercases and strips spaces / dashes so `abcde-fghij` == `ABCDEFGHIJ`. */
export function normalizeInviteCode(raw: string): string {
  return raw.replace(/[\s-]+/g, "").toUpperCase();
}

export function isValidInviteCode(raw: string): boolean {
  return INVITE_CODE_RE.test(normalizeInviteCode(raw));
}

/** `ABCDE-FGHIJ` display grouping. */
export function formatInviteCode(code: string): string {
  const normalized = normalizeInviteCode(code);
  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

/** In-app deep-link path (prefix with the scheme or the HTTPS App Link host). */
export function circleJoinPath(code: string): string {
  return `circle/join/${normalizeInviteCode(code)}`;
}

// ---------------------------------------------------------------------------
// Dates (signals are keyed by the member's local calendar date, YYYY-MM-DD).
// ---------------------------------------------------------------------------

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function utcIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDaysIso(isoDate: string, days: number): string {
  return utcIsoDate(new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * DAY_MS));
}

/** Whole days from `from` to `to` (both YYYY-MM-DD). */
export function daysBetweenIso(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);
}

/**
 * Members write their own local date. Accept today ± time-zone slack (UTC
 * today - backfill … UTC today + 1).
 */
export function isSignalDateWritable(isoDate: string, now: Date = new Date()): boolean {
  if (!isIsoDate(isoDate)) return false;
  const offset = daysBetweenIso(utcIsoDate(now), isoDate);
  return offset <= 1 && offset >= -CIRCLE_LIMITS.signalBackfillDays;
}

/**
 * D32 rate-limit day for partner nudges: the **UTC calendar day** of the send.
 * The server stores no time zone, and sender and receiver may live in
 * different ones, so UTC is the one boundary applied identically to both. The
 * limit is one nudge per kind per (sender, receiver) pair per circle per day.
 * As with any calendar-day limit, a nudge just before and one just after
 * 00:00 UTC both count, each on its own day.
 */
export function nudgeLimitDay(now: Date): string {
  return utcIsoDate(now);
}

// ---------------------------------------------------------------------------
// Group khatm
// ---------------------------------------------------------------------------

export function khatmPartCount(unit: KhatmUnit): number {
  return KHATM_UNIT_PART_COUNT[unit];
}

/** Without a deadline a claimed part becomes reassignable after this many idle days. */
export const KHATM_STALE_DAYS_WITHOUT_DEADLINE = 7;
export const KHATM_STALE_MIN_DAYS = 2;

/**
 * Idle days before the creator may reassign a part: `max(2, (deadline − now) / 3)`
 * (NF-3.18). Without a deadline: 7 days.
 */
export function khatmStaleAfterDays(deadline: string | null, now: Date = new Date()): number {
  if (!deadline) return KHATM_STALE_DAYS_WITHOUT_DEADLINE;
  const remaining = daysBetweenIso(utcIsoDate(now), deadline);
  return Math.max(KHATM_STALE_MIN_DAYS, remaining / 3);
}

export function isKhatmPartStale(
  part: { status: KhatmPartStatus; updatedAt: Date },
  deadline: string | null,
  now: Date = new Date(),
): boolean {
  if (part.status !== "assigned" && part.status !== "reading") return false;
  const idleDays = (now.getTime() - part.updatedAt.getTime()) / DAY_MS;
  return idleDays >= khatmStaleAfterDays(deadline, now);
}

export function isKhatmDeadlinePassed(deadline: string | null, now: Date = new Date()): boolean {
  return deadline != null && daysBetweenIso(utcIsoDate(now), deadline) < 0;
}

/**
 * Round-robin needs at least this many members. With fewer (a creator who
 * starts the khatm before anyone has joined) the parts stay open and are dealt
 * once people join — otherwise the creator would be handed every part.
 */
export const KHATM_ROUND_ROBIN_MIN_MEMBERS = 2;

/**
 * Part numbers 1..N dealt to members in order (members sorted by join time).
 * Fewer than {@link KHATM_ROUND_ROBIN_MIN_MEMBERS} members → every part stays open.
 */
export function roundRobinAssignments(
  partCount: number,
  memberIds: readonly string[],
): Array<{ partNo: number; memberId: string | null }> {
  const dealTo = memberIds.length >= KHATM_ROUND_ROBIN_MIN_MEMBERS ? memberIds : [];
  return Array.from({ length: partCount }, (_, index) => ({
    partNo: index + 1,
    memberId: dealTo.length ? (dealTo[index % dealTo.length] ?? null) : null,
  }));
}

export type KhatmDealPart = {
  partNo: number;
  status: KhatmPartStatus;
  assigneeMemberId?: string | null;
  /**
   * L12: the assignment came from dealing (not a member's own claim or a
   * manager's assignment). Only dealt `assigned` parts are re-dealt; `false`
   * pins the part to its holder. Absent counts as dealt (legacy callers).
   */
  dealt?: boolean;
};

/** One part handed to `to` (`from` is its previous not-started holder, or null if it was open). */
export type KhatmDealMove = { partNo: number; from: string | null; to: string };

/**
 * "Deal remaining parts" for a round-robin khatm (on join, or by a manager).
 *
 * Only parts nobody has started are dealt: `open` parts and `assigned` parts
 * not yet being read that were themselves dealt. `reading` and `done` parts —
 * and parts a member claimed or a manager assigned (`dealt: false`) — never
 * move and don't count toward anyone's share. The not-started
 * pool is split as evenly as possible over the current members (join order;
 * the first `pool % n` members take one extra). Each member keeps their own
 * lowest-numbered not-started parts up to their share; the rest — open parts,
 * surplus parts and parts of non-members — are dealt in part order to members
 * still below their share, cycling in join order. On an all-open grid this is
 * exactly {@link roundRobinAssignments}. Stable and minimal: re-running it on its
 * own result returns no moves. Fewer than {@link KHATM_ROUND_ROBIN_MIN_MEMBERS}
 * members → no moves.
 */
export function planKhatmDeal(
  parts: readonly KhatmDealPart[],
  memberIds: readonly string[],
): KhatmDealMove[] {
  const members = [...new Set(memberIds)];
  if (members.length < KHATM_ROUND_ROBIN_MIN_MEMBERS) return [];
  const pool = parts
    .filter(
      (part) => part.status === "open" || (part.status === "assigned" && part.dealt !== false),
    )
    .sort((a, b) => a.partNo - b.partNo);
  const base = Math.floor(pool.length / members.length);
  const extra = pool.length % members.length;
  const need = new Map(members.map((id, index) => [id, base + (index < extra ? 1 : 0)]));

  const toDeal: KhatmDealPart[] = [];
  for (const part of pool) {
    const holder = part.status === "assigned" ? (part.assigneeMemberId ?? null) : null;
    const holderNeed = holder ? need.get(holder) : undefined;
    if (holder && holderNeed) {
      need.set(holder, holderNeed - 1);
    } else {
      toDeal.push(part);
    }
  }

  const moves: KhatmDealMove[] = [];
  let cursor = 0;
  for (const part of toDeal) {
    for (let step = 0; step < members.length; step += 1) {
      const index = (cursor + step) % members.length;
      const id = members[index] as string;
      const remaining = need.get(id) ?? 0;
      if (remaining > 0) {
        need.set(id, remaining - 1);
        moves.push({
          partNo: part.partNo,
          from: part.status === "assigned" ? (part.assigneeMemberId ?? null) : null,
          to: id,
        });
        cursor = (index + 1) % members.length;
        break;
      }
    }
  }
  return moves;
}

/** Apply {@link planKhatmDeal} moves to a part list (optimistic UI; the server answer replaces it). */
export function applyKhatmDeal<T extends KhatmDealPart>(
  parts: readonly T[],
  moves: readonly KhatmDealMove[],
): T[] {
  const byPart = new Map(moves.map((move) => [move.partNo, move.to]));
  return parts.map((part) => {
    const to = byPart.get(part.partNo);
    return to ? { ...part, status: "assigned" as const, assigneeMemberId: to, dealt: true } : part;
  });
}
