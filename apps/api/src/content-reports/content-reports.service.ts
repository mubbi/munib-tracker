import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  ContentReportReference,
  ContentReportStatus,
} from "@munib-tracker/shared/types/content-report";
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import type { EnvironmentVariables } from "../config/env.schema";
import { ContentReportAttachmentEntity, ContentReportEntity } from "../database/entities";
import { isContentReportRateLimited } from "./content-report-rate-limit";
import {
  type AdminContentReportDetailDto,
  AdminUpdateContentReportDto,
  CONTENT_REPORT_STATUSES,
  ContentReportDetailDto,
  ContentReportListResponseDto,
  CreateContentReportDto,
} from "./dto/content-report.dto";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const MAX_ATTACHMENTS = 3;

export type UploadedAttachment = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

@Injectable()
export class ContentReportsService {
  constructor(
    @InjectRepository(ContentReportEntity)
    private readonly reportsRepository: Repository<ContentReportEntity>,
    @InjectRepository(ContentReportAttachmentEntity)
    private readonly attachmentsRepository: Repository<ContentReportAttachmentEntity>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async create(
    accessToken: string,
    dto: CreateContentReportDto,
    files: UploadedAttachment[] = [],
  ): Promise<ContentReportDetailDto> {
    const user = await this.requireLinkedUser(accessToken);

    if (isContentReportRateLimited(user.userId)) {
      throw new HttpException(
        "Report rate limit exceeded. Try again later.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.validateAttachments(files);

    const reportId = randomUUID();
    const report = this.reportsRepository.create({
      id: reportId,
      userId: user.userId,
      status: "pending" satisfies ContentReportStatus,
      issueType: dto.issueType,
      description: dto.description.trim(),
      suggestedCorrection: dto.suggestedCorrection?.trim() || null,
      userReference: dto.userReference?.trim() || null,
      content: dto.content as unknown as Record<string, unknown>,
      appVersion: dto.appVersion ?? null,
      platform: dto.platform ?? null,
    });

    await this.reportsRepository.save(report);

    if (files.length > 0) {
      await this.saveAttachments(reportId, files);
    }

    return this.getById(accessToken, reportId);
  }

  async list(accessToken: string, page = 1, limit = 20): Promise<ContentReportListResponseDto> {
    const user = await this.requireLinkedUser(accessToken);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safePage = Math.max(page, 1);
    const skip = (safePage - 1) * safeLimit;

    const [reports, total] = await this.reportsRepository.findAndCount({
      where: { userId: user.userId },
      order: { createdAt: "DESC" },
      skip,
      take: safeLimit,
    });

    const attachmentCounts = await this.countAttachments(reports.map((r) => r.id));

    return {
      items: reports.map((report) => this.toSummary(report, attachmentCounts.get(report.id) ?? 0)),
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  async getById(accessToken: string, id: string): Promise<ContentReportDetailDto> {
    const user = await this.requireLinkedUser(accessToken);
    const report = await this.reportsRepository.findOne({ where: { id, userId: user.userId } });

    if (!report) {
      throw new NotFoundException("Report not found");
    }

    const attachmentCount = await this.attachmentsRepository.count({ where: { reportId: id } });
    return this.toDetail(report, attachmentCount);
  }

  async adminUpdate(
    adminKey: string | undefined,
    id: string,
    dto: AdminUpdateContentReportDto,
  ): Promise<AdminContentReportDetailDto> {
    this.requireAdminKey(adminKey);

    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException("Report not found");
    }

    if (dto.status !== undefined) {
      if (!CONTENT_REPORT_STATUSES.includes(dto.status)) {
        throw new BadRequestException("Invalid status");
      }
      report.status = dto.status;
    }

    if (dto.adminNotes !== undefined) {
      report.adminNotes = dto.adminNotes.trim() || null;
    }

    if (dto.resolvedAt !== undefined) {
      report.resolvedAt = new Date(dto.resolvedAt);
    } else if (dto.status === "completed" || dto.status === "cancelled" || dto.status === "spam") {
      report.resolvedAt = report.resolvedAt ?? new Date();
    }

    await this.reportsRepository.save(report);

    const attachmentCount = await this.attachmentsRepository.count({ where: { reportId: id } });
    return {
      ...this.toDetail(report, attachmentCount),
      adminNotes: report.adminNotes ?? null,
    };
  }

  private async requireLinkedUser(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const user = await this.authService.getCurrentUser(accessToken);

    if (user.accountType === "guest") {
      throw new ForbiddenException({
        message: "Content reporting requires a linked account",
        code: "GUEST_NOT_ALLOWED",
      });
    }

    return user;
  }

  private requireAdminKey(adminKey: string | undefined): void {
    const expected = this.configService.get("REPORT_ADMIN_KEY", { infer: true });
    if (!expected || !adminKey || adminKey !== expected) {
      throw new UnauthorizedException("Invalid admin key");
    }
  }

  private validateAttachments(files: UploadedAttachment[]): void {
    if (files.length > MAX_ATTACHMENTS) {
      throw new BadRequestException(`At most ${MAX_ATTACHMENTS} attachments allowed`);
    }

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        throw new BadRequestException(`Unsupported attachment type: ${file.mimetype}`);
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        throw new BadRequestException("Attachment exceeds 2 MB limit");
      }
    }
  }

  private async saveAttachments(reportId: string, files: UploadedAttachment[]): Promise<void> {
    const baseDir =
      this.configService.get("REPORT_ATTACHMENTS_DIR", { infer: true }) ?? "./uploads/reports";
    const reportDir = join(baseDir, reportId);
    await mkdir(reportDir, { recursive: true });

    for (const file of files) {
      const attachmentId = randomUUID();
      const ext = extensionForMime(file.mimetype);
      const filename = `${attachmentId}${ext}`;
      const storagePath = join(reportDir, filename);
      await writeFile(storagePath, file.buffer);

      await this.attachmentsRepository.save(
        this.attachmentsRepository.create({
          id: attachmentId,
          reportId,
          mimeType: file.mimetype,
          filename: file.originalname || filename,
          sizeBytes: file.size,
          storagePath,
        }),
      );
    }
  }

  private async countAttachments(reportIds: string[]): Promise<Map<string, number>> {
    const counts = new Map<string, number>();
    if (reportIds.length === 0) return counts;

    const rows = await this.attachmentsRepository
      .createQueryBuilder("a")
      .select("a.reportId", "reportId")
      .addSelect("COUNT(*)", "count")
      .where("a.reportId IN (:...reportIds)", { reportIds })
      .groupBy("a.reportId")
      .getRawMany<{ reportId: string; count: string }>();

    for (const row of rows) {
      counts.set(row.reportId, Number(row.count));
    }
    return counts;
  }

  private toSummary(report: ContentReportEntity, attachmentCount: number) {
    return {
      id: report.id,
      status: report.status as ContentReportStatus,
      issueType: report.issueType as CreateContentReportDto["issueType"],
      description: report.description,
      content: report.content as unknown as ContentReportReference,
      attachmentCount,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      resolvedAt: report.resolvedAt?.toISOString() ?? null,
    };
  }

  private toDetail(report: ContentReportEntity, attachmentCount: number): ContentReportDetailDto {
    return {
      ...this.toSummary(report, attachmentCount),
      suggestedCorrection: report.suggestedCorrection ?? null,
      userReference: report.userReference ?? null,
      appVersion: report.appVersion ?? null,
      platform: report.platform ?? null,
    };
  }
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return ".bin";
  }
}
