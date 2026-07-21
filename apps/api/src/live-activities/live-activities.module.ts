import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { LiveActivityPushJobEntity, LiveActivityPushTokenEntity } from "../database/entities";
import { ApnsLiveActivityService } from "./apns-live-activity.service";
import { LiveActivitiesController } from "./live-activities.controller";
import { LiveActivitiesService } from "./live-activities.service";
import { LiveActivityQStashService } from "./live-activity-qstash.service";
import { TypeOrmLiveActivityJobStore } from "./typeorm-live-activity-job-store";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([LiveActivityPushTokenEntity, LiveActivityPushJobEntity]),
  ],
  controllers: [LiveActivitiesController],
  providers: [
    LiveActivitiesService,
    ApnsLiveActivityService,
    LiveActivityQStashService,
    TypeOrmLiveActivityJobStore,
  ],
  exports: [LiveActivitiesService],
})
export class LiveActivitiesModule {}
