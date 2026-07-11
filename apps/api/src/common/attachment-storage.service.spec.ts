import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const uploadStreamMock = vi.fn();
const destroyMock = vi.fn();
const configMock = vi.fn();

vi.mock("cloudinary", () => ({
  v2: {
    config: (...args: unknown[]) => configMock(...args),
    uploader: {
      upload_stream: (...args: unknown[]) => uploadStreamMock(...args),
      destroy: (...args: unknown[]) => destroyMock(...args),
    },
  },
}));

import type { ConfigService } from "@nestjs/config";
import type { EnvironmentVariables } from "../config/env.schema";
import { AttachmentStorageService } from "./attachment-storage.service";

function makeConfig(env: Partial<EnvironmentVariables> = {}) {
  return {
    get: (key: keyof EnvironmentVariables) => env[key],
  } as unknown as ConfigService<EnvironmentVariables, true>;
}

describe("AttachmentStorageService (Cloudinary)", () => {
  beforeEach(() => {
    uploadStreamMock.mockReset();
    destroyMock.mockReset();
    configMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("configures Cloudinary when credentials are present", () => {
    new AttachmentStorageService(
      makeConfig({
        CLOUDINARY_CLOUD_NAME: "demo",
        CLOUDINARY_API_KEY: "key",
        CLOUDINARY_API_SECRET: "secret",
      }),
    );

    expect(configMock).toHaveBeenCalledWith({
      cloud_name: "demo",
      api_key: "key",
      api_secret: "secret",
      secure: true,
    });
  });

  it("uploads via Cloudinary and stores cloudinary:{public_id}", async () => {
    uploadStreamMock.mockImplementation((_options, callback) => {
      queueMicrotask(() => callback(undefined, { public_id: "munib-tracker/reports/r1/file-id" }));
      return { end: (buf: Buffer) => expect(buf.length).toBeGreaterThan(0) };
    });

    const service = new AttachmentStorageService(
      makeConfig({
        CLOUDINARY_CLOUD_NAME: "demo",
        CLOUDINARY_API_KEY: "key",
        CLOUDINARY_API_SECRET: "secret",
        CLOUDINARY_FOLDER: "munib-tracker/reports",
      }),
    );

    const stored = await service.save("r1", "file-id.jpg", Buffer.from("fake-image"), "image/jpeg");

    expect(stored.storagePath).toBe("cloudinary:munib-tracker/reports/r1/file-id");
    expect(uploadStreamMock).toHaveBeenCalledWith(
      expect.objectContaining({
        folder: "munib-tracker/reports/r1",
        public_id: "file-id",
        resource_type: "image",
        format: "jpg",
      }),
      expect.any(Function),
    );
  });

  it("destroys Cloudinary assets on remove", async () => {
    destroyMock.mockResolvedValue({ result: "ok" });

    const service = new AttachmentStorageService(
      makeConfig({
        CLOUDINARY_CLOUD_NAME: "demo",
        CLOUDINARY_API_KEY: "key",
        CLOUDINARY_API_SECRET: "secret",
      }),
    );

    await service.remove("cloudinary:munib-tracker/reports/r1/file-id");

    expect(destroyMock).toHaveBeenCalledWith("munib-tracker/reports/r1/file-id", {
      resource_type: "image",
      invalidate: true,
    });
  });

  it("falls back to disk when Cloudinary is not configured", async () => {
    const service = new AttachmentStorageService(
      makeConfig({ REPORT_ATTACHMENTS_DIR: "./uploads/test-reports" }),
    );

    expect(service.isObjectStorageEnabled()).toBe(false);

    const stored = await service.save("r2", "a.png", Buffer.from("png"), "image/png");
    expect(stored.storagePath.replace(/\\/g, "/")).toContain("uploads/test-reports/r2/a.png");

    await service.remove(stored.storagePath);
  });
});
