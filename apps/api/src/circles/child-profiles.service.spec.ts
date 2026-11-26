import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ChildProfileEntity,
  CircleDailySignalEntity,
  CircleMemberEntity,
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
import type { CircleActor } from "./circle-auth";

const CONSENT = { parentalConsent: true, consentPolicyVersion: "2026-11" } as const;
const ALL_PRAYED = { fajr: true, dhuhr: true, asr: true, maghrib: false, isha: true };

describe("ChildProfilesService (D7)", () => {
  let bed: CirclesTestBed;
  let parent: UserActor;
  let coParent: UserActor;
  let teen: UserActor;
  let familyId: string;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
    parent = await bed.user();
    coParent = await bed.user();
    teen = await bed.user();
    const family = await circleWithMembers(bed, "family", parent, [
      { actor: coParent, role: "parent" },
      { actor: teen, role: "member" },
    ]);
    familyId = family.id;
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  const addChild = (age = 8, nickname = "Ali") =>
    bed.children.create(parent, familyId, {
      nickname,
      birthYear: birthYearForAge(age),
      ...CONSENT,
    });

  async function linkDevice(childId: string): Promise<{ token: string; actor: CircleActor }> {
    const { linkToken } = await bed.children.createDeviceLink(parent, familyId, childId);
    const session = await bed.children.redeemDeviceLink(linkToken, "10.0.0.1");
    return { token: session.childToken, actor: await bed.actors.resolve(session.childToken, true) };
  }

  it("stores nickname + birth year + consent only and adds a child member", async () => {
    const child = await addChild(8);
    expect(child).toMatchObject({ nickname: "Ali", ageBand: "gentle", linkedDeviceAt: null });

    const row = await bed.dataSource
      .getRepository(ChildProfileEntity)
      .findOneByOrFail({ id: child.id });
    expect(row.createdBy).toBe(parent.userId);
    expect(row.consentPolicyVersion).toBe("2026-11");
    expect(row.consentedAt).toBeInstanceOf(Date);
    expect(Object.keys(row)).not.toEqual(expect.arrayContaining(["email"]));

    const member = await bed.dataSource
      .getRepository(CircleMemberEntity)
      .findOneByOrFail({ circleId: familyId, memberId: child.id });
    expect(member).toMatchObject({ memberKind: "child", role: "child" });
  });

  it("rejects children 13+ (they join with their own account) and future birth years", async () => {
    await expect(addChild(14)).rejects.toBeInstanceOf(BadRequestException);
    await expect(addChild(-1)).rejects.toBeInstanceOf(BadRequestException);
    expect((await addChild(5)).ageBand).toBe("learning");
  });

  it("only lets parents manage child profiles, only in family circles", async () => {
    await expect(
      bed.children.create(teen, familyId, { nickname: "X", birthYear: 2020, ...CONSENT }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    const khatm = await bed.circles.create(parent, { type: "khatm_group", name: "K" });
    await expect(
      bed.children.create(parent, khatm.id, { nickname: "X", birthYear: 2020, ...CONSENT }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("links a device with a single-use, expiring QR token", async () => {
    const child = await addChild();
    const { linkToken } = await bed.children.createDeviceLink(parent, familyId, child.id);
    const session = await bed.children.redeemDeviceLink(linkToken);
    expect(session.childToken).toMatch(/^mtc_/);
    expect(session.child.linkedDeviceAt).not.toBeNull();
    await expect(bed.children.redeemDeviceLink(linkToken)).rejects.toBeInstanceOf(GoneException);

    const second = await bed.children.createDeviceLink(parent, familyId, child.id);
    await bed.dataSource
      .getRepository(ChildProfileEntity)
      .update({ id: child.id }, { linkTokenExpiresAt: new Date(Date.now() - 1) });
    await expect(bed.children.redeemDeviceLink(second.linkToken)).rejects.toBeInstanceOf(
      GoneException,
    );
  });

  it("scopes a child session to its own salah status", async () => {
    const ali = await addChild(9, "Ali");
    const sara = await addChild(10, "Sara");
    const { actor, token } = await linkDevice(ali.id);
    expect(actor).toEqual({ kind: "child", childId: ali.id, circleId: familyId });
    await expect(bed.actors.resolve(token, false)).rejects.toBeInstanceOf(ForbiddenException);

    const date = todayIso();
    await bed.signals.putFardStatus(actor, familyId, { date, ...ALL_PRAYED });
    await expect(
      bed.signals.putFardStatus(actor, familyId, { date, memberId: sara.id, ...ALL_PRAYED }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(bed.signals.putRestDay(actor, familyId, { date })).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    // A sibling's profile is invisible to the child session.
    const detail = await bed.circles.detail(actor, familyId);
    expect(detail.members.some((m) => m.memberId === sara.id)).toBe(false);

    const otherFamily = await bed.circles.create(coParent, { type: "family", name: "Other" });
    await expect(bed.circles.detail(actor, otherFamily.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(bed.children.me(actor)).resolves.toMatchObject({ id: ali.id });
  });

  it("parents read children's fard status; the adult member and other children can't", async () => {
    const ali = await addChild(9, "Ali");
    const sara = await addChild(10, "Sara");
    const date = todayIso();
    await bed.signals.putFardStatus(coParent, familyId, { date, memberId: ali.id, ...ALL_PRAYED });
    await bed.signals.putRestDay(parent, familyId, { date, memberId: sara.id });
    const range = { from: date, to: date };

    const forParent = await bed.signals.list(parent, familyId, range);
    expect(forParent.items.map((s) => [s.memberId, s.kind]).sort()).toEqual(
      [
        [ali.id, "fard_status"],
        [sara.id, "rest_day"],
      ].sort(),
    );
    expect(forParent.items.find((s) => s.kind === "fard_status")?.value).toEqual(ALL_PRAYED);
    expect((await bed.signals.list(teen, familyId, range)).items).toEqual([]);

    const { actor: saraDevice } = await linkDevice(sara.id);
    const forSara = await bed.signals.list(saraDevice, familyId, range);
    expect(forSara.items.every((s) => s.memberId === sara.id)).toBe(true);
  });

  it("never shares a parent's own salah", async () => {
    await expect(
      bed.signals.putFardStatus(parent, familyId, { date: todayIso(), ...ALL_PRAYED }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("revoking the device kills the child session", async () => {
    const child = await addChild();
    const { token } = await linkDevice(child.id);
    await bed.children.revokeDevice(parent, familyId, child.id);
    await expect(bed.actors.resolve(token, true)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("deletes a child profile and its signals immediately", async () => {
    const child = await addChild();
    await bed.signals.putFardStatus(parent, familyId, {
      date: todayIso(),
      memberId: child.id,
      ...ALL_PRAYED,
    });
    await bed.children.remove(coParent, familyId, child.id);

    expect(await bed.dataSource.getRepository(ChildProfileEntity).count()).toBe(0);
    expect(await bed.dataSource.getRepository(CircleDailySignalEntity).count()).toBe(0);
    expect(
      await bed.dataSource
        .getRepository(CircleMemberEntity)
        .count({ where: { memberId: child.id } }),
    ).toBe(0);
  });

  it("graduates at 13 (or earlier if unlocked) and ends parent visibility unless opted in", async () => {
    const young = await addChild(10, "Young");
    const { token: youngToken } = await linkDevice(young.id);
    const youngAccount = await bed.user();
    await expect(
      bed.children.graduate(youngAccount, { childToken: youngToken }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await bed.children.update(parent, familyId, young.id, { graduationUnlocked: true });

    await bed.signals.putFardStatus(parent, familyId, {
      date: todayIso(),
      memberId: young.id,
      ...ALL_PRAYED,
    });
    const summary = await bed.children.graduate(youngAccount, { childToken: youngToken });
    expect(summary).toMatchObject({ id: familyId, myRole: "member" });
    expect(
      await bed.dataSource.getRepository(ChildProfileEntity).findOneBy({ id: young.id }),
    ).toBeNull();
    expect(await bed.dataSource.getRepository(CircleDailySignalEntity).count()).toBe(0);
    await expect(bed.actors.resolve(youngToken, true)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    // Not sharing by default …
    const date = todayIso();
    await expect(
      bed.signals.putFardStatus(youngAccount, familyId, { date, ...ALL_PRAYED }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    // … until they opt in.
    await bed.circles.updateMyMembership(youngAccount, familyId, { shareFardStatus: true });
    await bed.signals.putFardStatus(youngAccount, familyId, { date, ...ALL_PRAYED });
    const forParent = await bed.signals.list(parent, familyId, { from: date, to: date });
    expect(forParent.items.map((s) => s.memberId)).toEqual([memberIdIn(familyId, youngAccount)]);
  });

  it("stores a parent-defined reward", async () => {
    const child = await addChild();
    const updated = await bed.children.update(parent, familyId, child.id, {
      reward: { title: "Park trip", days: 7 },
    });
    expect(updated.reward).toEqual({ title: "Park trip", days: 7 });
    const cleared = await bed.children.update(parent, familyId, child.id, { reward: null });
    expect(cleared.reward).toBeNull();
  });
  it("caps a family at 12 child profiles", async () => {
    for (let i = 0; i < 12; i += 1) await addChild(8, `Child${i}`);
    await expect(addChild(8, "Thirteenth")).rejects.toBeInstanceOf(ConflictException);
  });

  it("validates birth year and avatar edits; untouched fields are kept", async () => {
    const child = await addChild(8);
    await expect(
      bed.children.update(parent, familyId, child.id, { birthYear: birthYearForAge(15) }),
    ).rejects.toBeInstanceOf(BadRequestException);
    const withAvatar = await bed.children.update(parent, familyId, child.id, { avatar: "lion" });
    expect(withAvatar).toMatchObject({ nickname: "Ali", avatar: "lion" });
    const renamed = await bed.children.update(parent, familyId, child.id, { nickname: "Ali K" });
    expect(renamed).toMatchObject({ nickname: "Ali K", avatar: "lion" });
    const cleared = await bed.children.update(parent, familyId, child.id, { avatar: null });
    expect(cleared.avatar).toBeNull();
  });

  it("refuses an unknown or expired link code", async () => {
    await expect(
      bed.children.redeemDeviceLink("mtl_unknown-token-0000", "10.0.0.2"),
    ).rejects.toBeInstanceOf(GoneException);
    const child = await addChild();
    const { linkToken } = await bed.children.createDeviceLink(parent, familyId, child.id);
    await bed.dataSource
      .getRepository(ChildProfileEntity)
      .update({ id: child.id }, { linkTokenExpiresAt: new Date(Date.now() - 1000) });
    await expect(bed.children.redeemDeviceLink(linkToken, "10.0.0.2")).rejects.toBeInstanceOf(
      GoneException,
    );
  });

  it("only answers /me for a child session", async () => {
    await expect(bed.children.me(parent)).rejects.toBeInstanceOf(ForbiddenException);
    const child = await addChild();
    const { actor } = await linkDevice(child.id);
    await expect(bed.children.me(actor)).resolves.toMatchObject({ id: child.id });
  });

  it("won't graduate a child into an account that is already in the family", async () => {
    const child = await addChild(11, "Older");
    await bed.children.update(parent, familyId, child.id, { graduationUnlocked: true });
    const { token } = await linkDevice(child.id);
    await expect(bed.children.graduate(teen, { childToken: token })).rejects.toBeInstanceOf(
      ConflictException,
    );
    // The child profile is untouched.
    expect(
      await bed.dataSource.getRepository(ChildProfileEntity).findOneBy({ id: child.id }),
    ).not.toBeNull();
  });
});
