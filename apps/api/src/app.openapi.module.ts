import { Module } from "@nestjs/common";
import { AppFeedbackController } from "./app-feedback/app-feedback.controller";
import { AppFeedbackService } from "./app-feedback/app-feedback.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AppConfigModule } from "./config/config.module";
import { ContentReportsController } from "./content-reports/content-reports.controller";
import { ContentReportsService } from "./content-reports/content-reports.service";
import { HealthModule } from "./health/health.module";
import { SyncController } from "./sync/sync.controller";
import { SyncService } from "./sync/sync.service";
import { AppVersionController } from "./version/app-version.controller";
import { AppVersionService } from "./version/app-version.service";

const openApiServiceMocks = {
  auth: {
    createGuestSession: async () => ({}),
    completeOAuth: async () => ({}),
    linkGuestAccount: async () => ({}),
    getCurrentUser: async () => ({}),
    revokeSession: async () => undefined,
    deleteAccount: async () => undefined,
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
  appVersion: {
    getAppVersionMeta: async () => ({
      updateRequired: "none",
      latestVersion: "1.0.0",
      minSoftVersion: "1.0.0",
      minHardVersion: "1.0.0",
      message: null,
      storeUrl: null,
    }),
    clearAppVersionCache: async () => undefined,
  },
  appFeedback: {
    submit: async () => undefined,
  },
};

@Module({
  imports: [AppConfigModule, HealthModule],
  controllers: [
    AuthController,
    SyncController,
    ContentReportsController,
    AppFeedbackController,
    AppVersionController,
  ],
  providers: [
    { provide: AuthService, useValue: openApiServiceMocks.auth },
    { provide: SyncService, useValue: openApiServiceMocks.sync },
    { provide: ContentReportsService, useValue: openApiServiceMocks.contentReports },
    { provide: AppFeedbackService, useValue: openApiServiceMocks.appFeedback },
    { provide: AppVersionService, useValue: openApiServiceMocks.appVersion },
  ],
})
export class AppOpenApiModule {}
