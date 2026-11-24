import {
  type CircleRole,
  type CircleSignalKind,
  type CircleType,
  INVITABLE_ROLES,
  MANAGER_ROLES,
  SIGNAL_KINDS_BY_CIRCLE,
} from "@munib-tracker/shared/circles";

/**
 * Pure authorisation rules for circles. Every service call resolves the
 * caller's active membership first (non-members get 404), then asks these.
 */

export type PolicyMember = {
  memberId: string;
  memberKind: "user" | "child";
  role: CircleRole;
  shareScope: { paused?: boolean; shareFardStatus?: boolean };
};

export function isManager(type: CircleType, role: CircleRole): boolean {
  return MANAGER_ROLES[type].includes(role);
}

export function isParentRole(role: CircleRole): boolean {
  return role === "owner" || role === "parent";
}

/**
 * A parent invite grants access to the children's data, so it is tightly
 * scoped: only the owner may mint one, it is single-use, and it lives at most
 * this long (vs. `CIRCLE_LIMITS.inviteMaxTtlHours` for other invites).
 */
export const PARENT_INVITE_MAX_TTL_HOURS = 48;

export function canInviteRole(type: CircleType, actorRole: CircleRole, role: CircleRole): boolean {
  if (!isManager(type, actorRole)) return false;
  if (!INVITABLE_ROLES[type].includes(role)) return false;
  // Only the owner may mint admin invites (khatm group) or parent invites (family).
  if (role === "admin" || role === "parent") return actorRole === "owner";
  return true;
}

export function isSignalKindAllowed(type: CircleType, kind: CircleSignalKind): boolean {
  return SIGNAL_KINDS_BY_CIRCLE[type].includes(kind);
}

/**
 * Who may write `kind` for `target`:
 * - family `fard_status`: the child itself, or a parent on the child's behalf;
 *   an adult member only for themself after opting in (graduated child).
 *   Parents' own salah is never shared.
 * - family `rest_day`: parents only, for children (generic — never a reason).
 * - partner `goal_done`: only yourself, and only while sharing isn't paused.
 */
export function canWriteSignal(
  type: CircleType,
  kind: CircleSignalKind,
  actor: PolicyMember,
  target: PolicyMember,
): boolean {
  if (!isSignalKindAllowed(type, kind)) return false;
  const self = actor.memberId === target.memberId;
  if (type === "family") {
    if (kind === "rest_day") return target.memberKind === "child" && isParentRole(actor.role);
    if (target.memberKind === "child") return self || isParentRole(actor.role);
    return self && target.role === "member" && target.shareScope.shareFardStatus === true;
  }
  if (type === "partner") return self && target.shareScope.paused !== true;
  return false;
}

/**
 * Who may read `target`'s signals:
 * - yourself, always;
 * - family parents: children, plus adult members who opted in to share;
 * - partner: every member who isn't paused.
 */
export function canReadSignals(
  type: CircleType,
  actor: PolicyMember,
  target: PolicyMember,
): boolean {
  if (actor.memberId === target.memberId) return true;
  if (type === "family") {
    if (!isParentRole(actor.role) || actor.memberKind !== "user") return false;
    if (target.memberKind === "child") return true;
    return target.role === "member" && target.shareScope.shareFardStatus === true;
  }
  if (type === "partner") return target.shareScope.paused !== true;
  return false;
}

/**
 * Ownership successor on leave / account deletion: the oldest eligible adult.
 * A family passes only to another parent (never to a young adult member, who
 * must not inherit siblings' child profiles); `null` dissolves the circle.
 */
export function pickSuccessor<T extends PolicyMember & { joinedAt: Date }>(
  type: CircleType,
  candidates: readonly T[],
): T | null {
  const adults = candidates
    .filter((member) => member.memberKind === "user" && member.role !== "owner")
    .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());
  if (type === "family") return adults.find((member) => member.role === "parent") ?? null;
  if (type === "khatm_group") {
    return adults.find((member) => member.role === "admin") ?? adults[0] ?? null;
  }
  return adults[0] ?? null;
}
