import { randomUUID } from "node:crypto";
import { sniffUserMediaMime } from "@munib-tracker/shared/constants/user-media";
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
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { AttachmentStorageService } from "../common/attachment-storage.service";
import { ContentReportAttachmentEntity, ContentReportEntity } from "../database/entities";
import { normalizeUploadFilename } from "../user-media/user-media.service";
import { isContentReportRateLimited } from "./content-report-rate-limit";
import {
  ContentReportDetailDto,
  ContentReportListResponseDto,
  CreateContentReportDto,
} from "./dto/content-report.dto";

const ALLOWED_MIME_TYPES = new Set<string>(["image/jpeg", "image/png", "image/webp"]);
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
    private readonly attachmentStorage: AttachmentStorageService,
  ) {}

  async create(
    accessToken: string,
    dto: CreateContentReportDto,
    files: UploadedAttachment[] = [],
  ): Promise<ContentReportDetailDto> {
    const user = await this.requireLinkedUser(accessToken);

    if (await isContentReportRateLimited(user.userId)) {
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

  private validateAttachments(files: UploadedAttachment[]): void {
    if (files.length > MAX_ATTACHMENTS) {
      throw new BadRequestException(`At most ${MAX_ATTACHMENTS} attachments allowed`);
    }

    for (const file of files) {
      if (file.size > MAX_ATTACHMENT_BYTES || file.buffer.length > MAX_ATTACHMENT_BYTES) {
        throw new BadRequestException("Attachment exceeds 2 MB limit");
      }
      // Magic bytes are authoritative: the multipart Content-Type is client
      // supplied, and these files land in a public bucket the admin console
      // renders — a spoofed "image/png" must not smuggle HTML / SVG / scripts.
      if (!attachmentMime(file)) {
        throw new BadRequestException("Unsupported attachment type. Use JPEG, PNG, or WebP.");
      }
    }
  }

  private async saveAttachments(reportId: string, files: UploadedAttachment[]): Promise<void> {
    for (const file of files) {
      const mimeType = attachmentMime(file);
      if (!mimeType) throw new BadRequestException("Unsupported attachment type");
      const attachmentId = randomUUID();
      const ext = extensionForMime(mimeType);
      const filename = `${attachmentId}${ext}`;
      const { storagePath } = await this.attachmentStorage.save(
        reportId,
        filename,
        file.buffer,
        mimeType,
      );

      await this.attachmentsRepository.save(
        this.attachmentsRepository.create({
          id: attachmentId,
          reportId,
          mimeType,
          // Client-supplied: strip path separators / control chars, cap to the column.
          filename: normalizeUploadFilename(file.originalname, filename),
          sizeBytes: file.buffer.length,
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

/** The sniffed image type of an attachment, or `null` when it isn't an allowed image. */
function attachmentMime(file: Pick<UploadedAttachment, "buffer">): string | null {
  const sniffed = sniffUserMediaMime(file.buffer);
  return sniffed && ALLOWED_MIME_TYPES.has(sniffed) ? sniffed : null;
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
