import { Module } from "@nestjs/common";
import { AppFeedbackModule } from "./app-feedback/app-feedback.module";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { AppConfigModule } from "./config/config.module";
import { ContentReportsModule } from "./content-reports/content-reports.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { SyncModule } from "./sync/sync.module";
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
    AppFeedbackModule,
    NotificationsModule,
    VersionModule,
  ],
})
export class AppModule {}
