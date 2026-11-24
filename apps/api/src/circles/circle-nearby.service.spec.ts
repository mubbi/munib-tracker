import {
  NEARBY_ERROR_CODES,
  NEARBY_LIMITS,
  nearbySessionIdFromUuid,
} from "@munib-tracker/shared/circles/nearby";
import {
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ChildProfileEntity,
  CircleMemberEntity,
  CircleNearbyRequestEntity,
  CircleNearbySessionEntity,
} from "../database/entities";
import {
  BED_TIMEOUT_MS,
  birthYearForAge,
  type CirclesTestBed,
  circleWithMembers,
  createCirclesTestBed,
  type UserActor,
} from "../test-support/circles";
import { purgeExpiredCircleData, purgeUserCircleData } from "./circle-lifecycle";
import { sha256Hex } from "./circle-tokens";

const IP = "192.0.2.10";
const CONSENT = { parentalConsent: true as const, consentPolicyVersion: "2026-11" };
const MINUTE_MS = 60_000;

describe("CircleNearbyService (NF-3.25)", () => {
  let bed: CirclesTestBed;

  beforeEach(async () => {
    bed = await createCirclesTestBed();
  }, BED_TIMEOUT_MS);
  afterEach(async () => {
    await bed.close();
  });

  /** Joiner flow up to a pending request: preview → confirm digits → ask. */
  async function ask(sessionId: string, joiner: UserActor | undefined, displayName?: string) {
    const preview = await bed.nearby.preview(sessionId, IP);
    return bed.nearby.createRequest(
      joiner,
      sessionId,
      { matchCode: preview.matchCode, displayName },
      IP,
    );
  }

  async function memberRow(circleId: string, userId: string) {
    return bed.dataSource
      .getRepository(CircleMemberEntity)
      .findOne({ where: { circleId, memberId: userId } });
  }

  describe("sessions", () => {
    it("advertises only an opaque id; the match code is derived, not stored", async () => {
      const owner = await bed.user();
      const circle = await bed.circles.create(owner, { type: "khatm_group", name: "Masjid" });
      const session = await bed.nearby.createSession(owner, circle.id, {});

      expect(session.sessionId).toMatch(/^[0-9a-f]{16}$/);
      expect(nearbySessionIdFromUuid(session.serviceUuid)).toBe(session.sessionId);
      expect(session.matchCode).toMatch(/^[0-9]{4}$/);
      expect(session).toMatchObject({ purpose: "member", role: "member" });
      const ttl = new Date(session.expiresAt).getTime() - Date.now();
      expect(ttl).toBeGreaterThan((NEARBY_LIMITS.sessionTtlMinutes - 1) * MINUTE_MS);
      expect(ttl).toBeLessThanOrEqual(NEARBY_LIMITS.sessionTtlMinutes * MINUTE_MS);

      const stored = await bed.dataSource
        .getRepository(CircleNearbySessionEntity)
        .findOneByOrFail({ id: session.sessionId });
      expect(JSON.stringify(stored)).not.toContain(`"${session.matchCode}"`);
      // Both screens show the same digits (D44).
      expect((await bed.nearby.preview(session.sessionId, IP)).matchCode).toBe(session.matchCode);
    });

    it("mirrors invite role rules: parent sessions owner-only, khatm admin never", async () => {
      const owner = await bed.user();
      const coParent = await bed.user();
      const family = await circleWithMembers(bed, "family", owner, [
        { actor: coParent, role: "parent" },
      ]);
      await expect(
        bed.nearby.createSession(coParent, family.id, { role: "parent" }),
      ).rejects.toBeInstanceOf(ForbiddenException);
      await expect(
        bed.nearby.createSession(coParent, family.id, { role: "member" }),
      ).resolves.toMatchObject({ role: "member" });
      await expect(
        bed.nearby.createSession(owner, family.id, { role: "parent" }),
      ).resolves.toMatchObject({ role: "parent" });

      const khatm = await bed.circles.create(owner, { type: "khatm_group", name: "K" });
      await expect(
        bed.nearby.createSession(owner, khatm.id, { role: "admin" as never }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("hides circles from non-members (404) and caps sessions per day", async () => {
      const owner = await bed.user();
      const stranger = await bed.user();
      const circle = await bed.circles.create(owner, { type: "khatm_group", name: "K" });
      await expect(bed.nearby.createSession(stranger, circle.id, {})).rejects.toBeInstanceOf(
        NotFoundException,
      );
      for (let i = 0; i < NEARBY_LIMITS.sessionsPerUserPerDay; i += 1) {
        await bed.nearby.createSession(owner, circle.id, {});
      }
      await expect(bed.nearby.createSession(owner, circle.id, {})).rejects.toBeInstanceOf(
        HttpException,
      );
    });

    it("reopening the screen ends the previous session; ending is idempotent", async () => {
      const owner = await bed.user();
      const circle = await bed.circles.create(owner, { type: "khatm_group", name: "K" });
      const first = await bed.nearby.createSession(owner, circle.id, {});
      const second = await bed.nearby.createSession(owner, circle.id, {});
      await expect(bed.nearby.preview(first.sessionId, IP)).rejects.toBeInstanceOf(GoneException);
      await bed.nearby.endSession(owner, circle.id, second.sessionId);
      await bed.nearby.endSession(owner, circle.id, second.sessionId);
      await expect(bed.nearby.preview(second.sessionId, IP)).rejects.toBeInstanceOf(GoneException);
      expect((await bed.nearby.listRequests(owner, circle.id, second.sessionId)).active).toBe(
        false,
      );
    });

    it("expires after the TTL", async () => {
      const owner = await bed.user();
      const circle = await bed.circles.create(owner, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(owner, circle.id, {});
      await bed.dataSource
        .getRepository(CircleNearbySessionEntity)
        .update({ id: session.sessionId }, { expiresAt: new Date(Date.now() - 1000) });
      await expect(bed.nearby.preview(session.sessionId, IP)).rejects.toBeInstanceOf(GoneException);
      await expect(bed.nearby.preview("0000000000000000", IP)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(bed.nearby.preview("not-an-id", IP)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("match flow + approvals (D42, D44)", () => {
    it("joins a khatm group only after the host accepts, through the invite membership path", async () => {
      const host = await bed.user();
      const guest = await bed.user("guest");
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "Ramadan" });
      const session = await bed.nearby.createSession(host, circle.id, {});

      const preview = await bed.nearby.preview(session.sessionId, IP);
      expect(preview).toMatchObject({
        circleType: "khatm_group",
        circleName: "Ramadan",
        memberCount: 1,
        purpose: "member",
        needsAccount: false,
      });

      const request = await ask(session.sessionId, guest, "Yusuf");
      expect(request.requestToken).toMatch(/^mtn_/);
      const stored = await bed.dataSource
        .getRepository(CircleNearbyRequestEntity)
        .findOneByOrFail({ id: request.requestId });
      expect(stored.tokenHash).toBe(sha256Hex(request.requestToken));
      expect(JSON.stringify(stored)).not.toContain(request.requestToken);

      // Nothing auto-joins.
      expect(await memberRow(circle.id, guest.userId)).toBeNull();
      const pending = await bed.nearby.status(
        session.sessionId,
        request.requestId,
        request.requestToken,
      );
      expect(pending).toMatchObject({ status: "pending", circleId: null });

      const list = await bed.nearby.listRequests(host, circle.id, session.sessionId);
      expect(list.items).toEqual([
        expect.objectContaining({ displayName: "Yusuf", requester: "guest", status: "pending" }),
      ]);

      await bed.nearby.decide(host, circle.id, session.sessionId, request.requestId, "accept");
      expect(await memberRow(circle.id, guest.userId)).toMatchObject({
        role: "member",
        displayName: "Yusuf",
      });
      expect(
        await bed.nearby.status(session.sessionId, request.requestId, request.requestToken),
      ).toEqual({ status: "accepted", circleType: "khatm_group", circleId: circle.id });

      // A decision is final (conditional update).
      await expect(
        bed.nearby.decide(host, circle.id, session.sessionId, request.requestId, "decline"),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("rejects digits that don't match the session", async () => {
      const host = await bed.user();
      const joiner = await bed.user();
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      const wrong = session.matchCode === "0000" ? "0001" : "0000";
      await expect(
        bed.nearby.createRequest(joiner, session.sessionId, { matchCode: wrong }, IP),
      ).rejects.toMatchObject({
        response: expect.objectContaining({ code: NEARBY_ERROR_CODES.matchMismatch }),
      });
    });

    it("needs an account session; guests can't ask for family or partner circles", async () => {
      const host = await bed.user();
      const guest = await bed.user("guest");
      const partner = await bed.circles.create(host, { type: "partner", name: "Duo" });
      const session = await bed.nearby.createSession(host, partner.id, {});
      expect((await bed.nearby.preview(session.sessionId, IP)).needsAccount).toBe(true);
      await expect(ask(session.sessionId, undefined)).rejects.toBeInstanceOf(UnauthorizedException);
      await expect(ask(session.sessionId, guest)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it("declines without joining, and tells an existing member they're already in", async () => {
      const host = await bed.user();
      const joiner = await bed.user();
      const circle = await bed.circles.create(host, { type: "partner", name: "Duo" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      const request = await ask(session.sessionId, joiner);
      await bed.nearby.decide(host, circle.id, session.sessionId, request.requestId, "decline");
      expect(await memberRow(circle.id, joiner.userId)).toBeNull();
      expect(
        (await bed.nearby.status(session.sessionId, request.requestId, request.requestToken))
          .status,
      ).toBe("declined");

      await expect(ask(session.sessionId, host)).rejects.toMatchObject({
        response: expect.objectContaining({ code: NEARBY_ERROR_CODES.alreadyMember }),
      });
    });

    it("asking again replaces the joiner's pending request; cancel withdraws it", async () => {
      const host = await bed.user();
      const joiner = await bed.user();
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      const first = await ask(session.sessionId, joiner);
      const second = await ask(session.sessionId, joiner);
      expect(
        (await bed.nearby.status(session.sessionId, first.requestId, first.requestToken)).status,
      ).toBe("cancelled");
      await bed.nearby.cancel(session.sessionId, second.requestId, second.requestToken);
      expect((await bed.nearby.listRequests(host, circle.id, session.sessionId)).items).toEqual([]);
      await expect(
        bed.nearby.decide(host, circle.id, session.sessionId, second.requestId, "accept"),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("rejects a wrong request secret and another host's session", async () => {
      const host = await bed.user();
      const other = await bed.user();
      const joiner = await bed.user();
      const circle = await circleWithMembers(bed, "khatm_group", host, [{ actor: other }]);
      const session = await bed.nearby.createSession(host, circle.id, {});
      const request = await ask(session.sessionId, joiner);
      await expect(
        bed.nearby.status(session.sessionId, request.requestId, "mtn_wrongwrongwrongwrong"),
      ).rejects.toBeInstanceOf(NotFoundException);
      await expect(
        bed.nearby.listRequests(other, circle.id, session.sessionId),
      ).rejects.toBeInstanceOf(NotFoundException);
      await expect(
        bed.nearby.decide(other, circle.id, session.sessionId, request.requestId, "accept"),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("reports a pending request as expired once the host leaves, and refuses to accept it", async () => {
      const host = await bed.user();
      const joiner = await bed.user();
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      const request = await ask(session.sessionId, joiner);
      await bed.nearby.endSession(host, circle.id, session.sessionId);
      expect(
        (await bed.nearby.status(session.sessionId, request.requestId, request.requestToken))
          .status,
      ).toBe("expired");
      await expect(
        bed.nearby.decide(host, circle.id, session.sessionId, request.requestId, "accept"),
      ).rejects.toBeInstanceOf(GoneException);
    });

    it("keeps the partner cap: accepting into a full circle fails and leaves the request pending", async () => {
      const host = await bed.user();
      const others = await Promise.all([1, 2, 3, 4].map(() => bed.user()));
      const circle = await circleWithMembers(
        bed,
        "partner",
        host,
        others.map((actor) => ({ actor })),
      );
      const session = await bed.nearby.createSession(host, circle.id, {});
      const sixth = await bed.user();
      const request = await ask(session.sessionId, sixth);
      await expect(
        bed.nearby.decide(host, circle.id, session.sessionId, request.requestId, "accept"),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(
        (await bed.nearby.status(session.sessionId, request.requestId, request.requestToken))
          .status,
      ).toBe("pending");
    });

    it("a parent session is single-use: the second accept fails", async () => {
      const owner = await bed.user();
      const [a, b] = [await bed.user(), await bed.user()];
      const family = await bed.circles.create(owner, { type: "family", name: "Home" });
      const session = await bed.nearby.createSession(owner, family.id, { role: "parent" });
      const ra = await ask(session.sessionId, a);
      const rb = await ask(session.sessionId, b);
      await bed.nearby.decide(owner, family.id, session.sessionId, ra.requestId, "accept");
      expect(await memberRow(family.id, a.userId)).toMatchObject({ role: "parent" });
      await expect(
        bed.nearby.decide(owner, family.id, session.sessionId, rb.requestId, "accept"),
      ).rejects.toBeInstanceOf(GoneException);
      expect(await memberRow(family.id, b.userId)).toBeNull();
    });

    it("re-checks the host's rights at decision time", async () => {
      const owner = await bed.user();
      const coParent = await bed.user();
      const joiner = await bed.user();
      const family = await circleWithMembers(bed, "family", owner, [
        { actor: coParent, role: "parent" },
      ]);
      const session = await bed.nearby.createSession(coParent, family.id, {});
      const request = await ask(session.sessionId, joiner);
      await bed.dataSource
        .getRepository(CircleMemberEntity)
        .update({ circleId: family.id, memberId: coParent.userId }, { role: "member" });
      await expect(
        bed.nearby.decide(coParent, family.id, session.sessionId, request.requestId, "accept"),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("child-device link", () => {
    async function familyWithChild() {
      const parent = await bed.user();
      const family = await bed.circles.create(parent, { type: "family", name: "Home" });
      const child = await bed.children.create(parent, family.id, {
        nickname: "Ali",
        birthYear: birthYearForAge(9),
        ...CONSENT,
      });
      return { parent, family, child };
    }

    it("links the child's device without an account; the child session is returned once", async () => {
      const { parent, family, child } = await familyWithChild();
      const session = await bed.nearby.createSession(parent, family.id, { childId: child.id });
      expect(session).toMatchObject({ purpose: "child_link", role: "child" });
      const preview = await bed.nearby.preview(session.sessionId, IP);
      expect(preview).toMatchObject({ purpose: "child_link", needsAccount: false });
      expect(JSON.stringify(preview)).not.toContain("Ali");

      const request = await ask(session.sessionId, undefined);
      const list = await bed.nearby.listRequests(parent, family.id, session.sessionId);
      expect(list.items[0]).toMatchObject({ requester: "device", status: "pending" });
      await bed.nearby.decide(parent, family.id, session.sessionId, request.requestId, "accept");

      const picked = await bed.nearby.status(
        session.sessionId,
        request.requestId,
        request.requestToken,
      );
      expect(picked.status).toBe("completed");
      expect(picked.childToken).toMatch(/^mtc_/);
      expect(picked.child).toMatchObject({ id: child.id, nickname: "Ali" });
      const actor = await bed.actors.resolve(picked.childToken as string, true);
      expect(actor).toEqual({ kind: "child", childId: child.id, circleId: family.id });

      const again = await bed.nearby.status(
        session.sessionId,
        request.requestId,
        request.requestToken,
      );
      expect(again).toEqual({ status: "completed", circleType: "family", circleId: null });
      // Single-use: the session is consumed.
      await expect(bed.nearby.preview(session.sessionId, IP)).rejects.toBeInstanceOf(GoneException);
    });

    it("is parent-only, needs consent, and expires an unclaimed acceptance", async () => {
      const { parent, family, child } = await familyWithChild();
      const adult = await bed.user();
      const invite = await bed.circles.createInvite(parent, family.id, { role: "member" });
      await bed.circles.join(adult, { code: invite.code });
      await expect(
        bed.nearby.createSession(adult, family.id, { childId: child.id }),
      ).rejects.toBeInstanceOf(ForbiddenException);

      const session = await bed.nearby.createSession(parent, family.id, { childId: child.id });
      const request = await ask(session.sessionId, undefined);
      await bed.nearby.decide(parent, family.id, session.sessionId, request.requestId, "accept");
      await bed.dataSource
        .getRepository(CircleNearbyRequestEntity)
        .update(
          { id: request.requestId },
          { decidedAt: new Date(Date.now() - (NEARBY_LIMITS.childPickupMinutes + 1) * MINUTE_MS) },
        );
      expect(
        (await bed.nearby.status(session.sessionId, request.requestId, request.requestToken))
          .status,
      ).toBe("expired");

      await bed.dataSource
        .getRepository(ChildProfileEntity)
        .update({ id: child.id }, { consentTransferredAt: new Date() });
      await expect(
        bed.nearby.createSession(parent, family.id, { childId: child.id }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("rate limits", () => {
    it("limits previews per client IP", async () => {
      const host = await bed.user();
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      for (let i = 0; i < NEARBY_LIMITS.lookupsPerIpPer15Min; i += 1) {
        await bed.nearby.preview(session.sessionId, "198.51.100.1");
      }
      await expect(bed.nearby.preview(session.sessionId, "198.51.100.1")).rejects.toBeInstanceOf(
        HttpException,
      );
      // Another client is unaffected.
      await expect(bed.nearby.preview(session.sessionId, "198.51.100.2")).resolves.toBeTruthy();
    });

    it("caps pending requests per session", async () => {
      const host = await bed.user();
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      for (let i = 0; i < NEARBY_LIMITS.maxPendingPerSession; i += 1) {
        await ask(session.sessionId, await bed.user("guest"));
      }
      await expect(ask(session.sessionId, await bed.user("guest"))).rejects.toMatchObject({
        response: expect.objectContaining({ code: NEARBY_ERROR_CODES.sessionFull }),
      });
    });
  });

  describe("retention & deletion", () => {
    it("purges sessions a day after expiry and a deleted account's sessions + requests", async () => {
      const host = await bed.user();
      const joiner = await bed.user();
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      await ask(session.sessionId, joiner);
      const sessions = bed.dataSource.getRepository(CircleNearbySessionEntity);
      const requests = bed.dataSource.getRepository(CircleNearbyRequestEntity);

      await bed.dataSource.transaction((m) => purgeUserCircleData(m, joiner.userId));
      expect(await requests.count()).toBe(0);

      await ask(session.sessionId, await bed.user());
      await bed.dataSource.transaction((m) =>
        purgeExpiredCircleData(m, new Date(Date.now() + 2 * 86_400_000)),
      );
      expect(await sessions.count()).toBe(0);
      expect(await requests.count()).toBe(0);

      await bed.nearby.createSession(host, circle.id, {});
      await bed.dataSource.transaction((m) => purgeUserCircleData(m, host.userId));
      expect(await sessions.count()).toBe(0);
    });

    it("deleting the circle removes its sessions", async () => {
      const host = await bed.user();
      const circle = await bed.circles.create(host, { type: "khatm_group", name: "K" });
      const session = await bed.nearby.createSession(host, circle.id, {});
      await bed.circles.remove(host, circle.id);
      await expect(bed.nearby.preview(session.sessionId, IP)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
