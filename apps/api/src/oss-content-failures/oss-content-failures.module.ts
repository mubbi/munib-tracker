import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { OssContentDownloadFailureEntity } from "../database/entities";
import { OssContentFailuresController } from "./oss-content-failures.controller";
import { OssContentFailuresService } from "./oss-content-failures.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([OssContentDownloadFailureEntity])],
  controllers: [OssContentFailuresController],
  providers: [OssContentFailuresService],
  exports: [OssContentFailuresService],
})
export class OssContentFailuresModule {}
