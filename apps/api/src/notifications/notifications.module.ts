import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../database/entities";
import { ReviewReactivationService } from "./review-reactivation.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [ReviewReactivationService],
  exports: [ReviewReactivationService],
})
export class NotificationsModule {}
