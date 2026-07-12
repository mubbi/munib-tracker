import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UserMediaEntity } from "../database/entities";
import { UserMediaController } from "./user-media.controller";
import { UserMediaService } from "./user-media.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserMediaEntity])],
  controllers: [UserMediaController],
  providers: [UserMediaService],
  exports: [UserMediaService],
})
export class UserMediaModule {}
