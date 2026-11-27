import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ChildProfileEntity, CircleInviteEntity, CircleMemberEntity } from "../database/entities";
import {
  BED_TIMEOUT_MS,
  birthYearForAge,
  type CirclesTestBed,
  circleWithMembers,
  createCirclesTestBed,
  memberIdIn,
} from "../test-support/circles";
import { PARENT_INVITE_MAX_TTL_HOURS } from "./circle-policy";

describe("CirclesService", () => {
  let bed: CirclesTestBed;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  it("creates a circle with the caller as owner and hides it from non-members", async () => {
    const owner = await bed.user();
    const stranger = await bed.user();
    const circle = await bed.circles.create(owner, {
      type: "family",
      name: "Home",
      displayName: "Abu Ali",
    });

    expect(circle).toMatchObject({ type: "family", myRole: "owner", memberCount: 1 });
    expect(circle.members[0]).toMatchObject({ displayName: "Abu Ali", isMe: true });
    await expect(bed.circles.detail(stranger, circle.id)).rejects.toBeInstanceOf(NotFoundException);
    expect((await bed.circles.list(stranger)).items).toEqual([]);
  });

  it("requires a linked account for family / partner but lets guests run khatm groups", async () => {
    const guest = await bed.user("guest");
    await expect(
      bed.circles.create(guest, { type: "partner", name: "Duo" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      bed.circles.create(guest, { type: "khatm_group", name: "Masjid khatm" }),
    ).resolves.toMatchObject({ type: "khatm_group" });
  });

  it("stores only the invite hash and honours max_uses", async () => {
    const owner = await bed.user();
    const [a, b] = [await bed.user(), await bed.user()];
    const circle = await bed.circles.create(owner, { type: "partner", name: "Duo" });
    const invite = await bed.circles.createInvite(owner, circle.id, {});

    expect(invite.code).toMatch(/^[A-Z2-7]{10}$/);
    expect(invite.joinPath).toBe(`circle/join/${invite.code}`);
    expect(invite.maxUses).toBe(1);
    const stored = await bed.dataSource
      .getRepository(CircleInviteEntity)
      .findOneByOrFail({ id: invite.id });
    expect(JSON.stringify(stored)).not.toContain(invite.code);

    const preview = await bed.circles.previewInvite(a, invite.code.toLowerCase());
    expect(preview).toMatchObject({ circleType: "partner", memberCount: 1, alreadyMember: false });

    await bed.circles.join(a, { code: invite.code, displayName: "A" });
    await expect(bed.circles.join(b, { code: invite.code })).rejects.toBeInstanceOf(GoneException);
  });

  it("rejects revoked, expired and unknown codes", async () => {
    const owner = await bed.user();
    const joiner = await bed.user();
    const circle = await bed.circles.create(owner, { type: "khatm_group", name: "K" });
    const revoked = await bed.circles.createInvite(owner, circle.id, {});
    await bed.circles.revokeInvite(owner, circle.id, revoked.id);
    await expect(bed.circles.join(joiner, { code: revoked.code })).rejects.toBeInstanceOf(
      GoneException,
    );

    const expired = await bed.circles.createInvite(owner, circle.id, {});
    await bed.dataSource
      .getRepository(CircleInviteEntity)
      .update({ id: expired.id }, { expiresAt: new Date(Date.now() - 1000) });
    await expect(bed.circles.join(joiner, { code: expired.code })).rejects.toBeInstanceOf(
      GoneException,
    );
    await expect(bed.circles.join(joiner, { code: "AAAAAAAAAA" })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("caps partner circles at 5 members", async () => {
    const owner = await bed.user();
    const others = await Promise.all([1, 2, 3, 4].map(() => bed.user()));
    const circle = await circleWithMembers(
      bed,
      "partner",
      owner,
      others.map((actor) => ({ actor })),
    );
    const sixth = await bed.user();
    const invite = await bed.circles.createInvite(owner, circle.id, {});
    await expect(bed.circles.join(sixth, { code: invite.code })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("limits invites to 20 per user per day and checks who may invite which role", async () => {
    const owner = await bed.user();
    const member = await bed.user();
    const circle = await circleWithMembers(bed, "family", owner, [{ actor: member }]);
    await expect(
      bed.circles.createInvite(member, circle.id, { role: "member" }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    for (let i = 0; i < 19; i += 1) {
      await bed.circles.createInvite(owner, circle.id, { role: "parent" });
    }
    await expect(bed.circles.createInvite(owner, circle.id, {})).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it("leaving hands ownership to a co-parent; the last adult leaving dissolves the circle", async () => {
    const owner = await bed.user();
    const coParent = await bed.user();
    const family = await circleWithMembers(bed, "family", owner, [
      { actor: coParent, role: "parent" },
    ]);
    await bed.circles.leave(owner, family.id);
    const after = await bed.circles.detail(coParent, family.id);
    expect(after.myRole).toBe("owner");
    expect(after.memberCount).toBe(1);

    await bed.circles.leave(coParent, family.id);
    await expect(bed.circles.detail(coParent, family.id)).rejects.toBeInstanceOf(NotFoundException);
    expect(
      await bed.dataSource.getRepository(CircleMemberEntity).count({
        where: { circleId: family.id },
      }),
    ).toBe(0);
  });

  it("keeps a departed member's row (for the 30-day purge) and lets them rejoin", async () => {
    const owner = await bed.user();
    const member = await bed.user();
    const circle = await circleWithMembers(bed, "khatm_group", owner, [{ actor: member }]);
    await bed.circles.leave(member, circle.id);
    const row = await bed.dataSource
      .getRepository(CircleMemberEntity)
      .findOneByOrFail({ circleId: circle.id, memberId: member.userId });
    expect(row.leftAt).toBeInstanceOf(Date);

    const invite = await bed.circles.createInvite(owner, circle.id, {});
    await expect(bed.circles.join(member, { code: invite.code })).resolves.toMatchObject({
      memberCount: 2,
    });
  });

  it("never shows the account user id to members — an opaque id per circle (L11)", async () => {
    const owner = await bed.user();
    const member = await bed.user();
    const khatm = await circleWithMembers(bed, "khatm_group", owner, [{ actor: member }]);
    const partner = await circleWithMembers(bed, "partner", owner, [{ actor: member }]);
    const seenInKhatm = await bed.circles.detail(owner, khatm.id);
    const seenInPartner = await bed.circles.detail(owner, partner.id);
    for (const detail of [seenInKhatm, seenInPartner]) {
      expect(JSON.stringify(detail)).not.toContain(member.userId);
      expect(JSON.stringify(detail)).not.toContain(owner.userId);
    }
    const idIn = (detail: typeof seenInKhatm) =>
      detail.members.find((m) => !m.isMe)?.memberId as string;
    // Stable within a circle, unlinkable across circles.
    expect(idIn(seenInKhatm)).toBe(memberIdIn(khatm.id, member));
    expect(idIn(seenInPartner)).not.toBe(idIn(seenInKhatm));
    expect((await bed.circles.detail(member, khatm.id)).myMemberId).toBe(idIn(seenInKhatm));
    // The opaque id is what member endpoints take; the raw user id is unknown (404).
    await expect(bed.circles.removeMember(owner, khatm.id, member.userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await bed.circles.removeMember(owner, khatm.id, idIn(seenInKhatm));
    expect((await bed.circles.detail(owner, khatm.id)).memberCount).toBe(1);
  });

  it("makes parent invites single-use whatever maxUses asks for", async () => {
    const owner = await bed.user();
    const family = await bed.circles.create(owner, { type: "family", name: "Home" });
    const parentInvite = await bed.circles.createInvite(owner, family.id, {
      role: "parent",
      maxUses: 10,
    });
    expect(parentInvite.maxUses).toBe(1);
    const memberInvite = await bed.circles.createInvite(owner, family.id, {
      role: "member",
      maxUses: 3,
    });
    expect(memberInvite.maxUses).toBe(3);
  });

  it("lets only the owner mint parent invites; co-parents may still invite members", async () => {
    const owner = await bed.user();
    const coParent = await bed.user();
    const family = await circleWithMembers(bed, "family", owner, [
      { actor: coParent, role: "parent" },
    ]);
    await expect(
      bed.circles.createInvite(coParent, family.id, { role: "parent" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      bed.circles.createInvite(coParent, family.id, { role: "member" }),
    ).resolves.toMatchObject({ role: "member" });
  });

  it("gives parent invites a short expiry: 48 h by default and at most", async () => {
    const owner = await bed.user();
    const family = await bed.circles.create(owner, { type: "family", name: "Home" });
    const hoursLeft = (expiresAt: string) => (Date.parse(expiresAt) - Date.now()) / 3_600_000;

    const parentInvite = await bed.circles.createInvite(owner, family.id, { role: "parent" });
    expect(hoursLeft(parentInvite.expiresAt)).toBeCloseTo(PARENT_INVITE_MAX_TTL_HOURS, 1);
    const shorter = await bed.circles.createInvite(owner, family.id, {
      role: "parent",
      expiresInHours: 2,
    });
    expect(hoursLeft(shorter.expiresAt)).toBeCloseTo(2, 1);
    await expect(
      bed.circles.createInvite(owner, family.id, {
        role: "parent",
        expiresInHours: PARENT_INVITE_MAX_TTL_HOURS + 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    // Other invites keep the 7-day default.
    const memberInvite = await bed.circles.createInvite(owner, family.id, { role: "member" });
    expect(hoursLeft(memberInvite.expiresAt)).toBeCloseTo(7 * 24, 1);
  });
  describe("guards and edge cases", () => {
    const CONSENT = { parentalConsent: true as const, consentPolicyVersion: "2026-11" };

    it("only lets khatm groups carry a masjid tag (create and update)", async () => {
      const owner = await bed.user();
      await expect(
        bed.circles.create(owner, { type: "family", name: "Home", masjidOsmRef: "node/1" }),
      ).rejects.toBeInstanceOf(BadRequestException);
      const family = await bed.circles.create(owner, { type: "family", name: "Home" });
      await expect(
        bed.circles.update(owner, family.id, { masjidOsmRef: "node/1" }),
      ).rejects.toBeInstanceOf(BadRequestException);

      const khatm = await bed.circles.create(owner, {
        type: "khatm_group",
        name: "K",
        masjidOsmRef: "node/1",
      });
      expect(khatm.masjidOsmRef).toBe("node/1");
      // Renaming alone keeps the tag; `null` clears it.
      await expect(bed.circles.update(owner, khatm.id, { name: "K2" })).resolves.toMatchObject({
        name: "K2",
        masjidOsmRef: "node/1",
      });
      await expect(
        bed.circles.update(owner, khatm.id, { masjidOsmRef: null }),
      ).resolves.toMatchObject({ name: "K2", masjidOsmRef: null });
    });

    it("lets only managers update and only the owner delete", async () => {
      const owner = await bed.user();
      const member = await bed.user();
      const circle = await circleWithMembers(bed, "khatm_group", owner, [{ actor: member }]);
      await expect(bed.circles.update(member, circle.id, { name: "x" })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      await expect(bed.circles.remove(member, circle.id)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      await bed.circles.remove(owner, circle.id);
      await expect(bed.circles.detail(member, circle.id)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("caps active circles per user on create and on join", async () => {
      const busy = await bed.user();
      const host = await bed.user();
      const target = await bed.circles.create(host, { type: "khatm_group", name: "Target" });
      const invite = await bed.circles.createInvite(host, target.id, {});
      for (let i = 0; i < 30; i += 1) {
        await bed.circles.create(busy, { type: "khatm_group", name: `K${i}` });
      }
      await expect(
        bed.circles.create(busy, { type: "khatm_group", name: "one too many" }),
      ).rejects.toBeInstanceOf(ConflictException);
      await expect(bed.circles.join(busy, { code: invite.code })).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it("joining a circle you are already in claims nothing and keeps the invite", async () => {
      const owner = await bed.user();
      const member = await bed.user();
      const circle = await circleWithMembers(bed, "khatm_group", owner, [{ actor: member }]);
      const invite = await bed.circles.createInvite(owner, circle.id, { maxUses: 1 });
      const preview = await bed.circles.previewInvite(member, invite.code);
      expect(preview.alreadyMember).toBe(true);
      await expect(bed.circles.join(member, { code: invite.code })).resolves.toMatchObject({
        memberCount: 2,
      });
      const stored = await bed.dataSource
        .getRepository(CircleInviteEntity)
        .findOneByOrFail({ id: invite.id });
      expect(stored.uses).toBe(0);
      expect(await bed.circles.memberCount(circle.id)).toBe(2);
    });

    it("rejects malformed codes without a lookup and spent invites as gone", async () => {
      const owner = await bed.user();
      const joiner = await bed.user();
      await expect(bed.circles.previewInvite(joiner, "short")).rejects.toBeInstanceOf(
        NotFoundException,
      );
      const circle = await bed.circles.create(owner, { type: "khatm_group", name: "K" });
      const invite = await bed.circles.createInvite(owner, circle.id, { maxUses: 1 });
      await bed.dataSource.getRepository(CircleInviteEntity).update({ id: invite.id }, { uses: 1 });
      await expect(bed.circles.previewInvite(joiner, invite.code)).rejects.toBeInstanceOf(
        GoneException,
      );
      // A deleted circle's invites disappear with it.
      const other = await bed.circles.createInvite(owner, circle.id, {});
      await bed.circles.remove(owner, circle.id);
      await expect(bed.circles.join(joiner, { code: other.code })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("scopes membership switches to the circle types they belong to", async () => {
      const owner = await bed.user();
      const adult = await bed.user();
      const family = await circleWithMembers(bed, "family", owner, [{ actor: adult }]);
      await expect(
        bed.circles.updateMyMembership(adult, family.id, { paused: true }),
      ).rejects.toBeInstanceOf(BadRequestException);
      // Parents' own salah is never shared.
      await expect(
        bed.circles.updateMyMembership(owner, family.id, { shareFardStatus: true }),
      ).rejects.toBeInstanceOf(BadRequestException);
      const shared = await bed.circles.updateMyMembership(adult, family.id, {
        shareFardStatus: true,
        displayName: "Teen",
      });
      expect(shared.members.find((m) => m.isMe)).toMatchObject({
        shareFardStatus: true,
        displayName: "Teen",
      });
      // An empty display name clears it.
      const cleared = await bed.circles.updateMyMembership(adult, family.id, { displayName: "" });
      expect(cleared.members.find((m) => m.isMe)?.displayName).toBeNull();

      const partner = await circleWithMembers(bed, "partner", owner, [{ actor: adult }]);
      const paused = await bed.circles.updateMyMembership(adult, partner.id, { paused: true });
      expect(paused.members.find((m) => m.isMe)?.paused).toBe(true);
      await expect(
        bed.circles.updateMyMembership(adult, partner.id, { shareFardStatus: true }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("refuses to remove the owner, a child, yourself, or (as a co-parent) a parent", async () => {
      const owner = await bed.user();
      const coParent = await bed.user();
      const otherParent = await bed.user();
      const family = await circleWithMembers(bed, "family", owner, [
        { actor: coParent, role: "parent" },
        { actor: otherParent, role: "parent" },
      ]);
      await bed.children.create(owner, family.id, {
        nickname: "Ali",
        birthYear: birthYearForAge(9),
        ...CONSENT,
      });
      const detail = await bed.circles.detail(owner, family.id);
      const childMemberId = detail.members.find((m) => m.memberKind === "child")
        ?.memberId as string;

      await expect(
        bed.circles.removeMember(coParent, family.id, memberIdIn(family.id, owner)),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        bed.circles.removeMember(owner, family.id, childMemberId),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        bed.circles.removeMember(coParent, family.id, memberIdIn(family.id, coParent)),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        bed.circles.removeMember(coParent, family.id, memberIdIn(family.id, otherParent)),
      ).rejects.toBeInstanceOf(ForbiddenException);
      // The owner may remove a parent.
      await bed.circles.removeMember(owner, family.id, memberIdIn(family.id, otherParent));
      expect((await bed.circles.detail(owner, family.id)).memberCount).toBe(3);
    });

    it("only the owner changes roles, within the roles a circle type offers", async () => {
      const owner = await bed.user();
      const member = await bed.user();
      const partner = await circleWithMembers(bed, "partner", owner, [{ actor: member }]);
      await expect(
        bed.circles.updateMemberRole(member, partner.id, memberIdIn(partner.id, owner), {
          role: "member",
        }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        bed.circles.updateMemberRole(owner, partner.id, memberIdIn(partner.id, owner), {
          role: "member",
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        bed.circles.updateMemberRole(owner, partner.id, memberIdIn(partner.id, member), {
          role: "admin",
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("demoting a co-parent hands the children they consented to back for re-consent (D34)", async () => {
      const owner = await bed.user();
      const coParent = await bed.user();
      const family = await circleWithMembers(bed, "family", owner, [
        { actor: coParent, role: "parent" },
      ]);
      const child = await bed.children.create(coParent, family.id, {
        nickname: "Sara",
        birthYear: birthYearForAge(10),
        ...CONSENT,
      });
      const demoted = await bed.circles.updateMemberRole(
        owner,
        family.id,
        memberIdIn(family.id, coParent),
        { role: "member" },
      );
      expect(demoted.members.find((m) => !m.isMe && m.memberKind === "user")?.role).toBe("member");
      const row = await bed.dataSource
        .getRepository(ChildProfileEntity)
        .findOneByOrFail({ id: child.id });
      expect(row.consentTransferredAt).toBeInstanceOf(Date);
      expect(demoted.members.find((m) => m.memberKind === "child")?.child?.consentPending).toBe(
        true,
      );
    });

    it("shows managers every live invite and others only their own; revoking checks who may", async () => {
      const owner = await bed.user();
      const a = await bed.user();
      const b = await bed.user();
      const partner = await circleWithMembers(bed, "partner", owner, [{ actor: a }, { actor: b }]);
      await bed.circles.createInvite(owner, partner.id, {});
      const aInvite = await bed.circles.createInvite(a, partner.id, {});
      // Partner circles: every member is a manager.
      expect((await bed.circles.listInvites(b, partner.id)).items).toHaveLength(2);

      // An admin who invited, then was demoted, still sees (and may revoke) their own.
      const khatm = await circleWithMembers(bed, "khatm_group", owner, [
        { actor: a, role: "admin" },
      ]);
      const memberInvite = await bed.circles.createInvite(a, khatm.id, {});
      const ownerInvite = await bed.circles.createInvite(owner, khatm.id, {});
      await bed.circles.updateMemberRole(owner, khatm.id, memberIdIn(khatm.id, a), {
        role: "member",
      });
      expect((await bed.circles.listInvites(a, khatm.id)).items.map((i) => i.id)).toEqual([
        memberInvite.id,
      ]);
      // The owner also sees the admin invite `a` joined with (khatm invites are multi-use).
      expect((await bed.circles.listInvites(owner, khatm.id)).items).toHaveLength(3);
      await expect(bed.circles.revokeInvite(a, khatm.id, ownerInvite.id)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      await bed.circles.revokeInvite(a, khatm.id, memberInvite.id);
      // An invite id from another circle is unknown here.
      await expect(bed.circles.revokeInvite(owner, khatm.id, aInvite.id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("keeps child sessions out of user-only actions", async () => {
      const owner = await bed.user();
      const family = await bed.circles.create(owner, { type: "family", name: "Home" });
      const childActor = { kind: "child" as const, childId: "c", circleId: family.id };
      await expect(
        bed.circles.create(childActor, { type: "khatm_group", name: "x" }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(bed.circles.list(childActor)).resolves.toEqual({ items: [] });
      // A child session is pinned to its own circle: any other id is 404.
      const other = await bed.circles.create(owner, { type: "khatm_group", name: "K" });
      await expect(
        bed.circles.detail({ ...childActor, circleId: family.id }, other.id),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
