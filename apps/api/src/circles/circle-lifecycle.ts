import { addDaysIso, CIRCLE_LIMITS, utcIsoDate } from "@munib-tracker/shared/circles";
import { type EntityManager, In, IsNull, LessThan, Not } from "typeorm";
import {
  ChildProfileEntity,
  CircleDailySignalEntity,
  CircleEntity,
  CircleInviteEntity,
  CircleMemberEntity,
  CircleNearbyRequestEntity,
  CircleNearbySessionEntity,
  CircleNudgeEntity,
  GroupKhatmEntity,
  KhatmPartEntity,
} from "../database/entities";
import { pickSuccessor } from "./circle-policy";

/**
 * Deletion / retention primitives shared by the circles services and the
 * account-deletion path (`AuthService.deleteAccount`). All take an
 * `EntityManager` so callers can run them inside their own transaction.
 */

const DAY_MS = 86_400_000;

async function khatmIdsOf(manager: EntityManager, circleId: string): Promise<string[]> {
  const rows = await manager.find(GroupKhatmEntity, { where: { circleId }, select: { id: true } });
  return rows.map((row) => row.id);
}

/** Return a member's unfinished parts to the pool (optionally in one circle only). */
export async function releaseMemberParts(
  manager: EntityManager,
  memberId: string,
  now: Date,
  circleId?: string,
): Promise<void> {
  const where: Record<string, unknown> = {
    assigneeMemberId: memberId,
    status: In(["assigned", "reading"]),
  };
  if (circleId) {
    const ids = await khatmIdsOf(manager, circleId);
    if (!ids.length) return;
    where.khatmId = In(ids);
  }
  await manager.update(KhatmPartEntity, where, {
    assigneeMemberId: null,
    status: "open",
    dealt: false,
    updatedAt: now,
  });
}

/** NF-3.25: delete nearby sessions matching `where` and every request on them. */
export async function deleteNearbySessions(
  manager: EntityManager,
  where: Record<string, unknown>,
): Promise<void> {
  const sessions = await manager.find(CircleNearbySessionEntity, {
    where,
    select: { id: true },
  });
  if (!sessions.length) return;
  const ids = sessions.map((session) => session.id);
  await manager.delete(CircleNearbyRequestEntity, { sessionId: In(ids) });
  await manager.delete(CircleNearbySessionEntity, { id: In(ids) });
}

/** Immediate, hard delete of a child profile and everything keyed to it (D7). */
export async function deleteChildProfileData(
  manager: EntityManager,
  child: Pick<ChildProfileEntity, "id" | "circleId">,
): Promise<void> {
  await manager.delete(CircleDailySignalEntity, { memberId: child.id });
  await manager.delete(CircleNudgeEntity, { fromMember: child.id });
  await manager.delete(CircleNudgeEntity, { toMember: child.id });
  await deleteNearbySessions(manager, { childId: child.id });
  await manager.delete(CircleMemberEntity, { circleId: child.circleId, memberId: child.id });
  await manager.delete(ChildProfileEntity, { id: child.id });
}

/**
 * Delete every row of a circle and leave a content-free tombstone (no name, no
 * owner) that `purgeExpiredCircleData` removes after the retention window.
 */
export async function dissolveCircle(
  manager: EntityManager,
  circleId: string,
  now: Date,
): Promise<void> {
  const khatmIds = await khatmIdsOf(manager, circleId);
  if (khatmIds.length) await manager.delete(KhatmPartEntity, { khatmId: In(khatmIds) });
  await manager.delete(GroupKhatmEntity, { circleId });
  await manager.delete(CircleDailySignalEntity, { circleId });
  await manager.delete(CircleNudgeEntity, { circleId });
  await manager.delete(CircleInviteEntity, { circleId });
  await deleteNearbySessions(manager, { circleId });
  await manager.delete(ChildProfileEntity, { circleId });
  await manager.delete(CircleMemberEntity, { circleId });
  await manager.update(
    CircleEntity,
    { id: circleId },
    { name: null, ownerId: null, settings: {}, deletedAt: now },
  );
}

