import { randomUUID } from "node:crypto";
import {
  normalizeUserMediaMime,
  sniffUserMediaMime,
  USER_MEDIA_MAX_BYTES,
  USER_MEDIA_MAX_PER_ENTITY,
} from "@munib-tracker/shared/constants/user-media";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { AttachmentStorageService } from "../common/attachment-storage.service";
import { UserMediaEntity } from "../database/entities";
import { UserMediaDto } from "./dto/user-media.dto";

export const USER_MEDIA_MAX_BYTES_LIMIT = USER_MEDIA_MAX_BYTES;
export const USER_MEDIA_MAX_FILES = USER_MEDIA_MAX_PER_ENTITY;

export type UploadedUserMedia = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

@Injectable()
export class UserMediaService {
  constructor(
    @InjectRepository(UserMediaEntity)
    private readonly mediaRepository: Repository<UserMediaEntity>,
    private readonly authService: AuthService,
    private readonly attachmentStorage: AttachmentStorageService,
  ) {}

  async upload(accessToken: string, files: UploadedUserMedia[]): Promise<UserMediaDto[]> {
    const user = await this.requireLinkedUser(accessToken);
    this.validateFiles(files);

    const saved: UserMediaDto[] = [];
    for (const file of files) {
      const mimeType = this.resolveAndSniffMime(file);
      const mediaId = randomUUID();
      const ext = extensionForMime(mimeType);
      const filename = `${mediaId}${ext}`;
      const { storagePath } = await this.attachmentStorage.saveUserMedia(
        user.userId,
        filename,
        file.buffer,
        mimeType,
      );

      const row = await this.mediaRepository.save(
        this.mediaRepository.create({
          id: mediaId,
          userId: user.userId,
          mimeType,
          filename: file.originalname || filename,
          sizeBytes: file.buffer.length,
          storagePath,
        }),
      );
      saved.push(this.toDto(row));
    }

    return saved;
  }

  async getOwned(accessToken: string, id: string): Promise<UserMediaEntity> {
    const user = await this.requireLinkedUser(accessToken);
    const media = await this.mediaRepository.findOne({ where: { id, userId: user.userId } });
    if (!media) {
      throw new NotFoundException("Media not found");
    }
    return media;
  }

  async getMeta(accessToken: string, id: string): Promise<UserMediaDto> {
    return this.toDto(await this.getOwned(accessToken, id));
  }

  async getContent(
    accessToken: string,
    id: string,
  ): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
    const media = await this.getOwned(accessToken, id);
    const buffer = await this.attachmentStorage.read(media.storagePath, "authenticated");
    return { buffer, mimeType: media.mimeType, filename: media.filename };
  }

  async remove(accessToken: string, id: string): Promise<void> {
    const media = await this.getOwned(accessToken, id);
    await this.mediaRepository.delete({ id: media.id });
    await this.attachmentStorage.remove(media.storagePath);
  }

  async removeMany(accessToken: string, ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const user = await this.requireLinkedUser(accessToken);
    const uniqueIds = [...new Set(ids)];
    const rows = await this.mediaRepository.find({
      where: { userId: user.userId, id: In(uniqueIds) },
    });
    if (rows.length === 0) return;

    await this.mediaRepository.delete({ id: In(rows.map((row) => row.id)) });
    await Promise.all(rows.map((row) => this.attachmentStorage.remove(row.storagePath)));
  }

  private async requireLinkedUser(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const user = await this.authService.getCurrentUser(accessToken);
    if (user.accountType === "guest") {
      throw new ForbiddenException({
        message: "Custom adhkar attachments require a linked account",
        code: "GUEST_NOT_ALLOWED",
      });
    }
    return user;
  }

  private validateFiles(files: UploadedUserMedia[]): void {
    if (files.length === 0) {
      throw new BadRequestException("At least one attachment is required");
    }
    if (files.length > USER_MEDIA_MAX_FILES) {
      throw new BadRequestException(`At most ${USER_MEDIA_MAX_FILES} attachments allowed`);
    }

    for (const file of files) {
      if (file.size > USER_MEDIA_MAX_BYTES || file.buffer.length > USER_MEDIA_MAX_BYTES) {
        throw new BadRequestException("Each attachment must be 1 MB or smaller");
      }
    }
  }

  private resolveAndSniffMime(file: UploadedUserMedia): string {
    const declared =
      normalizeUserMediaMime(file.mimetype) ??
      normalizeUserMediaMime(extensionMimeFromName(file.originalname) ?? "");
    const sniffed = sniffUserMediaMime(file.buffer);
    if (!sniffed) {
      throw new BadRequestException("Unsupported attachment type. Use JPEG, PNG, WebP, or PDF.");
    }
    // Prefer sniffed bytes; reject when the client declared a different allowed type.
    if (declared && declared !== sniffed) {
      throw new BadRequestException("Unsupported attachment type. Use JPEG, PNG, WebP, or PDF.");
    }
    return sniffed;
  }

  private toDto(row: UserMediaEntity): UserMediaDto {
    const prefix = this.apiPrefix();
    return {
      id: row.id,
      mimeType: row.mimeType,
      filename: row.filename,
      sizeBytes: row.sizeBytes,
      contentPath: `${prefix}/user-media/${row.id}/content`,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private apiPrefix(): string {
    return "/api/v1";
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
    case "application/pdf":
      return ".pdf";
    default:
      return ".bin";
  }
}

function extensionMimeFromName(name: string): string | undefined {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "pdf":
      return "application/pdf";
    default:
      return undefined;
  }
}
