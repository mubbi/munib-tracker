process.env.DATABASE_TYPE = "sqlite";
process.env.NODE_ENV = "test";

import { type INestApplication, RequestMethod, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";
import { OAuthProviderService } from "../src/auth/oauth-provider.service";
import { StubOAuthProviderService } from "./support/oauth-stub";

const today = () => new Date().toISOString().slice(0, 10);

describe("circles (e2e)", () => {
  let app: INestApplication;
  let parent: { Authorization: string };
  let guest: { Authorization: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OAuthProviderService)
      .useClass(StubOAuthProviderService)
      .compile();

    app = moduleFixture.createNestApplication({ rawBody: true });
    app.setGlobalPrefix("api/v1", { exclude: [{ path: "/", method: RequestMethod.GET }] });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    const signIn = await request(app.getHttpServer())
      .post("/api/v1/auth/oauth/google")
      .send({ code: "e2e-circles" });
    parent = { Authorization: `Bearer ${signIn.body.accessToken}` };
    const guestSession = await request(app.getHttpServer())
      .post("/api/v1/auth/guest")
      .send({ deviceId: "dev_circles_e2e_guest_0001" });
    guest = { Authorization: `Bearer ${guestSession.body.accessToken}` };
  }, 30_000);

  afterAll(async () => {
    await app?.close();
  });

  const http = () => request(app.getHttpServer());

  it("requires auth", async () => {
    await http().get("/api/v1/circles").expect(401);
  });

  it("runs the family + child-device flow over HTTP with closed schemas", async () => {
    const family = await http()
      .post("/api/v1/circles")
      .set(parent)
      .send({ type: "family", name: "Home" })
      .expect(201);
    const circleId = family.body.id as string;

    await http()
      .post(`/api/v1/circles/${circleId}/children`)
      .set(parent)
      .send({
        nickname: "Ali",
        birthYear: 2018,
        parentalConsent: true,
        consentPolicyVersion: "1",
        email: "x@y.z",
      })
      .expect(400);
    const child = await http()
      .post(`/api/v1/circles/${circleId}/children`)
      .set(parent)
      .send({ nickname: "Ali", birthYear: 2018, parentalConsent: true, consentPolicyVersion: "1" })
      .expect(201);

    const link = await http()
      .post(`/api/v1/circles/${circleId}/children/${child.body.id}/device-link`)
      .set(parent)
      .expect(201);
    const session = await http()
      .post("/api/v1/circle-child/session")
      .send({ linkToken: link.body.linkToken })
      .expect(200);
    const childAuth = { Authorization: `Bearer ${session.body.childToken}` };

    await http().get("/api/v1/circle-child/me").set(childAuth).expect(200);
    // Child sessions are limited to opted-in endpoints.
    await http().get("/api/v1/circles").set(childAuth).expect(403);

    const fard = { date: today(), fajr: true, dhuhr: true, asr: false, maghrib: true, isha: true };
    await http()
      .put(`/api/v1/circles/${circleId}/signals/fard-status`)
      .set(childAuth)
      .send({ ...fard, note: "overslept" })
      .expect(400);
    await http()
      .put(`/api/v1/circles/${circleId}/signals/fard-status`)
      .set(childAuth)
      .send(fard)
      .expect(200);

    const seen = await http()
      .get(`/api/v1/circles/${circleId}/signals`)
      .query({ from: today(), to: today() })
      .set(parent)
      .expect(200);
    expect(seen.body.items).toHaveLength(1);
    expect(seen.body.items[0].value).toEqual({
      fajr: true,
      dhuhr: true,
      asr: false,
      maghrib: true,
      isha: true,
    });

    await http()
      .delete(`/api/v1/circles/${circleId}/children/${child.body.id}`)
      .set(parent)
      .expect(204);
    await http().get("/api/v1/circle-child/me").set(childAuth).expect(401);
  });

  it("lets a guest join a khatm group by code and claim a juz", async () => {
    const group = await http()
      .post("/api/v1/circles")
      .set(parent)
      .send({ type: "khatm_group", name: "Masjid khatm", masjidOsmRef: "node/42" })
      .expect(201);
    const circleId = group.body.id as string;
    const khatm = await http()
      .post(`/api/v1/circles/${circleId}/khatms`)
      .set(parent)
      .send({ title: "Ramadan" })
      .expect(201);
    expect(khatm.body.parts).toHaveLength(30);

    const invite = await http()
      .post(`/api/v1/circles/${circleId}/invites`)
      .set(parent)
      .send({})
      .expect(201);
    expect(invite.body.maxUses).toBe(200);

    await http().get(`/api/v1/circles/join/${invite.body.code}`).set(guest).expect(200);
    await http()
      .post("/api/v1/circles/join")
      .set(guest)
      .send({ code: invite.body.code, displayName: "Guest" })
      .expect(200);
    const claimed = await http()
      .post(`/api/v1/circles/${circleId}/khatms/${khatm.body.id}/parts/3/claim`)
      .set(guest)
      .expect(200);
    expect(claimed.body.parts[2].status).toBe("assigned");
    await http()
      .post(`/api/v1/circles/${circleId}/khatms/${khatm.body.id}/parts/3/claim`)
      .set(parent)
      .expect(409);
  });
});
