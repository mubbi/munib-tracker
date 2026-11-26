import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Repository } from "typeorm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InAppNotificationEntity } from "../database/entities";
import {
  BED_TIMEOUT_MS,
  type CirclesTestBed,
  circleWithMembers,
  createCirclesTestBed,
  memberIdIn,
  todayIso,
  type UserActor,
} from "../test-support/circles";
import { CircleAccessService } from "./circle-access.service";
import { CirclePushService } from "./circle-push.service";
import { FardStatusSignalDto, GoalDoneSignalDto } from "./dto/circles.dto";

const STRICT = { whitelist: true, forbidNonWhitelisted: true };

describe("closed signal schemas", () => {
  it("rejects any extra field (no notes, no qaza, no journals)", async () => {
    const fard = plainToInstance(FardStatusSignalDto, {
      date: "2026-11-23",
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
      note: "overslept",
    });
    expect((await validate(fard, STRICT)).map((e) => e.property)).toEqual(["note"]);

    const goal = plainToInstance(GoalDoneSignalDto, { date: "2026-11-23", missed: true });
    expect((await validate(goal, STRICT)).map((e) => e.property)).toEqual(["missed"]);
  });

  it("requires all five fard booleans", async () => {
    const partial = plainToInstance(FardStatusSignalDto, { date: "2026-11-23", fajr: true });
    expect((await validate(partial, STRICT)).map((e) => e.property).sort()).toEqual(
      ["asr", "dhuhr", "isha", "maghrib"].sort(),
    );
  });
});

