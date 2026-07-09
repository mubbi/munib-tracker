import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { AppFeedbackEntity } from "../database/entities";
import { AppFeedbackController } from "./app-feedback.controller";
import { AppFeedbackService } from "./app-feedback.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([AppFeedbackEntity])],
  controllers: [AppFeedbackController],
  providers: [AppFeedbackService],
  exports: [AppFeedbackService],
})
export class AppFeedbackModule {}
