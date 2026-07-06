import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AppConfigModule } from "./config/config.module";
import { ContentReportsController } from "./content-reports/content-reports.controller";
import { ContentReportsService } from "./content-reports/content-reports.service";
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
  contentReports: {
    create: async () => ({}),
    list: async () => ({ items: [], total: 0, page: 1, limit: 20 }),
    getById: async () => ({}),
    adminUpdate: async () => ({}),
  },
};

@Module({
  imports: [AppConfigModule, HealthModule],
  controllers: [AuthController, SyncController, ContentReportsController],
  providers: [
    { provide: AuthService, useValue: openApiServiceMocks.auth },
    { provide: SyncService, useValue: openApiServiceMocks.sync },
    { provide: ContentReportsService, useValue: openApiServiceMocks.contentReports },
  ],
})
export class AppOpenApiModule {}
