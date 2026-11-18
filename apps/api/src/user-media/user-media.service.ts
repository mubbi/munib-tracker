import { randomUUID } from "node:crypto";
import {
  sniffUserMediaMime,
  USER_MEDIA_FILE_NAME_MAX,
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

      try {
        const row = await this.mediaRepository.save(
          this.mediaRepository.create({
            id: mediaId,
            userId: user.userId,
            mimeType,
            filename: normalizeUploadFilename(file.originalname, filename),
            sizeBytes: file.buffer.length,
            storagePath,
          }),
        );
        saved.push(this.toDto(row));
      } catch (error) {
        // Never leave an unreferenced blob behind when the row cannot be written.
        await this.attachmentStorage.remove(storagePath, "authenticated");
        throw error;
      }
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
    // Remove the blob first so a DB-only delete cannot leave Cloudinary orphans.
    await this.attachmentStorage.remove(media.storagePath, "authenticated");
    await this.mediaRepository.delete({ id: media.id });
  }

  async removeMany(accessToken: string, ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const user = await this.requireLinkedUser(accessToken);
    const uniqueIds = [...new Set(ids)];
    const rows = await this.mediaRepository.find({
      where: { userId: user.userId, id: In(uniqueIds) },
    });
    if (rows.length === 0) return;

    await Promise.all(
      rows.map((row) => this.attachmentStorage.remove(row.storagePath, "authenticated")),
    );
    await this.mediaRepository.delete({ id: In(rows.map((row) => row.id)) });
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
    const sniffed = sniffUserMediaMime(file.buffer);
    if (!sniffed) {
      throw new BadRequestException("Unsupported attachment type. Use JPEG, PNG, WebP, or PDF.");
    }
    // Magic bytes are authoritative; picker / client MIME metadata is often wrong.
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

/**
 * Clean the client-supplied multipart filename for storage / display.
 *
 * - Multer (busboy) decodes header parameters as latin1, so UTF-8 names
 *   (Arabic, Urdu, …) arrive as mojibake — re-decode when the bytes are valid UTF-8.
 * - Expo's native `fetch` percent-encodes the filename parameter.
 * - Strip path separators / control characters and cap to the column width.
 */
export function normalizeUploadFilename(
  originalname: string | undefined,
  fallback: string,
): string {
  let name = originalname ?? "";

  const isLatin1 = [...name].every((char) => (char.codePointAt(0) ?? 0) <= 0xff);
  if (name && isLatin1) {
    const decoded = Buffer.from(name, "latin1").toString("utf8");
    if (!decoded.includes(String.fromCodePoint(0xfffd))) name = decoded;
  }

  if (/%[0-9a-f]{2}/i.test(name)) {
    try {
      name = decodeURIComponent(name);
    } catch {
      // Not percent-encoded after all — keep the literal name.
    }
  }

  name = name
    // biome-ignore lint/suspicious/noControlCharactersInRegex: stripping control characters is the point
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
    .replace(/[/\\]/g, "_")
    .trim();

  if (!name) return fallback;
  // Slice by code point so a surrogate pair is never split (Postgres counts characters).
  return Array.from(name).slice(0, USER_MEDIA_FILE_NAME_MAX).join("");
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
