import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { InAppNotificationEntity, PushTokenEntity, UserEntity } from "../database/entities";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { ReviewReactivationService } from "./review-reactivation.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity, InAppNotificationEntity, PushTokenEntity]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, ReviewReactivationService],
  exports: [NotificationsService, ReviewReactivationService],
})
export class NotificationsModule {}