/**
 * When the owner goes, hand the circle to the oldest eligible adult
 * (`pickSuccessor`) or dissolve it when there is none.
 */
export async function handOverOrDissolve(
  manager: EntityManager,
  circle: Pick<CircleEntity, "id" | "type" | "ownerId">,
  leavingMemberId: string,
  now: Date,
): Promise<"none" | "transferred" | "dissolved"> {
  if (circle.ownerId !== leavingMemberId) return "none";
  const remaining = await manager.find(CircleMemberEntity, {
    where: { circleId: circle.id, leftAt: IsNull(), memberId: Not(leavingMemberId) },
  });
  const successor = pickSuccessor(circle.type, remaining);
  if (!successor) {
    await dissolveCircle(manager, circle.id, now);
    return "dissolved";
  }
  await manager.update(
    CircleMemberEntity,
    { circleId: circle.id, memberId: successor.memberId },
    { role: "owner" },
  );
  await manager.update(CircleEntity, { id: circle.id }, { ownerId: successor.memberId });
  return "transferred";
}

/**
 * D34: the consenting parent is deleting their account. With another parent
 * (owner / parent role, linked user) still in the family, the profile passes to
 * the longest-standing one with consent **pending** — the child's device keeps
 * logging its own fard status, but the parent view stays hidden until that
 * parent re-confirms (`POST …/children/:childId/consent`); the retention sweep
 * deletes it after `childConsentTransferDays`. An already-pending transfer keeps
 * its original clock. With no co-parent the profile is deleted immediately.
 */
export async function transferOrDeleteChildProfile(
  manager: EntityManager,
  child: Pick<ChildProfileEntity, "id" | "circleId" | "consentTransferredAt">,
  leavingUserId: string,
  now: Date,
): Promise<"transferred" | "deleted"> {
  const coParents = await manager.find(CircleMemberEntity, {
    where: {
      circleId: child.circleId,
      memberKind: "user",
      role: In(["owner", "parent"]),
      leftAt: IsNull(),
      memberId: Not(leavingUserId),
    },
    order: { joinedAt: "ASC" },
  });
  const coParent = coParents[0];
  if (!coParent) {
    await deleteChildProfileData(manager, child);
    return "deleted";
  }
  await manager.update(
    ChildProfileEntity,
    { id: child.id },
    {
      createdBy: coParent.memberId,
      consentTransferredAt: child.consentTransferredAt ?? now,
      // A pending profile can't be (re)linked until consent is re-confirmed.
      linkTokenHash: null,
      linkTokenExpiresAt: null,
    },
  );
  return "transferred";
}

/**
 * D34 hand-over when a parent stops being a parent of the family — they leave,
 * are removed, are demoted to `member`, or delete their account: every child
 * profile in `circleId` they consented to goes to the longest-standing remaining
 * parent with consent pending (or is deleted when there is none), so nobody
 * keeps processing the child's data under a departed parent's consent.
 */
export async function transferChildrenConsentedBy(
  manager: EntityManager,
  circleId: string,
  userId: string,
  now: Date,
): Promise<void> {
  const children = await manager.find(ChildProfileEntity, {
    where: { circleId, createdBy: userId },
    select: { id: true, circleId: true, consentTransferredAt: true },
  });
  for (const child of children) {
    await transferOrDeleteChildProfile(manager, child, userId, now);
  }
}

/**
 * Account-deletion cascade. Runs inside the `deleteAccount` transaction:
 * owned circles are handed over or dissolved, child profiles this parent
 * consented to are transferred to a remaining co-parent with consent pending
 * (D34) or deleted when there is none, and the user's memberships, signals,
 * nudges and invites are removed. Finished khatm parts stay done but lose the
 * assignee.
 */
