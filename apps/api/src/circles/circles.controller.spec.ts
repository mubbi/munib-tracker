import { type INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { SafeExceptionFilter } from "../common/safe-exception.filter";
import { BED_TIMEOUT_MS, type CirclesTestBed, createCirclesTestBed } from "../test-support/circles";
import {
  CircleChildrenController,
  CircleChildSessionController,
} from "./circle-children.controller";
import { CircleNearbyHostController, CircleNearbyJoinController } from "./circle-nearby.controller";
import { CircleSignalsController } from "./circle-signals.controller";
import { CirclesController } from "./circles.controller";
import { GroupKhatmController } from "./group-khatm.controller";

/**
 * In-process HTTP spec for every circles controller: the real `CircleAuthGuard`
 * (JWT sessions + scoped child sessions), the production `ValidationPipe`
 * options, param pipes and status codes. Loopback only (supertest).
 */

type Auth = { Authorization: string };

const NIL_UUID = "00000000-0000-4000-8000-000000000000";
const today = () => new Date().toISOString().slice(0, 10);
const FARD = { fajr: true, dhuhr: true, asr: false, maghrib: true, isha: true };
const CONSENT = { parentalConsent: true, consentPolicyVersion: "2026-11" };

describe("circles controllers (HTTP)", () => {
  let bed: CirclesTestBed;
  let app: INestApplication;
  let owner: Auth;
  let partner: Auth;
  let guest: Auth;
  let guest2: Auth;
  let guest3: Auth;

  beforeAll(async () => {
    bed = await createCirclesTestBed({
      controllers: [
        CirclesController,
        CircleChildrenController,
        CircleChildSessionController,
        CircleSignalsController,
        GroupKhatmController,
        CircleNearbyHostController,
        CircleNearbyJoinController,
      ],
    });
    app = bed.module.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new SafeExceptionFilter());
    await app.init();

    const auth = bed.module.get(AuthService);
    const bearer = (session: { accessToken: string }): Auth => ({
      Authorization: `Bearer ${session.accessToken}`,
    });
    // The OAuth stub maps each provider to one stable linked account.
    owner = bearer(await auth.completeOAuth(AuthProvider.Google, { code: "owner" }));
    partner = bearer(await auth.completeOAuth(AuthProvider.Apple, { code: "partner" }));
    guest = bearer(await auth.createGuestSession({ deviceId: "dev_circles_http_guest_0001" }));
    guest2 = bearer(await auth.createGuestSession({ deviceId: "dev_circles_http_guest_0002" }));
    guest3 = bearer(await auth.createGuestSession({ deviceId: "dev_circles_http_guest_0003" }));
  }, BED_TIMEOUT_MS);

  afterAll(async () => {
    await app?.close();
  });

  const http = () => request(app.getHttpServer());
  const base = "/api/v1/circles";

  describe("CircleAuthGuard", () => {
    it("answers 401 without a session and with a bearer that isn't a live session", async () => {
      await http().get(base).expect(401);
      await http().get(base).set({ Authorization: "Bearer not-a-jwt" }).expect(401);
      // The Expo web "cookie" marker is never a JWT, and there is no cookie either.
      await http().get(base).set({ Authorization: "Bearer cookie" }).expect(401);
    });

    it("rejects a revoked / unknown child-session bearer on child-enabled routes (401)", async () => {
      const unknownChild = { Authorization: "Bearer mtc_0123456789abcdefghij" };
      await http().get("/api/v1/circle-child/me").set(unknownChild).expect(401);
      // …and refuses child sessions outright on user-only routes (403, no DB lookup).
      await http().get(base).set(unknownChild).expect(403);
    });

    it("lets a user session call child-enabled routes but not child-only actions", async () => {
      await http().get("/api/v1/circle-child/me").set(owner).expect(403);
    });
  });

  describe("CirclesController", () => {
    it("runs create → detail → rename → invite → join → roles → leave → delete", async () => {
      // Validation: closed schema, unknown types and fields are 400.
      await http().post(base).set(owner).send({ type: "club", name: "x" }).expect(400);
      await http()
        .post(base)
        .set(owner)
        .send({ type: "partner", name: "Duo", extra: true })
        .expect(400);
      // Family / partner circles need a linked account.
      await http().post(base).set(guest).send({ type: "partner", name: "Duo" }).expect(401);

      const created = await http()
        .post(base)
        .set(owner)
        .send({ type: "khatm_group", name: "  Masjid  ", displayName: "Imam" })
        .expect(201);
      const id = created.body.id as string;
      expect(created.body).toMatchObject({ name: "Masjid", myRole: "owner", memberCount: 1 });

      const list = await http().get(base).set(owner).expect(200);
      expect(list.body.items.map((c: { id: string }) => c.id)).toContain(id);
      await http().get(`${base}/not-a-uuid`).set(owner).expect(400);
      await http().get(`${base}/${NIL_UUID}`).set(owner).expect(404);
      await http().get(`${base}/${id}`).set(guest).expect(404);

      const renamed = await http()
        .patch(`${base}/${id}`)
        .set(owner)
        .send({ name: "Masjid khatm", masjidOsmRef: "way/77" })
        .expect(200);
      expect(renamed.body).toMatchObject({ name: "Masjid khatm", masjidOsmRef: "way/77" });

      const invite = await http()
        .post(`${base}/${id}/invites`)
        .set(owner)
        .send({ role: "admin", maxUses: 2 })
        .expect(201);
      const preview = await http().get(`${base}/join/${invite.body.code}`).set(guest).expect(200);
      expect(preview.body).toMatchObject({ circleType: "khatm_group", alreadyMember: false });

      await http()
        .post(`${base}/join`)
        .set(guest)
        .send({ code: invite.body.code, displayName: "Guest" })
        .expect(200);
      await http().post(`${base}/join`).set(guest2).send({ code: invite.body.code }).expect(200);

      const invites = await http().get(`${base}/${id}/invites`).set(owner).expect(200);
      // maxUses 2, both used: no longer live.
      expect(invites.body.items).toEqual([]);
      const spare = await http().post(`${base}/${id}/invites`).set(owner).send({}).expect(201);
      await http().delete(`${base}/${id}/invites/${spare.body.id}`).set(owner).expect(204);
      await http().delete(`${base}/${id}/invites/not-a-uuid`).set(owner).expect(400);

      const detail = await http().get(`${base}/${id}`).set(owner).expect(200);
      const guestId = detail.body.members.find(
        (m: { displayName: string | null }) => m.displayName === "Guest",
      ).memberId as string;
      const guest2Id = detail.body.members.find(
        (m: { displayName: string | null; isMe: boolean; memberId: string }) =>
          !m.isMe && m.memberId !== guestId,
      ).memberId as string;

      const me = await http()
        .patch(`${base}/${id}/members/me`)
        .set(guest)
        .send({ displayName: "Renamed" })
        .expect(200);
      expect(me.body.members.find((m: { isMe: boolean }) => m.isMe).displayName).toBe("Renamed");

      const promoted = await http()
        .patch(`${base}/${id}/members/${guest2Id}`)
        .set(owner)
        .send({ role: "member" })
        .expect(200);
      expect(promoted.body.memberCount).toBe(3);
      await http()
        .patch(`${base}/${id}/members/${guest2Id}`)
        .set(owner)
        .send({ role: "owner" })
        .expect(400);
      await http()
        .patch(`${base}/${id}/members/${guest2Id}`)
        .set(guest)
        .send({ role: "member" })
        .expect(403);

      await http().delete(`${base}/${id}/members/${guest2Id}`).set(owner).expect(204);
      await http().delete(`${base}/${id}/members/me`).set(guest).expect(204);
      await http().get(`${base}/${id}`).set(guest).expect(404);

      await http().delete(`${base}/${id}`).set(owner).expect(204);
      await http().get(`${base}/${id}`).set(owner).expect(404);
    });
  });

  describe("GroupKhatmController", () => {
    it("creates, reads, edits, claims, assigns and deletes a khatm", async () => {
      const circle = await http()
        .post(base)
        .set(owner)
        .send({ type: "khatm_group", name: "Juz club" })
        .expect(201);
      const khatms = `${base}/${circle.body.id}/khatms`;
      const invite = await http().post(`${base}/${circle.body.id}/invites`).set(owner).send({});
      await http().post(`${base}/join`).set(guest).send({ code: invite.body.code }).expect(200);

      await http().post(khatms).set(owner).send({ title: "" }).expect(400);
      const khatm = await http().post(khatms).set(owner).send({ title: "Ramadan" }).expect(201);
      const k = `${khatms}/${khatm.body.id}`;
      expect(khatm.body.parts).toHaveLength(30);

      const listed = await http().get(khatms).set(guest).expect(200);
      expect(listed.body.items).toHaveLength(1);
      await http().get(k).set(guest).expect(200);
      await http().get(`${khatms}/not-a-uuid`).set(guest).expect(400);

      const edited = await http().patch(k).set(owner).send({ title: "Ramadan 1448" }).expect(200);
      expect(edited.body.title).toBe("Ramadan 1448");

      await http().post(`${k}/parts/x/claim`).set(guest).expect(400);
      const claimed = await http().post(`${k}/parts/1/claim`).set(guest).expect(200);
      expect(claimed.body.parts[0].status).toBe("assigned");
      await http().post(`${k}/parts/1/reading`).set(guest).expect(200);
      const done = await http().post(`${k}/parts/1/complete`).set(guest).expect(200);
      expect(done.body.parts[0].status).toBe("done");
      await http().post(`${k}/parts/2/claim`).set(guest).expect(200);
      const released = await http().post(`${k}/parts/2/release`).set(guest).expect(200);
      expect(released.body.parts[1].status).toBe("open");

      const assigned = await http()
        .post(`${k}/parts/3/assign`)
        .set(owner)
        .send({ memberId: claimed.body.parts[0].assignee?.memberId ?? null })
        .expect(200);
      expect(assigned.body.parts[2]).toBeDefined();

      // Self-pick khatms don't deal; a running round can't be restarted.
      await http().post(`${k}/deal`).set(owner).expect(400);
      await http().post(`${k}/rounds`).set(owner).expect(409);

      await http().delete(k).set(guest).expect(403);
      await http().delete(k).set(owner).expect(204);
      await http().get(k).set(owner).expect(404);
    });
  });

  describe("family: children, child sessions and signals", () => {
    it("links a child device that writes its own salah and nothing else", async () => {
      const family = await http()
        .post(base)
        .set(owner)
        .send({ type: "family", name: "Home" })
        .expect(201);
      const circleId = family.body.id as string;
      const children = `${base}/${circleId}/children`;

      await http()
        .post(children)
        .set(owner)
        .send({ nickname: "Ali", birthYear: 2016, parentalConsent: false })
        .expect(400);
      const child = await http()
        .post(children)
        .set(owner)
        .send({ nickname: "Ali", birthYear: 2016, ...CONSENT })
        .expect(201);
      const childUrl = `${children}/${child.body.id}`;

      const listed = await http().get(children).set(owner).expect(200);
      expect(listed.body).toHaveLength(1);
      const patched = await http()
        .patch(childUrl)
        .set(owner)
        .send({ nickname: "Ali K" })
        .expect(200);
      expect(patched.body.nickname).toBe("Ali K");
      // Re-confirming records a newer consent policy version.
      const consented = await http()
        .post(`${childUrl}/consent`)
        .set(owner)
        .send({ ...CONSENT, consentPolicyVersion: "2027-01" })
        .expect(200);
      expect(consented.body.consentPending).toBe(false);
      await http()
        .post(`${childUrl}/consent`)
        .set(owner)
        .send({ consentPolicyVersion: "2027-01" })
        .expect(400);

      const link = await http().post(`${childUrl}/device-link`).set(owner).expect(201);
      await http()
        .post("/api/v1/circle-child/session")
        .send({ linkToken: "not-a-link" })
        .expect(400);
      const session = await http()
        .post("/api/v1/circle-child/session")
        .send({ linkToken: link.body.linkToken })
        .expect(200);
      const childAuth = { Authorization: `Bearer ${session.body.childToken}` };

      const me = await http().get("/api/v1/circle-child/me").set(childAuth).expect(200);
      expect(me.body.nickname).toBe("Ali K");
      // Child sessions only reach opted-in routes.
      await http().get(`${base}/${circleId}`).set(childAuth).expect(403);
      await http().get(children).set(childAuth).expect(403);
      await http()
        .put(`${base}/${circleId}/signals/rest-day`)
        .set(childAuth)
        .send({ date: today() })
        .expect(403);

      const signals = `${base}/${circleId}/signals`;
      await http()
        .put(`${signals}/fard-status`)
        .set(childAuth)
        .send({ date: today(), ...FARD })
        .expect(200);
      const read = await http()
        .get(signals)
        .query({ from: today(), to: today() })
        .set(owner)
        .expect(200);
      expect(read.body.items).toHaveLength(1);
      await http().get(signals).query({ from: "today" }).set(owner).expect(400);
      await http().delete(`${signals}/not_a_kind/${today()}`).set(childAuth).expect(400);
      await http().delete(`${signals}/fard_status/${today()}`).set(childAuth).expect(204);
      const cleared = await http()
        .get(signals)
        .query({ from: today(), to: today() })
        .set(childAuth)
        .expect(200);
      expect(cleared.body.items).toEqual([]);

      // A parent marks a rest day for the child (by its opaque member id).
      const detail = await http().get(`${base}/${circleId}`).set(owner).expect(200);
      const childMemberId = detail.body.members.find(
        (m: { memberKind: string }) => m.memberKind === "child",
      ).memberId as string;
      await http()
        .put(`${signals}/rest-day`)
        .set(owner)
        .send({ date: today(), memberId: childMemberId })
        .expect(200);
      await http()
        .delete(`${signals}/rest_day/${today()}`)
        .query({ memberId: childMemberId })
        .set(owner)
        .expect(204);

      // An 10-year-old can't graduate to a full account yet.
      await http()
        .post("/api/v1/circle-child/graduate")
        .set(owner)
        .send({ childToken: session.body.childToken })
        .expect(403);

      await http().delete(`${childUrl}/device`).set(owner).expect(204);
      await http().get("/api/v1/circle-child/me").set(childAuth).expect(401);
      await http().delete(childUrl).set(owner).expect(204);
      const after = await http().get(children).set(owner).expect(200);
      expect(after.body).toEqual([]);
    });
  });

  describe("partner: goals and nudges", () => {
    it("shares goal_done and delivers a nudge to the other partner", async () => {
      const duo = await http()
        .post(base)
        .set(owner)
        .send({ type: "partner", name: "Duo" })
        .expect(201);
      const circleId = duo.body.id as string;
      const invite = await http().post(`${base}/${circleId}/invites`).set(owner).send({});
      await http().post(`${base}/join`).set(partner).send({ code: invite.body.code }).expect(200);

      await http()
        .put(`${base}/${circleId}/signals/goal-done`)
        .set(partner)
        .send({ date: today() })
        .expect(200);
      const seen = await http()
        .get(`${base}/${circleId}/signals`)
        .query({ from: today(), to: today() })
        .set(owner)
        .expect(200);
      expect(seen.body.items).toHaveLength(1);

      const detail = await http().get(`${base}/${circleId}`).set(owner).expect(200);
      const partnerId = detail.body.members.find((m: { isMe: boolean }) => !m.isMe)
        .memberId as string;
      await http()
        .post(`${base}/${circleId}/nudges`)
        .set(owner)
        .send({ toMemberId: partnerId, kind: "wave" })
        .expect(400);
      await http()
        .post(`${base}/${circleId}/nudges`)
        .set(owner)
        .send({ toMemberId: partnerId, kind: "dua" })
        .expect(201);
      const inbox = await http().get(`${base}/${circleId}/nudges`).set(partner).expect(200);
      expect(inbox.body.items).toHaveLength(1);
      expect(inbox.body.items[0].kind).toBe("dua");
    });
  });

  describe("nearby sessions", () => {
    it("lets a joiner ask, the host accept, and the joiner see the outcome", async () => {
      const group = await http()
        .post(base)
        .set(owner)
        .send({ type: "khatm_group", name: "Halaqa" })
        .expect(201);
      const host = `${base}/${group.body.id}/nearby-sessions`;
      const session = await http().post(host).set(owner).send({}).expect(201);
      const sessionId = session.body.sessionId as string;

      const preview = await http().get(`/api/v1/nearby-sessions/${sessionId}`).expect(200);
      expect(preview.body).toMatchObject({
        circleName: "Halaqa",
        matchCode: session.body.matchCode,
      });

      const asked = await http()
        .post(`/api/v1/nearby-sessions/${sessionId}/requests`)
        .set(guest)
        .send({ matchCode: session.body.matchCode, displayName: "Neighbour" })
        .expect(201);
      const joiner = `/api/v1/nearby-sessions/${sessionId}/requests/${asked.body.requestId}`;
      const pending = await http()
        .post(`${joiner}/status`)
        .send({ requestToken: asked.body.requestToken })
        .expect(200);
      expect(pending.body.status).toBe("pending");

      const requests = await http().get(`${host}/${sessionId}/requests`).set(owner).expect(200);
      expect(requests.body.items).toHaveLength(1);
      await http()
        .post(`${host}/${sessionId}/requests/${asked.body.requestId}/accept`)
        .set(owner)
        .expect(200);
      const accepted = await http()
        .post(`${joiner}/status`)
        .send({ requestToken: asked.body.requestToken })
        .expect(200);
      expect(accepted.body.status).toBe("accepted");

      // A second request is declined; a third cancelled by the joiner. Joining a
      // member session needs some account (a guest is enough) — anonymous is 401.
      await http()
        .post(`/api/v1/nearby-sessions/${sessionId}/requests`)
        .send({ matchCode: session.body.matchCode })
        .expect(401);
      const second = await http()
        .post(`/api/v1/nearby-sessions/${sessionId}/requests`)
        .set(guest2)
        .send({ matchCode: session.body.matchCode })
        .expect(201);
      await http()
        .post(`${host}/${sessionId}/requests/${second.body.requestId}/decline`)
        .set(owner)
        .expect(200);
      const third = await http()
        .post(`/api/v1/nearby-sessions/${sessionId}/requests`)
        .set(guest3)
        .send({ matchCode: session.body.matchCode, displayName: "Later" })
        .expect(201);
      await http()
        .post(`/api/v1/nearby-sessions/${sessionId}/requests/${third.body.requestId}/cancel`)
        .send({ requestToken: third.body.requestToken })
        .expect(204);

      await http().delete(`${host}/${sessionId}`).set(owner).expect(204);
    });
  });
});
