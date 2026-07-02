import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_TYPE = "sqlite";

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix("api/v1");
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
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /api/v1/health", async () => {
    const response = await request(app.getHttpServer()).get("/api/v1/health").expect(200);

    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("Munib Tracker");
  });

  it("POST /api/v1/auth/guest", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/guest")
      .send({ deviceId: "e2e-device" })
      .expect(201);

    expect(response.body.accountType).toBe("guest");
    expect(response.body.userId).toBe("e2e-device");
  });
});
