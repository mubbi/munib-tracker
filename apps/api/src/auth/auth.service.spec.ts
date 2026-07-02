import { ConfigModule } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { beforeEach, describe, expect, it } from "vitest";
import { validateEnvironment } from "../config/env.validation";
import { AuthSessionEntity, UserEntity } from "../database/entities";
import { createInMemorySqliteOptions } from "../database/in-memory-sqlite.options";
import { AuthService } from "./auth.service";
import { AuthProvider } from "./dto/auth.dto";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate: validateEnvironment,
        }),
        TypeOrmModule.forRoot(createInMemorySqliteOptions([UserEntity, AuthSessionEntity])),
        TypeOrmModule.forFeature([UserEntity, AuthSessionEntity]),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  it("creates a guest session", async () => {
    const session = await service.createGuestSession({ deviceId: "device-1" });

    expect(session.accountType).toBe("guest");
    expect(session.userId).toBe("device-1");
    expect(session.accessToken).toBeTruthy();
  });

  it("rejects OAuth when provider is not configured", async () => {
    await expect(service.completeOAuth(AuthProvider.Google, { code: "test-code" })).rejects.toThrow(
      "google sign-in is not configured on the server yet",
    );
  });
});
