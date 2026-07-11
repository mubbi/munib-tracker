import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { EnvironmentVariables } from "../config/env.schema";

export type StoredAttachment = {
  /**
   * Disk path, or `cloudinary:{public_id}` when Cloudinary is configured.
   * Public id is enough to destroy the asset later.
   */
  storagePath: string;
};

const CLOUDINARY_PREFIX = "cloudinary:";

/**
 * Content-report attachment storage. Uses local disk by default; when
 * Cloudinary credentials are set, uploads via the official SDK so serverless
 * cold starts do not lose files.
 */
@Injectable()
export class AttachmentStorageService {
  private readonly logger = new Logger(AttachmentStorageService.name);
  private cloudinaryConfigured = false;

  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {
    this.configureCloudinary();
  }

  private env<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] | undefined {
    return this.configService.get(key, { infer: true });
  }

  private configureCloudinary(): void {
    const cloudName = this.env("CLOUDINARY_CLOUD_NAME")?.trim();
    const apiKey = this.env("CLOUDINARY_API_KEY")?.trim();
    const apiSecret = this.env("CLOUDINARY_API_SECRET")?.trim();
    if (!cloudName || !apiKey || !apiSecret) {
      this.cloudinaryConfigured = false;
      return;
    }
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    this.cloudinaryConfigured = true;
  }

  isObjectStorageEnabled(): boolean {
    return this.cloudinaryConfigured;
  }

  async save(
    reportId: string,
    filename: string,
    body: Buffer,
    contentType: string,
  ): Promise<StoredAttachment> {
    if (this.isObjectStorageEnabled()) {
      const publicId = await this.uploadToCloudinary(reportId, filename, body, contentType);
      return { storagePath: `${CLOUDINARY_PREFIX}${publicId}` };
    }

    const baseDir = this.env("REPORT_ATTACHMENTS_DIR") ?? "./uploads/reports";
    const reportDir = join(baseDir, reportId);
    await mkdir(reportDir, { recursive: true });
    const storagePath = join(reportDir, filename);
    await writeFile(storagePath, body);
    return { storagePath };
  }

  async remove(storagePath: string): Promise<void> {
    if (storagePath.startsWith(CLOUDINARY_PREFIX)) {
      const publicId = storagePath.slice(CLOUDINARY_PREFIX.length);
      if (!publicId || !this.cloudinaryConfigured) return;
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
      } catch (error) {
        this.logger.warn(
          `Failed to delete Cloudinary asset ${publicId}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
      return;
    }
    await rm(storagePath, { force: true }).catch(() => undefined);
  }

  private folderRoot(): string {
    const folder = this.env("CLOUDINARY_FOLDER")?.trim();
    return folder && folder.length > 0 ? folder.replace(/\/+$/, "") : "munib-tracker/reports";
  }

  private async uploadToCloudinary(
    reportId: string,
    filename: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    const stem = filename.replace(/\.[^.]+$/, "") || filename;
    const folder = `${this.folderRoot()}/${reportId}`;

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: stem,
          resource_type: "image",
          overwrite: true,
          unique_filename: false,
          use_filename: false,
          // Preserve original format (jpeg/png/webp) for report evidence.
          format: extensionFromMime(contentType),
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload returned no result"));
            return;
          }
          resolve(uploadResult);
        },
      );
      stream.end(body);
    });

    if (!result.public_id) {
      throw new Error("Cloudinary upload missing public_id");
    }
    return result.public_id;
  }
}

function extensionFromMime(mime: string): string | undefined {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return undefined;
  }
}
