import { FAMILY_DIGEST_PUSH_COPY } from "@munib-tracker/shared/circles/push";
import { Logger } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ChildProfileEntity,
  CircleDailySignalEntity,
  CircleMemberEntity,
  InAppNotificationEntity,
  PushTokenEntity,
  SyncRecordEntity,
} from "../database/entities";
import {
  BED_TIMEOUT_MS,
  birthYearForAge,
  type CirclesTestBed,
  circleWithMembers,
  createCirclesTestBed,
  type UserActor,
} from "../test-support/circles";

const CONSENT = { parentalConsent: true, consentPolicyVersion: "2026-11" } as const;
/** Friday 19:00 UTC → ISO week 2026-W48, covering 2026-11-20 … 2026-11-26. */
const DUE = new Date("2026-11-27T19:00:00Z");
const WEEK = "2026-W48";
const ALL = { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };

describe("FamilyDigestService (D40)", () => {
  let bed: CirclesTestBed;
  let owner: UserActor;
  let coParent: UserActor;
  let teen: UserActor;
  let familyId: string;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
    owner = await bed.user();
    coParent = await bed.user();
    teen = await bed.user();
    const family = await circleWithMembers(bed, "family", owner, [
      { actor: coParent, role: "parent" },
      { actor: teen, role: "member" },
    ]);
    familyId = family.id;
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  const addChild = async (nickname: string, age = 9) =>
    (
      await bed.children.create(owner, familyId, {
        nickname,
        birthYear: birthYearForAge(age),
        ...CONSENT,
      })
    ).id;

  async function signal(memberId: string, date: string, value: Record<string, boolean>) {
    await bed.dataSource.getRepository(CircleDailySignalEntity).save({
      circleId: familyId,
      memberId,
      date,
      kind: "rest" in value ? "rest_day" : "fard_status",
      value,
    });
  }

  let tokenSeq = 0;
  async function addToken(user: UserActor) {
    tokenSeq += 1;
    const token = `ExponentPushToken[d${tokenSeq}]`;
    await bed.dataSource
      .getRepository(PushTokenEntity)
      .save({ userId: user.userId, token, platform: "expo", locale: "en" });
    return token;
  }

  async function syncPrefs(user: UserActor, notificationPrefs: Record<string, unknown>) {
    const repo = bed.dataSource.getRepository(SyncRecordEntity);
    const where = { userId: user.userId, entity: "preferences", recordId: "preferences" };
    await repo.delete(where);
    await repo.save({ ...where, data: { notificationPrefs }, updatedAt: new Date() });
  }

  const digestRows = (user?: UserActor) =>
    bed.dataSource.getRepository(InAppNotificationEntity).find({
      where: { kind: "circle", ...(user ? { userId: user.userId } : {}) },
    });
  const sentTo = () => bed.pushSends.flatMap((send) => send.items.map((item) => item.target));

  it("sends each parent a counts-only digest once per ISO week", async () => {
    const ali = await addChild("Ali");
    const sara = await addChild("Sara");
    await signal(ali, "2026-11-20", ALL);
    await signal(ali, "2026-11-21", { ...ALL, isha: false });
    await signal(ali, "2026-11-22", { rest: true });
    await signal(sara, "2026-11-26", ALL);
    await signal(sara, "2026-11-27", ALL); // the send day itself is not covered
    const ownerToken = await addToken(owner);
    const coParentToken = await addToken(coParent);
    await addToken(teen);

    await expect(bed.familyDigest.run(DUE)).resolves.toEqual({
      weekKey: WEEK,
      delivered: 2,
      quiet: 0,
    });

    // Parents only — never the adult member (or the children).
    expect(sentTo().sort()).toEqual([ownerToken, coParentToken].sort());
    const item = bed.pushSends[0]?.items[0];
    expect(item?.notification).toMatchObject({
      title: FAMILY_DIGEST_PUSH_COPY.en.title,
      body: "14 of 65 Salah logged this week — mashaAllah.",
      tag: `circle:digest:${familyId}`,
      data: {
        type: "circle",
        event: "family_digest",
        circleId: familyId,
        route: `/family?circleId=${familyId}`,
        url: `/family?circleId=${familyId}`,
      },
    });
    // No names (and no counts in the data payload).
    const shown = JSON.stringify(bed.pushSends);
    expect(shown).not.toMatch(/Ali|Sara|family circle/);
    expect(Object.keys(item?.notification.data ?? {})).not.toContain("prayed");

    const [row] = await digestRows(owner);
    expect(row).toMatchObject({
      title: FAMILY_DIGEST_PUSH_COPY.en.title,
      body: "14 of 65 Salah logged this week — mashaAllah.",
      dedupeKey: `circle:digest:${familyId}:${WEEK}`,
      routeData: {
        type: "circle",
        event: "family_digest",
        circleId: familyId,
        prayed: 14,
        possible: 65,
        href: `/family?circleId=${familyId}`,
      },
    });
    expect(await digestRows(teen)).toHaveLength(0);

    // Idempotent: the same week (cron + lazy trigger, any instance) never repeats.
    await expect(bed.familyDigest.run(new Date("2026-11-29T20:00:00Z"))).resolves.toMatchObject({
      delivered: 0,
    });
    expect(sentTo()).toHaveLength(2);
    expect(await digestRows()).toHaveLength(2);
  });

  it("is due only from Friday 18:00 UTC until the end of the ISO week", async () => {
    const ali = await addChild("Ali");
    await signal(ali, "2026-11-25", ALL);
    await addToken(owner);
    for (const at of ["2026-11-27T17:59:00Z", "2026-11-24T12:00:00Z", "2026-11-30T00:00:00Z"]) {
      await expect(bed.familyDigest.run(new Date(at))).resolves.toEqual({
        weekKey: null,
        delivered: 0,
        quiet: 0,
      });
      await bed.familyDigest.maybeRun(new Date(at));
    }
    expect(await digestRows()).toHaveLength(0);
    expect(sentTo()).toHaveLength(0);
  });

  it("honours the digest toggle and master switch (inbox row either way)", async () => {
    const ali = await addChild("Ali");
    await signal(ali, "2026-11-23", ALL);
    await addToken(owner);
    const coParentToken = await addToken(coParent);
    await syncPrefs(owner, { masterEnabled: true, circleFamilyDigest: false });
    await syncPrefs(coParent, { circleDuaReceived: false });

    await bed.familyDigest.run(DUE);
    expect(sentTo()).toEqual([coParentToken]);
    expect(await digestRows(owner)).toHaveLength(1);

    await syncPrefs(coParent, { masterEnabled: false });
    const nextWeek = new Date("2026-12-04T19:00:00Z");
    await signal(ali, "2026-12-01", ALL);
    await bed.familyDigest.run(nextWeek);
    expect(sentTo()).toEqual([coParentToken]);
    expect(await digestRows(coParent)).toHaveLength(2);
  });

  it("skips consent-pending and learning-age children, quiet weeks and guests", async () => {
    const pending = await addChild("Pending");
    const little = await addChild("Little", 4);
    await bed.dataSource
      .getRepository(ChildProfileEntity)
      .update({ id: pending }, { consentTransferredAt: new Date("2026-11-21T00:00:00Z") });
    await signal(pending, "2026-11-23", ALL);
    await signal(little, "2026-11-23", ALL);
    await addToken(owner);

    // Only excluded children logged anything → quiet week, nothing written.
    await expect(bed.familyDigest.run(DUE)).resolves.toEqual({
      weekKey: WEEK,
      delivered: 0,
      quiet: 1,
    });

    const counted = await addChild("Counted");
    await signal(counted, "2026-11-24", { ...ALL, fajr: false });
    // A guest somehow holding a parent seat gets nothing.
    const guest = await bed.user("guest");
    await bed.dataSource.getRepository(CircleMemberEntity).save({
      circleId: familyId,
      memberId: guest.userId,
      memberKind: "user",
      role: "parent",
      shareScope: {},
    });
    await addToken(guest);

    await bed.familyDigest.run(DUE);
    const [row] = await digestRows(owner);
    expect(row?.routeData).toMatchObject({ prayed: 4, possible: 35 });
    expect(await digestRows(coParent)).toHaveLength(1);
    expect(await digestRows(guest)).toHaveLength(0);
    expect(sentTo()).toHaveLength(1); // the owner's token; the guest's is never used
  });
  describe("maybeRun (cron tick)", () => {
    it("runs once per 15 minutes per process, and never twice at the same time", async () => {
      const run = vi.spyOn(bed.familyDigest, "run");
      await Promise.all([bed.familyDigest.maybeRun(DUE), bed.familyDigest.maybeRun(DUE)]);
      expect(run).toHaveBeenCalledTimes(1);
      await bed.familyDigest.maybeRun(new Date(DUE.getTime() + 14 * 60_000));
      expect(run).toHaveBeenCalledTimes(1);
      await bed.familyDigest.maybeRun(new Date(DUE.getTime() + 15 * 60_000));
      expect(run).toHaveBeenCalledTimes(2);
    });

    it("writes the digest from a tick", async () => {
      const ali = await addChild("Ali");
      await signal(ali, "2026-11-23", ALL);
      await bed.familyDigest.maybeRun(DUE);
      // Owner + co-parent (the teen member is not a parent).
      expect(await digestRows()).toHaveLength(2);
    });

    it("logs a failed pass by error class only and retries on a later tick", async () => {
      const warn = vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
      const run = vi
        .spyOn(bed.familyDigest, "run")
        .mockRejectedValueOnce(new RangeError("secret detail"))
        .mockRejectedValueOnce("not an error");
      await expect(bed.familyDigest.maybeRun(DUE)).resolves.toBeUndefined();
      await expect(
        bed.familyDigest.maybeRun(new Date(DUE.getTime() + 15 * 60_000)),
      ).resolves.toBeUndefined();
      expect(warn.mock.calls.map(([message]) => message)).toEqual([
        "family digest run failed: RangeError",
        "family digest run failed: error",
      ]);
      expect(run).toHaveBeenCalledTimes(2);
      warn.mockRestore();
    });
  });

  it("stays quiet for a family with no child profiles", async () => {
    await expect(bed.familyDigest.run(DUE)).resolves.toEqual({
      weekKey: WEEK,
      delivered: 0,
      quiet: 1,
    });
  });
});
