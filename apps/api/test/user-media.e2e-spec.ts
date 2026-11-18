process.env.DATABASE_TYPE = "sqlite";
process.env.NODE_ENV = "test";
// Force disk storage — never touch a real Cloudinary account from tests.
process.env.CLOUDINARY_CLOUD_NAME = "";
process.env.CLOUDINARY_API_KEY = "";
process.env.CLOUDINARY_API_SECRET = "";

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const mediaDir = mkdtempSync(join(tmpdir(), "munib-user-media-e2e-"));
process.env.USER_MEDIA_DIR = mediaDir;

import { type INestApplication, RequestMethod, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";
import { OAuthProviderService } from "../src/auth/oauth-provider.service";
import { StubOAuthProviderService } from "./support/oauth-stub";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);
const PDF = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF\n", "utf8");

describe("user-media (e2e)", () => {
  let app: INestApplication;
  let bearer: { Authorization: string };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OAuthProviderService)
      .useClass(StubOAuthProviderService)
      .compile();

    app = moduleFixture.createNestApplication({ rawBody: true });
    app.setGlobalPrefix("api/v1", {
      exclude: [{ path: "/", method: RequestMethod.GET }],
    });
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
      .send({ code: "e2e-user-media" });
    bearer = { Authorization: `Bearer ${signIn.body.accessToken}` };
  }, 30_000);

  afterAll(async () => {
    await app?.close();
    rmSync(mediaDir, { recursive: true, force: true });
  });

  const http = () => request(app.getHttpServer());

  it("uploads, serves, and deletes an image + PDF for a linked account", async () => {
    const upload = await http()
      .post("/api/v1/user-media")
      .set(bearer)
      // Deliberately wrong client MIME — magic bytes are authoritative.
      .attach("files", PNG, { filename: "photo.jpg", contentType: "application/octet-stream" })
      .attach("files", PDF, { filename: "notes.pdf", contentType: "application/pdf" })
      .expect(201);

    expect(upload.body.items).toHaveLength(2);
    const [image, pdf] = upload.body.items;
    expect(image.mimeType).toBe("image/png");
    expect(pdf.mimeType).toBe("application/pdf");

    const content = await http()
      .get(`/api/v1/user-media/${image.id}/content`)
      .set(bearer)
      .buffer(true)
      .parse((res, done) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => done(null, Buffer.concat(chunks)));
      })
      .expect(200);
    expect(content.headers["content-type"]).toContain("image/png");
    expect(Buffer.compare(content.body as Buffer, PNG)).toBe(0);

    await http().delete(`/api/v1/user-media/${image.id}`).set(bearer).expect(204);
    await http().get(`/api/v1/user-media/${image.id}/content`).set(bearer).expect(404);
    await http().delete(`/api/v1/user-media/${pdf.id}`).set(bearer).expect(204);
  }, 20_000);

  it("keeps non-ASCII filenames intact and serves them without a broken header", async () => {
    const name = "دعاء الصباح.png";
    const upload = await http()
      .post("/api/v1/user-media")
      .set(bearer)
      .attach("files", PNG, { filename: name, contentType: "image/png" })
      .expect(201);

    expect(upload.body.items[0].filename).toBe(name);
    const content = await http()
      .get(`/api/v1/user-media/${upload.body.items[0].id}/content`)
      .set(bearer)
      .expect(200);
    expect(content.headers["content-disposition"]).toContain(
      `filename*=UTF-8''${encodeURIComponent(name)}`,
    );
  });

  it("caps very long non-ASCII filenames to the 255-char column", async () => {
    const name = `${"ذ".repeat(300)}.png`;
    const upload = await http()
      .post("/api/v1/user-media")
      .set(bearer)
      .attach("files", PNG, { filename: name, contentType: "image/png" })
      .expect(201);
    expect(upload.body.items[0].filename).toBe("ذ".repeat(255));
  });

  it("decodes the percent-encoded filename sent by Expo's native fetch", async () => {
    const upload = await http()
      .post("/api/v1/user-media")
      .set(bearer)
      .attach("files", PNG, {
        filename: encodeURIComponent("my دعاء photo.png"),
        contentType: "image/png",
      })
      .expect(201);
    expect(upload.body.items[0].filename).toBe("my دعاء photo.png");
  });

  it("rejects guests with GUEST_NOT_ALLOWED", async () => {
    const guest = await http().post("/api/v1/auth/guest").send({ deviceId: "e2e-media-guest-xx" });
    const response = await http()
      .post("/api/v1/user-media")
      .set("Authorization", `Bearer ${guest.body.accessToken}`)
      .attach("files", PNG, { filename: "photo.png", contentType: "image/png" })
      .expect(403);
    expect(response.body.code).toBe("GUEST_NOT_ALLOWED");
  });

  it("rejects unsupported bytes and oversized files with 4xx (never 500)", async () => {
    await http()
      .post("/api/v1/user-media")
      .set(bearer)
      .attach("files", Buffer.from("GIF89a-not-allowed"), {
        filename: "anim.png",
        contentType: "image/png",
      })
      .expect(400);

    const tooBig = Buffer.concat([PNG, Buffer.alloc(1024 * 1024 + 1)]);
    await http()
      .post("/api/v1/user-media")
      .set(bearer)
      .attach("files", tooBig, { filename: "big.png", contentType: "image/png" })
      .expect(413);
  });
});
