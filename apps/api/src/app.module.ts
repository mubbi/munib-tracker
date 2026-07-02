import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AppConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { SyncModule } from "./sync/sync.module";

@Module({
  imports: [AppConfigModule, DatabaseModule, HealthModule, AuthModule, SyncModule],
})
export class AppModule {}
