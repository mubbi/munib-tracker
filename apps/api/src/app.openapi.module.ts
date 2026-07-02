import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AppConfigModule } from "./config/config.module";
import { HealthModule } from "./health/health.module";
import { SyncController } from "./sync/sync.controller";
import { SyncService } from "./sync/sync.service";

const openApiServiceMocks = {
  auth: {
    createGuestSession: async () => ({}),
    completeOAuth: async () => ({}),
    linkGuestAccount: async () => ({}),
    getCurrentUser: async () => ({}),
    revokeSession: async () => undefined,
  },
  sync: {
    pull: async () => ({ changes: [], serverTime: new Date().toISOString() }),
    push: async () => ({ accepted: 0, conflicts: [], serverTime: new Date().toISOString() }),
  },
};

@Module({
  imports: [AppConfigModule, HealthModule],
  controllers: [AuthController, SyncController],
  providers: [
    { provide: AuthService, useValue: openApiServiceMocks.auth },
    { provide: SyncService, useValue: openApiServiceMocks.sync },
  ],
})
export class AppOpenApiModule {}
