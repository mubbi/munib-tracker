import { CIRCLE_PUSH_COPY } from "@munib-tracker/shared/circles/push";
import type { VisiblePushSender } from "@munib-tracker/surface-push-delivery";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { InAppNotificationEntity, PushTokenEntity, SyncRecordEntity } from "../database/entities";
import {
  BED_TIMEOUT_MS,
  type CirclesTestBed,
  circleWithMembers,
  createCirclesTestBed,
  memberIdIn,
  type UserActor,
} from "../test-support/circles";

const KHATM_ID = "00000000-0000-4000-8000-00000000aaaa";

describe("circle event push (D33)", () => {
  let bed: CirclesTestBed;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  let tokenSeq = 0;
  async function addToken(user: UserActor, platform: "expo" | "web" = "expo", locale?: string) {
    tokenSeq += 1;
    const token =
      platform === "expo"
        ? `ExponentPushToken[t${tokenSeq}]`
        : JSON.stringify({
            endpoint: `https://push.example.com/${tokenSeq}`,
            keys: { p256dh: "p", auth: "a" },
          });
    await bed.dataSource
      .getRepository(PushTokenEntity)
      .save({ userId: user.userId, token, platform, locale: locale ?? null });
    return token;
  }

  async function syncPrefs(user: UserActor, data: Record<string, unknown>) {
    await bed.dataSource.getRepository(SyncRecordEntity).save({
      userId: user.userId,
      entity: "preferences",
      recordId: "preferences",
      data,
      updatedAt: new Date(),
    });
  }

  const sentTo = () => bed.pushSends.flatMap((send) => send.items.map((item) => item.target));
  const inboxCount = (user: UserActor) =>
    bed.dataSource
      .getRepository(InAppNotificationEntity)
      .count({ where: { userId: user.userId, kind: "circle" } });

  async function khatmGroup() {
    const owner = await bed.user();
    const member = await bed.user();
    const guest = await bed.user("guest");
    const circle = await circleWithMembers(bed, "khatm_group", owner, [
      { actor: member },
      { actor: guest },
    ]);
    return { owner, member, guest, circle };
  }

  it("pushes fixed, localized, content-free copy with the inbox route", async () => {
    const { owner, member, guest, circle } = await khatmGroup();
    const memberExpo = await addToken(member, "expo", "ur-PK");
    const memberWeb = await addToken(member, "web");
    await addToken(guest);
    await addToken(owner);

    await bed.events.emit(
      { type: "khatm_part_done", circleId: circle.id, khatmId: KHATM_ID, round: 1, partNo: 3 },
      undefined,
      owner.userId,
    );

    // Owner (the actor) excluded; guest skipped (no synced prefs to honour).
    expect(sentTo().sort()).toEqual([memberExpo, memberWeb].sort());
    const items = bed.pushSends.flatMap((send) => send.items);
    const expo = items.find((item) => item.target === memberExpo);
    expect(expo?.notification).toMatchObject(CIRCLE_PUSH_COPY.ur.khatm_part_done);
    const web = items.find((item) => item.target === memberWeb);
    expect(web?.notification).toMatchObject(CIRCLE_PUSH_COPY.en.khatm_part_done);
    expect(web?.notification.tag).toBe(`circle:khatm:${KHATM_ID}`);
    expect(web?.notification.data).toEqual({
      type: "circle",
      event: "khatm_part_done",
      circleId: circle.id,
      khatmId: KHATM_ID,
      route: `/khatm-groups?circleId=${circle.id}&khatmId=${KHATM_ID}`,
      url: `/khatm-groups?circleId=${circle.id}&khatmId=${KHATM_ID}`,
    });

    const [row] = await bed.dataSource
      .getRepository(InAppNotificationEntity)
      .find({ where: { userId: member.userId } });
    expect(row?.routeData).toMatchObject({
      type: "circle",
      event: "khatm_part_done",
      href: `/khatm-groups?circleId=${circle.id}&khatmId=${KHATM_ID}`,
    });
    // Guests still get the inbox row (unchanged behaviour), just no push.
    expect(await inboxCount(guest)).toBe(1);
  });

  it("collapses part pushes per khatm per hour and never re-pushes a replayed event", async () => {
    const { owner, member, circle } = await khatmGroup();
    await addToken(member);
    const part = (partNo: number) =>
      bed.events.emit(
        { type: "khatm_part_done", circleId: circle.id, khatmId: KHATM_ID, round: 1, partNo },
        undefined,
        owner.userId,
      );
    await part(1);
    await part(1); // replay
    await part(2);
    expect(sentTo()).toHaveLength(1);
    expect(await inboxCount(member)).toBe(2);

    await bed.events.emit({
      type: "khatm_completed",
      circleId: circle.id,
      khatmId: KHATM_ID,
      round: 1,
    });
    expect(sentTo()).toHaveLength(2);
    expect(bed.pushSends.at(-1)?.items[0]?.notification.title).toBe(
      CIRCLE_PUSH_COPY.en.khatm_completed.title,
    );
  });

  it("respects the per-kind toggles and the master switch from synced preferences", async () => {
    const { owner, member, circle } = await khatmGroup();
    const ownerToken = await addToken(owner);
    await addToken(member);
    await syncPrefs(member, {
      locale: "fr",
      notificationPrefs: { masterEnabled: true, circleKhatmProgress: false },
    });
    await syncPrefs(owner, { notificationPrefs: { masterEnabled: false } });

    await bed.events.emit({
      type: "khatm_part_done",
      circleId: circle.id,
      khatmId: KHATM_ID,
      round: 1,
      partNo: 1,
    });
    expect(sentTo()).toEqual([]);
    expect(await inboxCount(member)).toBe(1);

    await bed.events.emit({
      type: "khatm_completed",
      circleId: circle.id,
      khatmId: KHATM_ID,
      round: 1,
    });
    // Member: completed toggle unset ⇒ on, localized from the synced locale.
    const items = bed.pushSends.flatMap((send) => send.items);
    expect(items).toHaveLength(1);
    expect(items[0]?.target).not.toBe(ownerToken);
    expect(items[0]?.notification).toMatchObject(CIRCLE_PUSH_COPY.fr.khatm_completed);
  });

  it("pushes a dua to the receiver only, routed to the partner screen", async () => {
    const owner = await bed.user();
    const friend = await bed.user();
    const partner = await circleWithMembers(bed, "partner", owner, [{ actor: friend }]);
    const friendToken = await addToken(friend);
    await addToken(owner);
    await bed.signals.nudge(owner, partner.id, {
      toMemberId: memberIdIn(partner.id, friend),
      kind: "dua",
    });
    const items = bed.pushSends.flatMap((send) => send.items);
    expect(items.map((item) => item.target)).toEqual([friendToken]);
    expect(items[0]?.notification).toMatchObject(CIRCLE_PUSH_COPY.en.dua_received);
    expect(items[0]?.notification.data.route).toBe(`/partner?circleId=${partner.id}`);

    await syncPrefs(friend, { notificationPrefs: { circleDuaReceived: false } });
    await bed.events.emit({ type: "dua_received", circleId: partner.id, nudgeId: "n-2" }, [
      friend.userId,
    ]);
    expect(bed.pushSends.flatMap((send) => send.items)).toHaveLength(1);
  });
});

