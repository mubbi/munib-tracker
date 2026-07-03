import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, type TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { type OAuthProfile, OAuthProviderService } from "../auth/oauth-provider.service";
import { TokenService } from "../auth/token.service";
import { validateEnvironment } from "../config/env.validation";
import { AuthSessionEntity, SyncRecordEntity, UserEntity } from "../database/entities";
import { createInMemorySqliteOptions } from "../database/in-memory-sqlite.options";
import { SyncService } from "./sync.service";

class StubOAuthProviderService {
  async exchange(provider: AuthProvider): Promise<OAuthProfile> {
    return { providerAccountId: `${provider}-account`, email: `${provider}-user@example.com` };
  }
}

describe("SyncService", () => {
  let authService: AuthService;
  let syncService: SyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate: validateEnvironment,
        }),
        JwtModule.register({ secret: "test-secret" }),
        TypeOrmModule.forRoot(createInMemorySqliteOptions()),
        TypeOrmModule.forFeature([UserEntity, AuthSessionEntity, SyncRecordEntity]),
      ],
      providers: [
        AuthService,
        SyncService,
        TokenService,
        { provide: OAuthProviderService, useClass: StubOAuthProviderService },
      ],
    }).compile();

    authService = module.get(AuthService);
    syncService = module.get(SyncService);
  });

  it("blocks guest accounts from syncing", async () => {
    const guest = await authService.createGuestSession({});

    await expect(syncService.pull(guest.accessToken)).rejects.toThrow(
      "Cloud sync is disabled for guest accounts",
    );
  });

  it("accepts pushed changes for authenticated users", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    const response = await syncService.push(session.accessToken, {
      changes: [
        {
          entity: "prayer_logs",
          id: "log-1",
          data: { completed: true },
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    expect(response.accepted).toBe(1);
    expect(response.conflicts).toHaveLength(0);
  });
});