export async function purgeUserCircleData(
  manager: EntityManager,
  userId: string,
  now: Date = new Date(),
): Promise<void> {
  const owned = await manager.find(CircleEntity, {
    where: { ownerId: userId, deletedAt: IsNull() },
  });
  for (const circle of owned) {
    await handOverOrDissolve(manager, circle, userId, now);
  }

  const children = await manager.find(ChildProfileEntity, {
    where: { createdBy: userId },
    select: { id: true, circleId: true, consentTransferredAt: true },
  });
  for (const child of children) {
    await transferOrDeleteChildProfile(manager, child, userId, now);
  }

  await releaseMemberParts(manager, userId, now);
  await manager.update(
    KhatmPartEntity,
    { assigneeMemberId: userId, status: "done" },
    { assigneeMemberId: null },
  );
  await manager.update(GroupKhatmEntity, { createdBy: userId }, { createdBy: null });
  await manager.delete(CircleDailySignalEntity, { memberId: userId });
  await manager.delete(CircleNudgeEntity, { fromMember: userId });
  await manager.delete(CircleNudgeEntity, { toMember: userId });
  await manager.delete(CircleInviteEntity, { createdBy: userId });
  await deleteNearbySessions(manager, { createdBy: userId });
  await manager.delete(CircleNearbyRequestEntity, { requesterId: userId });
  await manager.delete(CircleMemberEntity, { memberId: userId, memberKind: "user" });
}

/**
 * Retention sweep (docs/CIRCLES.md):
 * - signals older than 90 days;
 * - a departed member's signals and membership row 30 days after leaving;
 * - nudges after 30 days;
 * - invites 30 days after expiry / revocation;
 * - circle tombstones 30 days after dissolution;
 * - expired one-time child link tokens;
 * - nearby sessions (and their requests) a day after they expired (NF-3.25);
 * - transferred child profiles still awaiting consent after 30 days (D34).
 */
export async function purgeExpiredCircleData(
  manager: EntityManager,
  now: Date = new Date(),
): Promise<void> {
  const retentionCutoff = new Date(now.getTime() - CIRCLE_LIMITS.leftMemberRetentionDays * DAY_MS);
  const oldestSignalDate = addDaysIso(utcIsoDate(now), -CIRCLE_LIMITS.signalRetentionDays);

  await manager.delete(CircleDailySignalEntity, { date: LessThan(oldestSignalDate) });

  const departed = await manager.find(CircleMemberEntity, {
    where: { leftAt: LessThan(retentionCutoff) },
    select: { circleId: true, memberId: true },
  });
  for (const member of departed) {
    await manager.delete(CircleDailySignalEntity, {
      circleId: member.circleId,
      memberId: member.memberId,
    });
    await manager.delete(CircleMemberEntity, {
      circleId: member.circleId,
      memberId: member.memberId,
    });
  }

  const nudgeCutoff = new Date(now.getTime() - CIRCLE_LIMITS.nudgeRetentionDays * DAY_MS);
  await manager.delete(CircleNudgeEntity, { createdAt: LessThan(nudgeCutoff) });
  await manager.delete(CircleInviteEntity, { expiresAt: LessThan(retentionCutoff) });
  await manager.delete(CircleInviteEntity, { revokedAt: LessThan(retentionCutoff) });
  await deleteNearbySessions(manager, { expiresAt: LessThan(new Date(now.getTime() - DAY_MS)) });
  await manager.delete(CircleEntity, { deletedAt: LessThan(retentionCutoff) });
  await manager.update(
    ChildProfileEntity,
    { linkTokenExpiresAt: LessThan(now) },
    { linkTokenHash: null, linkTokenExpiresAt: null },
  );

  // D34: transferred profiles whose consent wasn't re-confirmed in time.
  const consentCutoff = new Date(now.getTime() - CIRCLE_LIMITS.childConsentTransferDays * DAY_MS);
  const lapsed = await manager.find(ChildProfileEntity, {
    where: { consentTransferredAt: LessThan(consentCutoff) },
    select: { id: true, circleId: true },
  });
  for (const child of lapsed) {
    await deleteChildProfileData(manager, child);
  }
}
