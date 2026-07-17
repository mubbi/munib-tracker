import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { EnvironmentVariables } from "../config/env.schema";

export type StoredAttachment = {
  /**
   * Disk path, or `cloudinary:{public_id}` / `cloudinary:raw:{public_id}` when
   * Cloudinary is configured. Public id is enough to destroy the asset later.
   */
  storagePath: string;
};

export type CloudinaryDeliveryType = "upload" | "authenticated";
export type CloudinaryResourceType = "image" | "raw";

const CLOUDINARY_PREFIX = "cloudinary:";
const CLOUDINARY_RAW_PREFIX = "cloudinary:raw:";

/**
 * Attachment storage for report evidence and private user media. Uses local disk
 * by default; when Cloudinary credentials are set, uploads via the official SDK
 * so serverless cold starts do not lose files.
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

  /** Content-report attachments (default public `upload` delivery). */
  async save(
    reportId: string,
    filename: string,
    body: Buffer,
    contentType: string,
  ): Promise<StoredAttachment> {
    return this.saveAttachment({
      folderRoot: this.reportsFolderRoot(),
      folderSegment: reportId,
      filename,
      body,
      contentType,
      deliveryType: "upload",
      resourceType: "image",
      diskBaseDir: this.env("REPORT_ATTACHMENTS_DIR") ?? "./uploads/reports",
    });
  }

  /**
   * Private custom-adhkar attachments. Cloudinary uses `authenticated` delivery
   * so assets are not world-readable without a signed URL (or our auth proxy).
   * PDFs are stored as `raw` resources.
   */
  async saveUserMedia(
    userId: string,
    filename: string,
    body: Buffer,
    contentType: string,
  ): Promise<StoredAttachment> {
    return this.saveAttachment({
      folderRoot: this.userMediaFolderRoot(),
      folderSegment: userId,
      filename,
      body,
      contentType,
      deliveryType: "authenticated",
      resourceType: contentType === "application/pdf" ? "raw" : "image",
      diskBaseDir: this.env("USER_MEDIA_DIR") ?? "./uploads/user-media",
    });
  }

  async read(
    storagePath: string,
    deliveryType: CloudinaryDeliveryType = "upload",
  ): Promise<Buffer> {
    if (storagePath.startsWith(CLOUDINARY_PREFIX)) {
      const { publicId, resourceType } = parseCloudinaryPath(storagePath);
      if (!publicId || !this.cloudinaryConfigured) {
        throw new Error("Cloudinary asset is not available");
      }
      const url = cloudinary.url(publicId, {
        resource_type: resourceType,
        type: deliveryType,
        sign_url: deliveryType === "authenticated",
        secure: true,
      });
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch Cloudinary asset (${response.status})`);
      }
      return Buffer.from(await response.arrayBuffer());
    }

    return readFile(storagePath);
  }

  async remove(
    storagePath: string,
    deliveryType: CloudinaryDeliveryType = "upload",
  ): Promise<void> {
    if (
      storagePath.startsWith(CLOUDINARY_PREFIX) ||
      storagePath.startsWith(CLOUDINARY_RAW_PREFIX)
    ) {
      const { publicId, resourceType } = parseCloudinaryPath(storagePath);
      if (!publicId || !this.cloudinaryConfigured) return;
      try {
        const result = (await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
          type: deliveryType,
          invalidate: true,
        })) as { result?: string };
        if (result?.result && result.result !== "ok" && result.result !== "not found") {
          this.logger.warn(
            `Cloudinary destroy for ${publicId} returned unexpected result: ${result.result}`,
          );
        }
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

  private reportsFolderRoot(): string {
    const folder = this.env("CLOUDINARY_FOLDER")?.trim();
    return folder && folder.length > 0 ? folder.replace(/\/+$/, "") : "munib-tracker/reports";
  }

  private userMediaFolderRoot(): string {
    const folder = this.env("CLOUDINARY_USER_MEDIA_FOLDER")?.trim();
    return folder && folder.length > 0 ? folder.replace(/\/+$/, "") : "munib-tracker/custom-adhkar";
  }

  private async saveAttachment(options: {
    folderRoot: string;
    folderSegment: string;
    filename: string;
    body: Buffer;
    contentType: string;
    deliveryType: CloudinaryDeliveryType;
    resourceType: CloudinaryResourceType;
    diskBaseDir: string;
  }): Promise<StoredAttachment> {
    if (this.isObjectStorageEnabled()) {
      const publicId = await this.uploadToCloudinary(options);
      const prefix = options.resourceType === "raw" ? CLOUDINARY_RAW_PREFIX : CLOUDINARY_PREFIX;
      return { storagePath: `${prefix}${publicId}` };
    }

    const dir = join(options.diskBaseDir, options.folderSegment);
    await mkdir(dir, { recursive: true });
    const storagePath = join(dir, options.filename);
    await writeFile(storagePath, options.body);
    return { storagePath };
  }

  private async uploadToCloudinary(options: {
    folderRoot: string;
    folderSegment: string;
    filename: string;
    body: Buffer;
    contentType: string;
    deliveryType: CloudinaryDeliveryType;
    resourceType: CloudinaryResourceType;
  }): Promise<string> {
    const stem = options.filename.replace(/\.[^.]+$/, "") || options.filename;
    const assetFolder = `${options.folderRoot}/${options.folderSegment}`;

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          asset_folder: assetFolder,
          public_id: stem,
          use_asset_folder_as_public_id_prefix: true,
          resource_type: options.resourceType,
          type: options.deliveryType,
          overwrite: true,
          unique_filename: false,
          use_filename: false,
          format:
            options.resourceType === "raw" ? undefined : extensionFromMime(options.contentType),
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload returned no result"));
            return;
          }
          resolve(uploadResult);
        },
      );
      stream.end(options.body);
    });

    if (!result.public_id) {
      throw new Error("Cloudinary upload missing public_id");
    }
    return result.public_id;
  }
}

function parseCloudinaryPath(storagePath: string): {
  publicId: string;
  resourceType: CloudinaryResourceType;
} {
  if (storagePath.startsWith(CLOUDINARY_RAW_PREFIX)) {
    return {
      publicId: storagePath.slice(CLOUDINARY_RAW_PREFIX.length),
      resourceType: "raw",
    };
  }
  return {
    publicId: storagePath.slice(CLOUDINARY_PREFIX.length),
    resourceType: "image",
  };
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
