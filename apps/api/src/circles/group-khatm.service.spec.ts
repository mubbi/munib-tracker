import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GroupKhatmEntity, InAppNotificationEntity, KhatmPartEntity } from "../database/entities";
import {
  BED_TIMEOUT_MS,
  type CirclesTestBed,
  circleWithMembers,
  createCirclesTestBed,
  memberIdIn,
  type UserActor,
} from "../test-support/circles";
import type { CreateKhatmDto } from "./dto/circles.dto";

describe("GroupKhatmService (NF-3.18)", () => {
  let bed: CirclesTestBed;
  let creator: UserActor;
  let members: UserActor[];
  let circleId: string;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
    creator = await bed.user();
    members = await Promise.all([1, 2, 3].map(() => bed.user()));
    circleId = (
      await circleWithMembers(
        bed,
        "khatm_group",
        creator,
        members.map((actor) => ({ actor })),
      )
    ).id;
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  const start = (overrides: Partial<CreateKhatmDto> = {}) =>
    bed.khatms.create(creator, circleId, { ...overrides, title: overrides.title ?? "Ramadan" });

  it("defaults to 30 open juz and supports 60 hizb / 114 surahs", async () => {
    const juz = await start();
    expect(juz).toMatchObject({ unit: "juz", partCount: 30, round: 1, status: "active" });
    expect(juz.parts).toHaveLength(30);
    expect(juz.parts.every((p) => p.status === "open" && p.assigneeMemberId === null)).toBe(true);
    await expect(start()).rejects.toBeInstanceOf(ConflictException);

    await bed.khatms.remove(creator, circleId, juz.id);
    expect((await start({ title: "H", unit: "hizb" })).parts).toHaveLength(60);
  });

  it("only lets managers start a khatm", async () => {
    await expect(
      bed.khatms.create(members[0] as UserActor, circleId, { title: "Mine" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("lets exactly one of many concurrent claimers win a part", async () => {
    const khatm = await start();
    const contenders = [creator, ...members];
    const results = await Promise.allSettled(
      contenders.map((actor) => bed.khatms.partAction(actor, circleId, khatm.id, 7, "claim")),
    );
    const winners = results.filter((r) => r.status === "fulfilled");
    const losers = results.filter((r) => r.status === "rejected");
    expect(winners).toHaveLength(1);
    expect(losers).toHaveLength(contenders.length - 1);
    for (const loser of losers) {
      expect((loser as PromiseRejectedResult).reason).toBeInstanceOf(ConflictException);
    }
    const part = await bed.dataSource
      .getRepository(KhatmPartEntity)
      .findOneByOrFail({ khatmId: khatm.id, partNo: 7 });
    expect(part.status).toBe("assigned");
    expect(contenders.map((c) => c.userId)).toContain(part.assigneeMemberId);
  });

  it("walks claim → reading → done, and only the assignee can progress a part", async () => {
    const [a, b] = members as [UserActor, UserActor];
    const khatm = await start();
    await bed.khatms.partAction(a, circleId, khatm.id, 1, "claim");
    await expect(
      bed.khatms.partAction(b, circleId, khatm.id, 1, "complete"),
    ).rejects.toBeInstanceOf(ConflictException);
    await expect(bed.khatms.partAction(b, circleId, khatm.id, 1, "release")).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    await bed.khatms.partAction(a, circleId, khatm.id, 1, "reading");
    const done = await bed.khatms.partAction(a, circleId, khatm.id, 1, "complete");
    expect(done.parts[0]).toMatchObject({
      status: "done",
      assigneeMemberId: memberIdIn(circleId, a),
    });
    expect(done.doneCount).toBe(1);
    await expect(bed.khatms.partAction(a, circleId, khatm.id, 99, "claim")).rejects.toBeInstanceOf(
      BadRequestException,
    );

    // Everyone but the reader hears about it.
    const inbox = await bed.dataSource.getRepository(InAppNotificationEntity).find();
    expect(inbox.map((row) => row.userId).sort()).toEqual(
      [creator, ...members]
        .filter((m) => m !== a)
        .map((m) => m.userId)
        .sort(),
    );
  });

  it("completes when every part is done, notifies everyone once, and starts a new round", async () => {
    const khatm = await start();
    for (let partNo = 1; partNo <= 30; partNo += 1) {
      const reader = [creator, ...members][partNo % 4] as UserActor;
      await bed.khatms.partAction(reader, circleId, khatm.id, partNo, "claim");
      await bed.khatms.partAction(reader, circleId, khatm.id, partNo, "complete");
    }
    const finished = await bed.khatms.detail(creator, circleId, khatm.id);
    expect(finished).toMatchObject({ status: "completed", doneCount: 30 });
    expect(finished.completedAt).not.toBeNull();
    await expect(
      bed.khatms.partAction(creator, circleId, khatm.id, 1, "release"),
    ).rejects.toBeInstanceOf(ConflictException);

    const completedRows = await bed.dataSource
      .getRepository(InAppNotificationEntity)
      .find({ where: { title: "Group khatm complete" } });
    expect(completedRows).toHaveLength(4);

    const next = await bed.khatms.startNextRound(creator, circleId, khatm.id);
    expect(next).toMatchObject({ round: 2, status: "active", doneCount: 0 });
    expect(next.parts.every((p) => p.status === "open")).toBe(true);
    await expect(bed.khatms.startNextRound(creator, circleId, khatm.id)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("round-robin deals parts to members; creator-assigns blocks self-claims", async () => {
    const robin = await start({ title: "RR", assignmentMode: "round_robin" });
    const assignees = new Set(robin.parts.map((p) => p.assigneeMemberId));
    expect(assignees.size).toBe(4);
    expect(robin.parts.every((p) => p.status === "assigned")).toBe(true);
    await bed.khatms.remove(creator, circleId, robin.id);

    const assigned = await start({ title: "CA", assignmentMode: "creator_assigns" });
    const [a] = members as [UserActor];
    await expect(
      bed.khatms.partAction(a, circleId, assigned.id, 3, "claim"),
    ).rejects.toBeInstanceOf(ForbiddenException);
    const after = await bed.khatms.assign(creator, circleId, assigned.id, 3, {
      memberId: memberIdIn(circleId, a),
    });
    expect(after.parts[2]).toMatchObject({
      status: "assigned",
      assigneeMemberId: memberIdIn(circleId, a),
    });
  });

  it("round-robin by a lone creator leaves parts open and deals them as people join", async () => {
    const solo = await bed.user();
    const [a, b] = await Promise.all([bed.user(), bed.user()]);
    const group = await circleWithMembers(bed, "khatm_group", solo);
    const khatm = await bed.khatms.create(solo, group.id, {
      title: "Solo",
      assignmentMode: "round_robin",
    });
    expect(khatm.parts.every((p) => p.status === "open" && p.assigneeMemberId === null)).toBe(true);
    await expect(bed.khatms.deal(solo, group.id, khatm.id)).rejects.toBeInstanceOf(
      ConflictException,
    );

    // First joiner → 15 / 15 in turn (the creator joined first, so takes the odd parts).
    const invite = await bed.circles.createInvite(solo, group.id, { role: "member" });
    await bed.circles.join(a, { code: invite.code });
    let detail = await bed.khatms.detail(solo, group.id, khatm.id);
    expect(detail.parts.every((p) => p.status === "assigned")).toBe(true);
    expect(detail.parts[0]?.assigneeMemberId).toBe(memberIdIn(group.id, solo));
    expect(detail.parts[1]?.assigneeMemberId).toBe(memberIdIn(group.id, a));

    // Started parts stay put when the next person joins; not-started ones are evened out.
    await bed.khatms.partAction(a, group.id, khatm.id, 2, "reading");
    await bed.khatms.partAction(solo, group.id, khatm.id, 1, "complete");
    await bed.circles.join(b, { code: invite.code });
    detail = await bed.khatms.detail(solo, group.id, khatm.id);
    expect(detail.parts[0]).toMatchObject({
      status: "done",
      assigneeMemberId: memberIdIn(group.id, solo),
    });
    expect(detail.parts[1]).toMatchObject({
      status: "reading",
      assigneeMemberId: memberIdIn(group.id, a),
    });
    expect(notStartedCounts(detail.parts)).toEqual([
      [memberIdIn(group.id, solo), 10],
      [memberIdIn(group.id, a), 9],
      [memberIdIn(group.id, b), 9],
    ]);
  });

  it("never re-deals parts a member claimed themselves (L12)", async () => {
    const solo = await bed.user();
    const [a, b] = await Promise.all([bed.user(), bed.user()]);
    const group = await circleWithMembers(bed, "khatm_group", solo);
    const khatm = await bed.khatms.create(solo, group.id, {
      title: "Pinned",
      assignmentMode: "round_robin",
    });
    for (const partNo of [1, 2, 3, 4, 5, 6]) {
      await bed.khatms.partAction(solo, group.id, khatm.id, partNo, "claim");
    }
    const invite = await bed.circles.createInvite(solo, group.id, { role: "member" });
    const soloId = memberIdIn(group.id, solo);
    const claimedStay = (
      parts: ReadonlyArray<{ assigneeMemberId: string | null; dealt: boolean }>,
    ) => parts.slice(0, 6).every((p) => p.assigneeMemberId === soloId && p.dealt === false);

    await bed.circles.join(a, { code: invite.code });
    let detail = await bed.khatms.detail(solo, group.id, khatm.id);
    expect(claimedStay(detail.parts)).toBe(true);
    expect(detail.parts.slice(6).every((p) => p.status === "assigned" && p.dealt)).toBe(true);

    await bed.circles.join(b, { code: invite.code });
    await bed.khatms.deal(solo, group.id, khatm.id);
    detail = await bed.khatms.detail(solo, group.id, khatm.id);
    expect(claimedStay(detail.parts)).toBe(true);
    // The 24 dealt parts are shared evenly; the self-claimed ones don't count.
    expect(notStartedCounts(detail.parts.slice(6)).map(([, count]) => count)).toEqual([8, 8, 8]);
  });

  it("lets only managers deal remaining parts, and only in round-robin mode", async () => {
    const [a] = members as [UserActor];
    const pick = await start();
    await expect(bed.khatms.deal(creator, circleId, pick.id)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await bed.khatms.remove(creator, circleId, pick.id);

    const robin = await start({ title: "RR", assignmentMode: "round_robin" });
    await expect(bed.khatms.deal(a, circleId, robin.id)).rejects.toBeInstanceOf(ForbiddenException);
    // A given-back part is dealt out again.
    const mine = robin.parts.find((p) => p.assigneeMemberId === memberIdIn(circleId, a)) as {
      partNo: number;
    };
    await bed.khatms.partAction(a, circleId, robin.id, mine.partNo, "release");
    const dealt = await bed.khatms.deal(creator, circleId, robin.id);
    expect(dealt.parts.every((p) => p.status === "assigned")).toBe(true);
    const counts = notStartedCounts(dealt.parts).map(([, count]) => count);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });

  it("converges when deals race each other and members' claims", async () => {
    const robin = await start({ title: "RR", assignmentMode: "round_robin" });
    const [a] = members as [UserActor];
    // Free up some parts, then race several deals against a member claiming one of them.
    for (const part of robin.parts.filter((p) => p.assigneeMemberId === memberIdIn(circleId, a))) {
      await bed.khatms.partAction(a, circleId, robin.id, part.partNo, "release");
    }
    const freed = robin.parts.find((p) => p.assigneeMemberId === memberIdIn(circleId, a)) as {
      partNo: number;
    };
    const results = await Promise.allSettled([
      ...[1, 2, 3, 4].map(() => bed.khatms.deal(creator, circleId, robin.id)),
      bed.khatms.partAction(a, circleId, robin.id, freed.partNo, "claim"),
    ]);
    for (const result of results) {
      if (result.status === "rejected") expect(result.reason).toBeInstanceOf(ConflictException);
    }
    // Every deal succeeded (lost moves are retried, never surfaced as errors).
    expect(results.slice(0, 4).every((r) => r.status === "fulfilled")).toBe(true);

    const detail = await bed.khatms.detail(creator, circleId, robin.id);
    const memberIds = new Set([creator, ...members].map((m) => memberIdIn(circleId, m)));
    expect(
      detail.parts.every((p) => p.status === "assigned" && memberIds.has(p.assigneeMemberId ?? "")),
    ).toBe(true);
    const counts = notStartedCounts(detail.parts).map(([, count]) => count);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
    // Dealing again is a no-op.
    const again = await bed.khatms.deal(creator, circleId, robin.id);
    expect(again.parts.map((p) => p.assigneeMemberId)).toEqual(
      detail.parts.map((p) => p.assigneeMemberId),
    );
  });

  it("does not deal self-pick parts when someone joins", async () => {
    const khatm = await start();
    const late = await bed.user();
    const invite = await bed.circles.createInvite(creator, circleId, { role: "member" });
    await bed.circles.join(late, { code: invite.code });
    const detail = await bed.khatms.detail(creator, circleId, khatm.id);
    expect(detail.parts.every((p) => p.status === "open")).toBe(true);
  });

  it("lets the creator reassign only stale parts in self-pick mode", async () => {
    const [a, b] = members as [UserActor, UserActor];
    const khatm = await start();
    await bed.khatms.partAction(a, circleId, khatm.id, 5, "claim");
    await expect(
      bed.khatms.assign(creator, circleId, khatm.id, 5, { memberId: memberIdIn(circleId, b) }),
    ).rejects.toBeInstanceOf(ConflictException);

    // No deadline → stale after 7 idle days.
    await bed.dataSource
      .getRepository(KhatmPartEntity)
      .update(
        { khatmId: khatm.id, partNo: 5 },
        { updatedAt: new Date(Date.now() - 8 * 86_400_000) },
      );
    const detail = await bed.khatms.detail(creator, circleId, khatm.id);
    expect(detail.parts[4]?.stale).toBe(true);
    const moved = await bed.khatms.assign(creator, circleId, khatm.id, 5, {
      memberId: memberIdIn(circleId, b),
    });
    expect(moved.parts[4]?.assigneeMemberId).toBe(memberIdIn(circleId, b));
  });

  it("returns a leaver's unfinished parts to the pool and keeps finished ones", async () => {
    const [a] = members as [UserActor];
    const khatm = await start();
    await bed.khatms.partAction(a, circleId, khatm.id, 1, "claim");
    await bed.khatms.partAction(a, circleId, khatm.id, 1, "complete");
    await bed.khatms.partAction(a, circleId, khatm.id, 2, "claim");
    await bed.circles.leave(a, circleId);
    const detail = await bed.khatms.detail(creator, circleId, khatm.id);
    expect(detail.parts[0]?.status).toBe("done");
    expect(detail.parts[1]).toMatchObject({ status: "open", assigneeMemberId: null });
  });

  it("rejects past deadlines and only opens remaining parts after the deadline", async () => {
    await expect(start({ title: "Old", deadline: "2020-01-01" })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    const [a] = members as [UserActor];
    const future = new Date(Date.now() + 10 * 86_400_000).toISOString().slice(0, 10);
    const khatm = await start({ title: "D", deadline: future });
    await bed.khatms.partAction(a, circleId, khatm.id, 4, "claim");
    await expect(
      bed.khatms.update(creator, circleId, khatm.id, { openRemainingParts: true }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
  describe("guards and edge cases", () => {
    const yesterday = () => new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

    it("lists khatms with their done counts (and an empty list before any)", async () => {
      const [a] = members as [UserActor];
      expect((await bed.khatms.list(a, circleId)).items).toEqual([]);
      const khatm = await start();
      await bed.khatms.partAction(a, circleId, khatm.id, 1, "claim");
      await bed.khatms.partAction(a, circleId, khatm.id, 1, "complete");
      const { items } = await bed.khatms.list(a, circleId);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        id: khatm.id,
        doneCount: 1,
        createdBy: memberIdIn(circleId, creator),
      });
    });

    it("lives only in khatm groups", async () => {
      const partner = await circleWithMembers(bed, "partner", creator, [
        { actor: members[0] as UserActor },
      ]);
      await expect(
        bed.khatms.create(creator, partner.id, { title: "Nope" }),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(bed.khatms.list(creator, partner.id)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it("edits title / intention / deadline (managers only) and 404s unknown khatms", async () => {
      const khatm = await start({ intention: "For our parents" });
      const future = new Date(Date.now() + 5 * 86_400_000).toISOString().slice(0, 10);
      const edited = await bed.khatms.update(creator, circleId, khatm.id, { deadline: future });
      // Untouched fields are kept.
      expect(edited).toMatchObject({
        title: "Ramadan",
        intention: "For our parents",
        deadline: future,
      });
      const cleared = await bed.khatms.update(creator, circleId, khatm.id, { intention: "" });
      expect(cleared.intention).toBeNull();
      await expect(
        bed.khatms.update(creator, circleId, khatm.id, { deadline: "2020-01-01" }),
      ).rejects.toBeInstanceOf(BadRequestException);
      await expect(
        bed.khatms.update(members[0] as UserActor, circleId, khatm.id, { title: "Mine" }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        bed.khatms.detail(creator, circleId, "00000000-0000-4000-8000-000000000000"),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("opens unfinished parts once the deadline has passed", async () => {
      const [a] = members as [UserActor];
      const khatm = await start();
      await bed.khatms.partAction(a, circleId, khatm.id, 2, "claim");
      await bed.khatms.partAction(a, circleId, khatm.id, 3, "claim");
      await bed.khatms.partAction(a, circleId, khatm.id, 3, "complete");
      await bed.dataSource
        .getRepository(GroupKhatmEntity)
        .update({ id: khatm.id }, { deadline: yesterday() });
      const opened = await bed.khatms.update(creator, circleId, khatm.id, {
        openRemainingParts: true,
      });
      expect(opened.deadlinePassed).toBe(true);
      expect(opened.parts[1]).toMatchObject({ status: "open", assigneeMemberId: null });
      expect(opened.parts[2]?.status).toBe("done");
    });

    it("validates part numbers and who may release a part", async () => {
      const [a, b] = members as [UserActor, UserActor];
      const khatm = await start();
      for (const partNo of [0, 31, 1.5]) {
        await expect(
          bed.khatms.partAction(a, circleId, khatm.id, partNo, "claim"),
        ).rejects.toBeInstanceOf(BadRequestException);
      }
      await bed.khatms.partAction(a, circleId, khatm.id, 7, "claim");
      await expect(
        bed.khatms.partAction(b, circleId, khatm.id, 7, "release"),
      ).rejects.toBeInstanceOf(ForbiddenException);
      // Only the assignee moves a part along.
      await expect(
        bed.khatms.partAction(b, circleId, khatm.id, 7, "reading"),
      ).rejects.toBeInstanceOf(ConflictException);
      // A manager may hand any part back to the pool.
      const released = await bed.khatms.partAction(creator, circleId, khatm.id, 7, "release");
      expect(released.parts[6]).toMatchObject({ status: "open", assigneeMemberId: null });
      // Releasing an open part changes nothing → 409.
      await expect(
        bed.khatms.partAction(creator, circleId, khatm.id, 7, "release"),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("freezes a completed khatm: no part actions, assignments or deals", async () => {
      const khatm = await start({ assignmentMode: "round_robin" });
      await bed.dataSource
        .getRepository(GroupKhatmEntity)
        .update({ id: khatm.id }, { status: "completed", completedAt: new Date() });
      await expect(
        bed.khatms.partAction(creator, circleId, khatm.id, 1, "claim"),
      ).rejects.toBeInstanceOf(ConflictException);
      await expect(
        bed.khatms.assign(creator, circleId, khatm.id, 1, { memberId: null }),
      ).rejects.toBeInstanceOf(ConflictException);
      await expect(bed.khatms.deal(creator, circleId, khatm.id)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it("assigns open parts to members, returns them to the pool, and never moves done parts", async () => {
      const [a, b] = members as [UserActor, UserActor];
      const khatm = await start();
      const given = await bed.khatms.assign(creator, circleId, khatm.id, 9, {
        memberId: memberIdIn(circleId, b),
      });
      expect(given.parts[8]).toMatchObject({
        status: "assigned",
        assigneeMemberId: memberIdIn(circleId, b),
      });
      // Assigned parts are only reassignable once stale — but `null` on an open
      // part is a no-op reassignment of the pool.
      const pooled = await bed.khatms.assign(creator, circleId, khatm.id, 10, { memberId: null });
      expect(pooled.parts[9]).toMatchObject({ status: "open", assigneeMemberId: null });
      await expect(
        bed.khatms.assign(creator, circleId, khatm.id, 10, {
          memberId: "00000000-0000-4000-8000-000000000000",
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      await bed.khatms.partAction(a, circleId, khatm.id, 11, "claim");
      await bed.khatms.partAction(a, circleId, khatm.id, 11, "complete");
      await expect(
        bed.khatms.assign(creator, circleId, khatm.id, 11, { memberId: memberIdIn(circleId, b) }),
      ).rejects.toBeInstanceOf(ConflictException);
      await expect(
        bed.khatms.assign(a, circleId, khatm.id, 12, { memberId: null }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("refuses a new round while the current one is still running", async () => {
      const khatm = await start();
      await expect(bed.khatms.startNextRound(creator, circleId, khatm.id)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it("keeps a join working when the auto-deal hook fails (logged by class only)", async () => {
      await start({ assignmentMode: "round_robin" });
      const warn = vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
      const find = vi.spyOn(bed.dataSource, "getRepository").mockImplementationOnce(() => {
        throw new TypeError("db down");
      });
      await expect(bed.khatms.onMemberJoined(circleId)).resolves.toBeUndefined();
      expect(warn).toHaveBeenCalledWith("khatm auto-deal failed: TypeError");
      find.mockRestore();
      warn.mockRestore();
    });
  });
});

/** Not-started (assigned) parts per member, in first-seen order — the round-robin fairness measure. */
function notStartedCounts(
  parts: ReadonlyArray<{ status: string; assigneeMemberId: string | null }>,
): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const part of parts) {
    if (part.status !== "assigned" || !part.assigneeMemberId) continue;
    counts.set(part.assigneeMemberId, (counts.get(part.assigneeMemberId) ?? 0) + 1);
  }
  return [...counts.entries()];
}
