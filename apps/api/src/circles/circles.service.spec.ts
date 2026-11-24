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
import { CircleInviteEntity, CircleMemberEntity } from "../database/entities";
import {
  BED_TIMEOUT_MS,
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
});
