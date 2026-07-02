import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { SyncRecordEntity } from "../database/entities";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([SyncRecordEntity])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
