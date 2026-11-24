import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { CirclesModule } from "../circles/circles.module";
import { SurfacePushJobEntity, SurfacePushRegistrationEntity } from "../database/entities";
import { SurfacePushController } from "./surface-push.controller";
import { SurfacePushService } from "./surface-push.service";
import { SurfacePushQStashService } from "./surface-push-qstash.service";
import { TypeOrmSurfaceJobStore } from "./typeorm-surface-job-store";

@Module({
  imports: [
    AuthModule,
    // D40: `dispatch-due` also ticks the weekly family digest (no new cron).
    CirclesModule,
    TypeOrmModule.forFeature([SurfacePushRegistrationEntity, SurfacePushJobEntity]),
  ],
  controllers: [SurfacePushController],
  providers: [SurfacePushService, SurfacePushQStashService, TypeOrmSurfaceJobStore],
  exports: [SurfacePushService],
})
export class SurfacePushModule {}