describe("CircleSignalsService — partner", () => {
  let bed: CirclesTestBed;
  let me: UserActor;
  let friend: UserActor;
  let circleId: string;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
    me = await bed.user();
    friend = await bed.user();
    circleId = (await circleWithMembers(bed, "partner", me, [{ actor: friend }])).id;
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  it("shares only 'done' and lets a member un-share a day", async () => {
    const date = todayIso();
    const signal = await bed.signals.putGoalDone(me, circleId, { date });
    expect(signal.value).toEqual({ done: true });
    expect((await bed.signals.list(friend, circleId, { from: date, to: date })).items).toHaveLength(
      1,
    );
    await bed.signals.clear(me, circleId, "goal_done", date);
    expect((await bed.signals.list(friend, circleId, { from: date, to: date })).items).toEqual([]);
  });

  it("blocks fard_status in partner circles and writes for other members", async () => {
    const date = todayIso();
    await expect(
      bed.signals.putFardStatus(me, circleId, {
        date,
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("pausing stops sharing and hides past signals from others", async () => {
    const date = todayIso();
    await bed.signals.putGoalDone(me, circleId, { date });
    await bed.circles.updateMyMembership(me, circleId, { paused: true });
    await expect(bed.signals.putGoalDone(me, circleId, { date })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect((await bed.signals.list(friend, circleId, { from: date, to: date })).items).toEqual([]);
    expect((await bed.signals.list(me, circleId, { from: date, to: date })).items).toHaveLength(1);
  });

  it("rejects dates outside the sharing window and oversized ranges", async () => {
    await expect(
      bed.signals.putGoalDone(me, circleId, { date: "2020-01-01" }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      bed.signals.list(me, circleId, { from: "2026-01-01", to: "2026-03-01" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("allows one nudge per kind per member pair per day (D32) and keeps the sender anonymous", async () => {
    const nudge = await bed.signals.nudge(me, circleId, {
      toMemberId: memberIdIn(circleId, friend),
      kind: "dua",
    });
    expect(nudge.kind).toBe("dua");
    // A second dua the same day is refused with 429 …
    const again = bed.signals.nudge(me, circleId, {
      toMemberId: memberIdIn(circleId, friend),
      kind: "dua",
    });
    await expect(again).rejects.toBeInstanceOf(HttpException);
    await expect(again).rejects.toMatchObject({ status: 429 });
    // … but one gentle reminder is still allowed (a different kind) — then refused too.
    const reminder = await bed.signals.nudge(me, circleId, {
      toMemberId: memberIdIn(circleId, friend),
      kind: "reminder",
    });
    expect(reminder.kind).toBe("reminder");
    await expect(
      bed.signals.nudge(me, circleId, {
        toMemberId: memberIdIn(circleId, friend),
        kind: "reminder",
      }),
    ).rejects.toMatchObject({ status: 429 });
    // The other direction is a different pair.
    await bed.signals.nudge(friend, circleId, {
      toMemberId: memberIdIn(circleId, me),
      kind: "reminder",
    });

    const received = await bed.signals.receivedNudges(friend, circleId);
    expect(received.items.map((item) => item.kind).sort()).toEqual(["dua", "reminder"]);
    expect(JSON.stringify(received)).not.toContain(me.userId);

    const inbox = await bed.dataSource
      .getRepository(InAppNotificationEntity)
      .find({ where: { userId: friend.userId } });
    expect(inbox).toHaveLength(1);
    expect(inbox[0]).toMatchObject({ kind: "circle", title: "Someone made dua for you" });
    expect(JSON.stringify(inbox[0])).not.toContain(me.userId);
    // Gentle reminders aren't pushed: the receiver's app shows them after local Isha.
    expect(
      await bed.dataSource
        .getRepository(InAppNotificationEntity)
        .count({ where: { userId: me.userId } }),
    ).toBe(0);
  });

  it("refuses self-nudges and nudges outside partner circles", async () => {
    await expect(
      bed.signals.nudge(me, circleId, { toMemberId: memberIdIn(circleId, me), kind: "dua" }),
    ).rejects.toBeInstanceOf(BadRequestException);
    const khatm = await bed.circles.create(me, { type: "khatm_group", name: "K" });
    await expect(
      bed.signals.nudge(me, khatm.id, { toMemberId: memberIdIn(circleId, friend), kind: "dua" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects impossible calendar dates in a read range", async () => {
    await expect(
      bed.signals.list(me, circleId, { from: "2026-02-30", to: "2026-03-01" }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      bed.signals.list(me, circleId, { from: "2026-03-02", to: "2026-03-01" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("surfaces unexpected nudge write failures as-is (only duplicates become 429)", async () => {
    const insert = vi
      .spyOn(Repository.prototype, "insert")
      .mockRejectedValueOnce(new TypeError("driver exploded"));
    try {
      await expect(
        bed.signals.nudge(me, circleId, { toMemberId: memberIdIn(circleId, friend), kind: "dua" }),
      ).rejects.toBeInstanceOf(TypeError);
    } finally {
      insert.mockRestore();
    }
  });

  it("keeps the inbox row when the OS push fails, logging only the error class", async () => {
    const warn = vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    const deliver = vi
      .spyOn(bed.module.get(CirclePushService), "deliver")
      .mockRejectedValueOnce(new RangeError("apns down"));
    try {
      await bed.signals.nudge(me, circleId, {
        toMemberId: memberIdIn(circleId, friend),
        kind: "dua",
      });
      expect(deliver).toHaveBeenCalledTimes(1);
      expect(warn).toHaveBeenCalledWith("circle event dua_received not delivered: RangeError");
      expect(
        await bed.dataSource
          .getRepository(InAppNotificationEntity)
          .count({ where: { userId: friend.userId } }),
      ).toBe(1);
    } finally {
      warn.mockRestore();
      deliver.mockRestore();
    }
  });

  it("emits nothing when every recipient is excluded", async () => {
    await bed.events.emit(
      { type: "khatm_completed", circleId, khatmId: circleId, round: 1 },
      [me.userId],
      me.userId,
    );
    expect(await bed.dataSource.getRepository(InAppNotificationEntity).count()).toBe(0);
  });

  it("resolves an active member by account id, 404 once they leave", async () => {
    const access = bed.module.get(CircleAccessService);
    await expect(access.findActiveMember(circleId, friend.userId)).resolves.toMatchObject({
      memberId: friend.userId,
    });
    await bed.circles.leave(friend, circleId);
    await expect(access.findActiveMember(circleId, friend.userId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
