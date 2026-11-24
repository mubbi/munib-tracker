import { CHILD_CONSENT_PENDING_CODE } from "@munib-tracker/shared/circles";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "../auth/auth.service";
import { AccountClosureReason, AuthProvider } from "../auth/dto/auth.dto";
import {
  ChildProfileEntity,
  CircleDailySignalEntity,
  CircleEntity,
  CircleInviteEntity,
  CircleMemberEntity,
  CircleNudgeEntity,
  KhatmPartEntity,
} from "../database/entities";
import {
  BED_TIMEOUT_MS,
  birthYearForAge,
  type CirclesTestBed,
  circleWithMembers,
  createCirclesTestBed,
  memberIdIn,
  todayIso,
  type UserActor,
} from "../test-support/circles";
import { purgeExpiredCircleData, purgeUserCircleData } from "./circle-lifecycle";
import { CIRCLE_RETENTION_INTERVAL_MS } from "./circle-retention.service";

const DAY_MS = 86_400_000;
const ALL = { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };

describe("circle deletion & retention", () => {
  let bed: CirclesTestBed;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  it("cascades account deletion through circles", async () => {
    const auth = bed.module.get(AuthService);
    const session = await auth.completeOAuth(AuthProvider.Google, { code: "c" });
    const deleted: UserActor = { kind: "user", userId: session.userId, accountType: "user" };
    const coParent = await bed.user();
    const partnerFriend = await bed.user();
    const khatmOwner = await bed.user();

    // Owned family with a co-parent and a child this parent consented to.
    const family = await circleWithMembers(bed, "family", deleted, [
      { actor: coParent, role: "parent" },
    ]);
    const child = await bed.children.create(deleted, family.id, {
      nickname: "Ali",
      birthYear: birthYearForAge(8),
      parentalConsent: true,
      consentPolicyVersion: "2026-11",
    });
    await bed.signals.putFardStatus(coParent, family.id, {
      date: todayIso(),
      memberId: child.id,
      ...ALL,
    });
    // Owned partner circle with one friend, plus signals and a nudge.
    const partner = await circleWithMembers(bed, "partner", deleted, [{ actor: partnerFriend }]);
    await bed.signals.putGoalDone(deleted, partner.id, { date: todayIso() });
    await bed.signals.nudge(partnerFriend, partner.id, {
      toMemberId: memberIdIn(partner.id, deleted),
      kind: "dua",
    });
    // Member of someone else's khatm with one part in progress and one done.
    const khatmCircle = await circleWithMembers(bed, "khatm_group", khatmOwner, [
      { actor: deleted },
    ]);
    const khatm = await bed.khatms.create(khatmOwner, khatmCircle.id, { title: "K" });
    await bed.khatms.partAction(deleted, khatmCircle.id, khatm.id, 1, "claim");
    await bed.khatms.partAction(deleted, khatmCircle.id, khatm.id, 1, "complete");
    await bed.khatms.partAction(deleted, khatmCircle.id, khatm.id, 2, "claim");

    await auth.deleteAccount(session.accessToken, {
      confirmation: "DELETE",
      primaryReason: AccountClosureReason.PrivacyConcerns,
    });

    const repo = <T extends object>(entity: new () => T) => bed.dataSource.getRepository(entity);
    // Family handed to the co-parent; the consented child profile transfers to
    // them with consent pending (D34) and keeps its own signals.
    expect((await bed.circles.detail(coParent, family.id)).myRole).toBe("owner");
    const transferred = await repo(ChildProfileEntity).findOneByOrFail({ id: child.id });
    expect(transferred.createdBy).toBe(coParent.userId);
    expect(transferred.consentTransferredAt).toBeInstanceOf(Date);
    // Partner circle handed to the friend.
    expect((await bed.circles.detail(partnerFriend, partner.id)).memberCount).toBe(1);
    // Nothing keyed to the deleted user remains.
    expect(await repo(CircleMemberEntity).count({ where: { memberId: deleted.userId } })).toBe(0);
    expect(await repo(CircleDailySignalEntity).count({ where: { memberId: deleted.userId } })).toBe(
      0,
    );
    expect(await repo(CircleDailySignalEntity).count({ where: { memberId: child.id } })).toBe(1);
    expect(await repo(CircleNudgeEntity).count()).toBe(0);
    expect(await repo(CircleInviteEntity).count({ where: { createdBy: deleted.userId } })).toBe(0);
    const parts = await repo(KhatmPartEntity).find({
      where: { khatmId: khatm.id },
      order: { partNo: "ASC" },
    });
    expect(parts[0]).toMatchObject({ status: "done", assigneeMemberId: null });
    expect(parts[1]).toMatchObject({ status: "open", assigneeMemberId: null });
  });

  it("dissolves an owned circle with no eligible successor", async () => {
    const auth = bed.module.get(AuthService);
    const session = await auth.completeOAuth(AuthProvider.Google, { code: "c" });
    const owner: UserActor = { kind: "user", userId: session.userId, accountType: "user" };
    const family = await bed.circles.create(owner, { type: "family", name: "Solo" });
    await auth.deleteAccount(session.accessToken, {
      confirmation: "DELETE",
      primaryReason: AccountClosureReason.PrivacyConcerns,
    });
    const tombstone = await bed.dataSource
      .getRepository(CircleEntity)
      .findOneByOrFail({ id: family.id });
    expect(tombstone).toMatchObject({ name: null, ownerId: null });
    expect(tombstone.deletedAt).toBeInstanceOf(Date);
  });

  it("purges old signals, departed members after 30 days, old nudges and tombstones", async () => {
    const owner = await bed.user();
    const friend = await bed.user();
    const partner = await circleWithMembers(bed, "partner", owner, [{ actor: friend }]);
    await bed.signals.putGoalDone(friend, partner.id, { date: todayIso() });
    await bed.signals.putGoalDone(owner, partner.id, { date: todayIso() });
    await bed.circles.leave(friend, partner.id);
    const signals = bed.dataSource.getRepository(CircleDailySignalEntity);
    await signals.save(
      signals.create({
        circleId: partner.id,
        memberId: owner.userId,
        date: "2020-01-01",
        kind: "goal_done",
        value: { done: true },
      }),
    );

    // Within 30 days of leaving, the departed member's signal is kept.
    await bed.dataSource.transaction((m) => purgeExpiredCircleData(m, new Date()));
    expect(await signals.count({ where: { memberId: friend.userId } })).toBe(1);
    expect(await signals.count({ where: { date: "2020-01-01" } })).toBe(0);

    const later = new Date(Date.now() + 31 * DAY_MS);
    await bed.dataSource.transaction((m) => purgeExpiredCircleData(m, later));
    expect(await signals.count({ where: { memberId: friend.userId } })).toBe(0);
    expect(await signals.count({ where: { memberId: owner.userId } })).toBe(1);
    expect(
      await bed.dataSource
        .getRepository(CircleMemberEntity)
        .count({ where: { memberId: friend.userId } }),
    ).toBe(0);
  });

  describe("D34: child profiles when the consenting parent deletes their account", () => {
    async function familyWithChild(withCoParent: boolean) {
      const auth = bed.module.get(AuthService);
      const session = await auth.completeOAuth(AuthProvider.Google, { code: "c" });
      const consenting: UserActor = { kind: "user", userId: session.userId, accountType: "user" };
      const coParent = await bed.user();
      const family = await circleWithMembers(
        bed,
        "family",
        consenting,
        withCoParent ? [{ actor: coParent, role: "parent" }] : [],
      );
      const child = await bed.children.create(consenting, family.id, {
        nickname: "Sara",
        birthYear: birthYearForAge(9),
        parentalConsent: true,
        consentPolicyVersion: "2026-11",
      });
      const link = await bed.children.createDeviceLink(consenting, family.id, child.id);
      const childSession = await bed.children.redeemDeviceLink(link.linkToken, "10.0.0.1");
      const childActor = await bed.actors.resolveChildToken(childSession.childToken);
      const childAct = {
        kind: "child" as const,
        childId: childActor.id,
        circleId: childActor.circleId,
      };
      await auth.deleteAccount(session.accessToken, {
        confirmation: "DELETE",
        primaryReason: AccountClosureReason.PrivacyConcerns,
      });
      return { family, child, coParent, childAct };
    }

    it("deletes immediately when no co-parent remains", async () => {
      const { family } = await familyWithChild(false);
      expect(
        await bed.dataSource.getRepository(ChildProfileEntity).count({
          where: { circleId: family.id },
        }),
      ).toBe(0);
    });

    it("transfers with consent pending: nothing new is accepted, parent view hidden", async () => {
      const { family, child, coParent, childAct } = await familyWithChild(true);
      const [listed] = await bed.children.list(coParent, family.id);
      expect(listed).toMatchObject({ id: child.id, consentPending: true });
      expect(listed?.consentPendingUntil).toBeTruthy();
      const detail = await bed.circles.detail(coParent, family.id);
      expect(detail.members.find((m) => m.memberId === child.id)?.child?.consentPending).toBe(true);
      // The child session still resolves and can read its profile (calm note in the app).
      expect(await bed.children.me(childAct)).toMatchObject({ consentPending: true });

      // A5: the child device's writes are refused with the typed code (it queues locally).
      const range = { from: todayIso(), to: todayIso() };
      const consentPending = { status: 403, response: { code: CHILD_CONSENT_PENDING_CODE } };
      await expect(
        bed.signals.putFardStatus(childAct, family.id, { date: todayIso(), ...ALL }),
      ).rejects.toMatchObject(consentPending);
      await expect(
        bed.signals.clear(childAct, family.id, "fard_status", todayIso()),
      ).rejects.toMatchObject(consentPending);
      expect((await bed.signals.list(childAct, family.id, range)).items).toHaveLength(0);
      // The parent view is hidden and parent-side writes / device links wait.
      expect((await bed.signals.list(coParent, family.id, range)).items).toHaveLength(0);
      await expect(
        bed.signals.putFardStatus(coParent, family.id, {
          date: todayIso(),
          memberId: child.id,
          ...ALL,
        }),
      ).rejects.toMatchObject(consentPending);
      await expect(
        bed.children.createDeviceLink(coParent, family.id, child.id),
      ).rejects.toMatchObject({ status: 403 });

      // Re-confirming restores the parent view and records the new consent.
      const confirmed = await bed.children.confirmConsent(coParent, family.id, child.id, {
        parentalConsent: true,
        consentPolicyVersion: "2026-12",
      });
      expect(confirmed).toMatchObject({ consentPending: false, consentTransferredAt: null });
      const row = await bed.dataSource
        .getRepository(ChildProfileEntity)
        .findOneByOrFail({ id: child.id });
      expect(row).toMatchObject({ createdBy: coParent.userId, consentPolicyVersion: "2026-12" });
      // The child device's queued tap now uploads and the parent sees it.
      await bed.signals.putFardStatus(childAct, family.id, { date: todayIso(), ...ALL });
      expect((await bed.signals.list(childAct, family.id, range)).items).toHaveLength(1);
      expect((await bed.signals.list(coParent, family.id, range)).items).toHaveLength(1);
    });

    it("sweeps transferred profiles still pending after 30 days", async () => {
      const { family, child } = await familyWithChild(true);
      const profiles = bed.dataSource.getRepository(ChildProfileEntity);
      await bed.dataSource.transaction((m) =>
        purgeExpiredCircleData(m, new Date(Date.now() + 29 * DAY_MS)),
      );
      expect(await profiles.count({ where: { id: child.id } })).toBe(1);
      await bed.dataSource.transaction((m) =>
        purgeExpiredCircleData(m, new Date(Date.now() + 31 * DAY_MS)),
      );
      expect(await profiles.count({ where: { circleId: family.id } })).toBe(0);
      expect(
        await bed.dataSource
          .getRepository(CircleMemberEntity)
          .count({ where: { memberId: child.id } }),
      ).toBe(0);
    });

    it("a lapsed profile's child session is revoked (the device discards its queue)", async () => {
      const { childAct } = await familyWithChild(true);
      await bed.retention.run(new Date(Date.now() + 31 * DAY_MS));
      await expect(bed.children.me(childAct)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe("D34 (M11): consent moves when the consenting parent stops being a parent", () => {
    /** Owner O, parents A (consents to the child) and B, in join order. */
    async function family() {
      const [owner, a, b] = [await bed.user(), await bed.user(), await bed.user()];
      const circle = await circleWithMembers(bed, "family", owner, [
        { actor: a, role: "parent" },
        { actor: b, role: "parent" },
      ]);
      const child = await bed.children.create(a, circle.id, {
        nickname: "Musa",
        birthYear: birthYearForAge(8),
        parentalConsent: true,
        consentPolicyVersion: "2026-11",
      });
      const profile = () =>
        bed.dataSource.getRepository(ChildProfileEntity).findOneByOrFail({ id: child.id });
      return { owner, a, b, circle, child, profile };
    }

    it("on leave: passes to the longest-standing parent, pending; a later account deletion is a no-op", async () => {
      const { owner, a, circle, profile } = await family();
      await bed.circles.leave(a, circle.id);
      const moved = await profile();
      expect(moved.createdBy).toBe(owner.userId);
      expect(moved.consentTransferredAt).toBeInstanceOf(Date);
      const clock = moved.consentTransferredAt?.getTime();

      // Scenario (a): months later A deletes the account — the child is not touched again.
      await bed.dataSource.transaction((m) => purgeUserCircleData(m, a.userId));
      expect((await profile()).consentTransferredAt?.getTime()).toBe(clock);
    });

    it("on removal: only the owner may remove a parent, and consent moves", async () => {
      const { owner, a, b, circle, profile } = await family();
      await expect(
        bed.circles.removeMember(b, circle.id, memberIdIn(circle.id, a)),
      ).rejects.toMatchObject({ status: 403 });
      expect((await profile()).consentTransferredAt).toBeNull();

      await bed.circles.removeMember(owner, circle.id, memberIdIn(circle.id, a));
      expect(await profile()).toMatchObject({ createdBy: owner.userId });
      expect((await profile()).consentTransferredAt).toBeInstanceOf(Date);
    });

    it("on demotion: consent moves; any remaining parent can still delete the profile", async () => {
      const { owner, a, b, circle, child, profile } = await family();
      await bed.circles.updateMemberRole(owner, circle.id, memberIdIn(circle.id, a), {
        role: "member",
      });
      expect(await profile()).toMatchObject({ createdBy: owner.userId });
      expect((await profile()).consentTransferredAt).toBeInstanceOf(Date);
      await bed.children.remove(b, circle.id, child.id);
      expect(
        await bed.dataSource.getRepository(ChildProfileEntity).count({ where: { id: child.id } }),
      ).toBe(0);
    });

    it("the consenting owner leaving hands both the family and the child to the next parent", async () => {
      const owner = await bed.user();
      const coParent = await bed.user();
      const circle = await circleWithMembers(bed, "family", owner, [
        { actor: coParent, role: "parent" },
      ]);
      const child = await bed.children.create(owner, circle.id, {
        nickname: "Isa",
        birthYear: birthYearForAge(6),
        parentalConsent: true,
        consentPolicyVersion: "2026-11",
      });
      await bed.circles.leave(owner, circle.id);
      expect((await bed.circles.detail(coParent, circle.id)).myRole).toBe("owner");
      const row = await bed.dataSource
        .getRepository(ChildProfileEntity)
        .findOneByOrFail({ id: child.id });
      expect(row.createdBy).toBe(coParent.userId);
      expect(row.consentTransferredAt).toBeInstanceOf(Date);
    });

    it("refuses consent after the 30-day window (410) and deletes the lapsed profile", async () => {
      const { owner, a, circle, child } = await family();
      await bed.circles.leave(a, circle.id);
      const profiles = bed.dataSource.getRepository(ChildProfileEntity);
      await profiles.update(
        { id: child.id },
        { consentTransferredAt: new Date(Date.now() - 31 * DAY_MS) },
      );
      await expect(
        bed.children.confirmConsent(owner, circle.id, child.id, {
          parentalConsent: true,
          consentPolicyVersion: "2026-12",
        }),
      ).rejects.toMatchObject({ status: 410 });
      expect(await profiles.count({ where: { id: child.id } })).toBe(0);
    });
  });

  describe("A4: retention runs without circle traffic", () => {
    it("the cron-driven service sweeps idempotently and throttles per process", async () => {
      const owner = await bed.user();
      const friend = await bed.user();
      const partner = await circleWithMembers(bed, "partner", owner, [{ actor: friend }]);
      await bed.signals.putGoalDone(friend, partner.id, { date: todayIso() });
      await bed.circles.leave(friend, partner.id);
      const signals = bed.dataSource.getRepository(CircleDailySignalEntity);
      expect(await signals.count({ where: { memberId: friend.userId } })).toBe(1);

      const later = new Date(Date.now() + 31 * DAY_MS);
      await bed.retention.maybeRun(later);
      expect(await signals.count({ where: { memberId: friend.userId } })).toBe(0);
      // Idempotent: a second (unthrottled) sweep is a harmless no-op.
      await expect(bed.retention.run(later)).resolves.toBeUndefined();

      // Throttled: another tick within the interval does not sweep again.
      const spy = vi.spyOn(bed.retention, "run");
      await bed.retention.maybeRun(new Date(later.getTime() + 60_000));
      expect(spy).not.toHaveBeenCalled();
      await bed.retention.maybeRun(new Date(later.getTime() + CIRCLE_RETENTION_INTERVAL_MS));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("never throws from a cron tick", async () => {
      vi.spyOn(bed.retention, "run").mockRejectedValueOnce(new Error("db down"));
      await expect(bed.retention.maybeRun(new Date())).resolves.toBeUndefined();
    });
  });
});
