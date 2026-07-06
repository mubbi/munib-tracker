import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { ContentReportAttachmentEntity, ContentReportEntity } from "../database/entities";
import { ContentReportsController } from "./content-reports.controller";
import { ContentReportsService } from "./content-reports.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ContentReportEntity, ContentReportAttachmentEntity]),
  ],
  controllers: [ContentReportsController],
  providers: [ContentReportsService],
})
export class ContentReportsModule {}
