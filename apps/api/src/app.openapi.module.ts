import { Module } from "@nestjs/common";
import { AppFeedbackController } from "./app-feedback/app-feedback.controller";
import { AppFeedbackService } from "./app-feedback/app-feedback.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AuthOAuthService } from "./auth/auth-oauth.service";
import { AppConfigModule } from "./config/config.module";
import { ContentReportsController } from "./content-reports/content-reports.controller";
import { ContentReportsService } from "./content-reports/content-reports.service";
import { HealthModule } from "./health/health.module";
import { NotificationsController } from "./notifications/notifications.controller";
import { NotificationsService } from "./notifications/notifications.service";
import { OssContentFailuresController } from "./oss-content-failures/oss-content-failures.controller";
import { OssContentFailuresService } from "./oss-content-failures/oss-content-failures.service";
import { SyncController } from "./sync/sync.controller";
import { SyncService } from "./sync/sync.service";
import { UserMediaController } from "./user-media/user-media.controller";
import { UserMediaService } from "./user-media/user-media.service";
import { AppVersionController } from "./version/app-version.controller";
import { AppVersionService } from "./version/app-version.service";

const openApiServiceMocks = {
  auth: {
    createGuestSession: async () => ({}),
    completeOAuth: async () => ({}),
    completeOAuthFromProfile: async () => ({}),
    linkGuestAccount: async () => ({}),
    refreshSession: async () => ({}),
    getCurrentUser: async () => ({}),
    revokeSession: async () => undefined,
    deleteAccount: async () => undefined,
  },
  authOAuth: {
    completeGoogleNative: async () => ({}),
    completeGoogleOauth: async () => ({}),
    completeAppleNative: async () => ({}),
    completeAppleOauth: async () => ({}),
    startAppleOauthSession: () => undefined,
    completeAppleOauthCallback: async () => undefined,
    issueSessionResponse: async () => ({}),
    resolveAccessToken: () => "token",
    resolveRefreshToken: () => "refresh",
    clearAuthCookies: () => undefined,
  },
  sync: {
    pull: async () => ({ changes: [], serverTime: new Date().toISOString() }),
    push: async () => ({ accepted: 0, conflicts: [], serverTime: new Date().toISOString() }),
  },
  contentReports: {
    create: async () => ({}),
    list: async () => ({ items: [], total: 0, page: 1, limit: 20 }),
    getById: async () => ({}),
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
  ossContentFailures: {
    report: async () => undefined,
  },
  userMedia: {
    upload: async () => [],
    getMeta: async () => ({}),
    getContent: async () => ({
      buffer: Buffer.from(""),
      mimeType: "image/jpeg",
      filename: "empty.jpg",
    }),
    remove: async () => undefined,
  },
  notifications: {
    getVapidPublicKey: () => ({ publicKey: null }),
    upsertPushToken: async () => ({}),
    listInApp: async () => ({ items: [] }),
    unreadCount: async () => ({ count: 0 }),
    markRead: async () => ({}),
    markAllRead: async () => ({ count: 0 }),
    engage: async () => ({}),
  },
};

@Module({
  imports: [AppConfigModule, HealthModule],
  controllers: [
    AuthController,
    SyncController,
    ContentReportsController,
    UserMediaController,
    AppFeedbackController,
    OssContentFailuresController,
    AppVersionController,
    NotificationsController,
  ],
  providers: [
    { provide: AuthService, useValue: openApiServiceMocks.auth },
    { provide: AuthOAuthService, useValue: openApiServiceMocks.authOAuth },
    { provide: SyncService, useValue: openApiServiceMocks.sync },
    { provide: ContentReportsService, useValue: openApiServiceMocks.contentReports },
    { provide: UserMediaService, useValue: openApiServiceMocks.userMedia },
    { provide: AppFeedbackService, useValue: openApiServiceMocks.appFeedback },
    { provide: OssContentFailuresService, useValue: openApiServiceMocks.ossContentFailures },
    { provide: AppVersionService, useValue: openApiServiceMocks.appVersion },
    { provide: NotificationsService, useValue: openApiServiceMocks.notifications },
  ],
})
export class AppOpenApiModule {}