describe("circle push token hygiene", () => {
  it(
    "removes tokens the provider reports as gone and never throws into the caller",
    async () => {
      const goneSender: VisiblePushSender = {
        channel: "expo",
        sendMany: async (items) =>
          items.map(() => ({
            ok: false as const,
            reason: "DeviceNotRegistered",
            retryable: false,
            invalidateToken: true,
          })),
      };
      const failingWeb: VisiblePushSender = {
        channel: "web_push",
        sendMany: async () => {
          throw new Error("boom");
        },
      };
      const bed = await createCirclesTestBed({
        pushSenders: { expo: goneSender, web: failingWeb },
      });
      try {
        const owner = await bed.user();
        const friend = await bed.user();
        const partner = await circleWithMembers(bed, "partner", owner, [{ actor: friend }]);
        const tokens = bed.dataSource.getRepository(PushTokenEntity);
        await tokens.save({
          userId: friend.userId,
          token: "ExponentPushToken[x]",
          platform: "expo",
        });
        await tokens.save({
          userId: friend.userId,
          token: JSON.stringify({
            endpoint: "https://p.example.com/1",
            keys: { p256dh: "p", auth: "a" },
          }),
          platform: "web",
        });
        await bed.signals.nudge(owner, partner.id, {
          toMemberId: memberIdIn(partner.id, friend),
          kind: "dua",
        });
        expect(await tokens.count({ where: { userId: friend.userId } })).toBe(1);
        expect(
          await bed.dataSource
            .getRepository(InAppNotificationEntity)
            .count({ where: { userId: friend.userId } }),
        ).toBe(1);
      } finally {
        await bed.close();
      }
    },
    BED_TIMEOUT_MS,
  );
});
