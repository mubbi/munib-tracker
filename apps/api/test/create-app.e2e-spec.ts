process.env.DATABASE_TYPE = "sqlite";
process.env.NODE_ENV = "test";

import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Request, Response } from "express";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/create-app";

/**
 * Boots the real production bootstrap (`createApp`) rather than a hand-built
 * testing app, so body-parser / rawBody / global-prefix wiring is covered.
 */
describe("createApp bootstrap (e2e)", () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = (await createApp({ enableSwagger: false })) as NestExpressApplication;
    // Registered after createApp's parsers, so it observes what real routes see.
    app
      .getHttpAdapter()
      .getInstance()
      .post("/__test/raw-body", (req: Request & { rawBody?: Buffer }, res: Response) => {
        res.json({ body: req.body, hasRawBody: Buffer.isBuffer(req.rawBody) });
      });
    await app.init();
  }, 30_000);

  afterAll(async () => {
    await app?.close();
  });

  const http = () => request(app.getHttpServer());

  it("parses JSON bodies outside the sync routes", async () => {
    const response = await http()
      .post("/api/v1/auth/guest")
      .send({ deviceId: "bootstrap-device-xxxx" })
      .expect(201);
    expect(response.body.accountType).toBe("guest");
  });

  it("captures rawBody for JSON requests (QStash signature verification)", async () => {
    const response = await http().post("/__test/raw-body").send({ hello: "world" }).expect(200);
    expect(response.body).toEqual({ body: { hello: "world" }, hasRawBody: true });
  });

  it("parses urlencoded bodies", async () => {
    const response = await http()
      .post("/__test/raw-body")
      .type("form")
      .send("a=1&b=two")
      .expect(200);
    expect(response.body.body).toEqual({ a: "1", b: "two" });
  });

  it("accepts sync payloads above the 100 KB default limit", async () => {
    const big = "x".repeat(300 * 1024);
    // Unauthenticated, so the handler rejects — but not with 413 from the parser.
    const response = await http().post("/api/v1/sync/push").send({ changes: [], pad: big });
    expect(response.status).not.toBe(413);
  });
});
