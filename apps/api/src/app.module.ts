import { Module } from "@nestjs/common";
import { AppFeedbackModule } from "./app-feedback/app-feedback.module";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { AppConfigModule } from "./config/config.module";
import { ContentReportsModule } from "./content-reports/content-reports.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { OssContentFailuresModule } from "./oss-content-failures/oss-content-failures.module";
import { SyncModule } from "./sync/sync.module";
import { UserMediaModule } from "./user-media/user-media.module";
import { VersionModule } from "./version/version.module";

@Module({
  imports: [
    AppConfigModule,
    CommonModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    SyncModule,
    ContentReportsModule,
    UserMediaModule,
    AppFeedbackModule,
    OssContentFailuresModule,
    NotificationsModule,
    VersionModule,
  ],
})
export class AppModule {}
