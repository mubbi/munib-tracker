process.env.DATABASE_TYPE = "sqlite";
process.env.NODE_ENV = "test";
process.env.JWT_ACCESS_TTL = "15m";

import { type INestApplication, RequestMethod, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";
import { OAuthProviderService } from "../src/auth/oauth-provider.service";
import { StubOAuthProviderService } from "./support/oauth-stub";

describe("API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OAuthProviderService)
      .useClass(StubOAuthProviderService)
      .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix("api/v1", {
      exclude: [{ path: "/", method: RequestMethod.GET }],
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  }, 30_000);

  afterAll(async () => {
    await app?.close();
  });

  const http = () => request(app.getHttpServer());

  it("GET /", async () => {
    const response = await http().get("/").expect(200);

    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("Munib Tracker");
  });

  it("GET /api/v1/health", async () => {
    const response = await http().get("/api/v1/health").expect(200);

    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("Munib Tracker");
  });

  it("POST /api/v1/auth/guest issues a signed JWT session", async () => {
    const response = await http()
      .post("/api/v1/auth/guest")
      .send({ deviceId: "e2e-device-xxxxxxxx" })
      .expect(201);

    expect(response.body.accountType).toBe("guest");
    // Guest user ids are server-minted UUIDs — never the client deviceId.
    expect(response.body.userId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(response.body.userId).not.toBe("e2e-device-xxxxxxxx");
    expect(String(response.body.accessToken).split(".")).toHaveLength(3);
    expect(response.body.accessTokenExpiresIn).toBeGreaterThan(0);
  });

  it("POST /api/v1/auth/refresh rotates the refresh token", async () => {
    const guest = await http().post("/api/v1/auth/guest").send({ deviceId: "e2e-refresh-xxxxxxx" });
    const refreshed = await http()
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: guest.body.refreshToken })
      .expect(201);

    expect(refreshed.body.refreshToken).not.toBe(guest.body.refreshToken);
    expect(refreshed.body.accessToken).toBeTruthy();

    // Reusing the rotated-out refresh token is rejected.
    await http()
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: guest.body.refreshToken })
      .expect(401);
  });

  it("blocks guests from cloud sync with 403", async () => {
    const guest = await http().post("/api/v1/auth/guest").send({ deviceId: "e2e-guest-sync-xxxx" });

    await http()
      .get("/api/v1/sync/pull")
      .set("Authorization", `Bearer ${guest.body.accessToken}`)
      .expect(403);
  });

  it("round-trips changes through push and pull for an authenticated user", async () => {
    const signIn = await http().post("/api/v1/auth/oauth/google").send({ code: "e2e-code" });
    const token = signIn.body.accessToken as string;
    expect(signIn.body.accountType).toBe("user");

    // Second "device" for the same account, to prove pull sees pushed data.
    const bearer = { Authorization: `Bearer ${token}` };

    await http()
      .post("/api/v1/sync/push")
      .set(bearer)
      .send({
        changes: [
          {
            entity: "prayer_logs",
            id: "fajr-2026-01-01",
            data: { status: "completed" },
            updatedAt: "2026-01-01T05:00:00.000Z",
          },
        ],
      })
      .expect(({ body }) => {
        expect(body.accepted).toBe(1);
        expect(body.conflicts).toHaveLength(0);
      });

    const pulled = await http().get("/api/v1/sync/pull").set(bearer).expect(200);
    expect(pulled.body.changes).toHaveLength(1);
    expect(pulled.body.changes[0].id).toBe("fajr-2026-01-01");
    expect(pulled.body.changes[0].data.status).toBe("completed");

    // An older change loses to the stored one (last-write-wins conflict).
    const conflict = await http()
      .post("/api/v1/sync/push")
      .set(bearer)
      .send({
        changes: [
          {
            entity: "prayer_logs",
            id: "fajr-2026-01-01",
            data: { status: "missed" },
            updatedAt: "2025-12-31T00:00:00.000Z",
          },
        ],
      })
      .expect(200);

    expect(conflict.body.accepted).toBe(0);
    expect(conflict.body.conflicts).toHaveLength(1);
    expect(conflict.body.conflicts[0].data.status).toBe("completed");
  });

  it("permanently deletes the account and all its synced data", async () => {
    // A distinct identity (apple) so this test's deletion never disturbs the
    // google account the round-trip test above relies on.
    const signIn = await http().post("/api/v1/auth/oauth/apple").send({ code: "e2e-delete" });
    const bearer = { Authorization: `Bearer ${signIn.body.accessToken}` };

    await http()
      .post("/api/v1/sync/push")
      .set(bearer)
      .send({
        changes: [
          {
            entity: "prayer_logs",
            id: "isha-2026-02-02",
            data: { status: "completed" },
            updatedAt: "2026-02-02T20:00:00.000Z",
          },
        ],
      })
      .expect(({ body }) => {
        expect(body.accepted).toBe(1);
      });

    await http().delete("/api/v1/auth/me").set(bearer).expect(204);

    // The session is revoked — the same token no longer authenticates.
    await http().get("/api/v1/sync/pull").set(bearer).expect(401);

    // Signing back in with the same identity starts from a fresh, empty account —
    // the deleted data does not repopulate.
    const again = await http().post("/api/v1/auth/oauth/apple").send({ code: "e2e-delete-2" });
    const pulled = await http()
      .get("/api/v1/sync/pull")
      .set({ Authorization: `Bearer ${again.body.accessToken}` })
      .expect(200);
    expect(pulled.body.changes).toHaveLength(0);
  });
});
