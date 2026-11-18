import { mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { stubFetch } from "../test-support/fetch";
import { AttachmentStorageService } from "./attachment-storage.service";

const uploadStream = vi.fn();
const destroy = vi.fn();
const configure = vi.fn();
const cloudinaryUrl = vi.fn();

vi.mock("cloudinary", () => ({
  v2: {
    config: (...args: unknown[]) => configure(...args),
    url: (...args: unknown[]) => cloudinaryUrl(...args),
    uploader: {
      upload_stream: (...args: unknown[]) => uploadStream(...args),
      destroy: (...args: unknown[]) => destroy(...args),
    },
  },
}));

const CLOUD_ENV = {
  CLOUDINARY_CLOUD_NAME: " demo ",
  CLOUDINARY_API_KEY: "key",
  CLOUDINARY_API_SECRET: "secret",
} satisfies Partial<EnvironmentVariables>;

/** Service over a config map; pass `cloud: false` for the disk backend. */
function setup(env: Partial<EnvironmentVariables> = {}, { cloud = true } = {}) {
  const values: Partial<EnvironmentVariables> = { ...(cloud ? CLOUD_ENV : {}), ...env };
  const config = {
    get: (key: keyof EnvironmentVariables) => values[key],
  } as unknown as ConfigService<EnvironmentVariables, true>;
  return new AttachmentStorageService(config);
}

/** Makes the next `upload_stream` call back with `(error, result)`. */
function uploadCallsBack(result: unknown, error?: unknown) {
  uploadStream.mockImplementationOnce((_options, callback) => {
    queueMicrotask(() => callback(error, result));
    return { end: vi.fn() };
  });
}

const uploadOptions = () => uploadStream.mock.calls[0]?.[0];

async function withTempDir(run: (dir: string) => Promise<void>) {
  const dir = await mkdtemp(join(tmpdir(), "munib-attach-"));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("AttachmentStorageService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("configuration", () => {
    it("configures Cloudinary with trimmed credentials", () => {
      setup();
      expect(configure).toHaveBeenCalledWith({
        cloud_name: "demo",
        api_key: "key",
        api_secret: "secret",
        secure: true,
      });
    });

    it.each([
      ["no credentials", {}],
      ["a blank API key", { CLOUDINARY_CLOUD_NAME: "demo", CLOUDINARY_API_KEY: "  " }],
    ])("stays on disk with %s", (_label, env) => {
      const service = setup(env, { cloud: false });
      expect(service.isObjectStorageEnabled()).toBe(false);
      expect(configure).not.toHaveBeenCalled();
    });
  });

  describe("Cloudinary uploads", () => {
    it("stores report attachments as cloudinary:{public_id}", async () => {
      uploadCallsBack({ public_id: "munib-tracker/reports/r1/file-id" });
      const stored = await setup().save("r1", "file-id.jpg", Buffer.from("img"), "image/jpeg");
      expect(stored.storagePath).toBe("cloudinary:munib-tracker/reports/r1/file-id");
    });

    it("uploads report attachments as public images in the report folder", async () => {
      uploadCallsBack({ public_id: "x" });
      await setup().save("r1", "file-id.jpg", Buffer.from("img"), "image/jpeg");
      expect(uploadOptions()).toMatchObject({
        asset_folder: "munib-tracker/reports/r1",
        public_id: "file-id",
        use_asset_folder_as_public_id_prefix: true,
        resource_type: "image",
        type: "upload",
        format: "jpg",
      });
    });

    it.each([
      ["CLOUDINARY_FOLDER", "custom/reports///", "save", "custom/reports/r1"],
      ["CLOUDINARY_USER_MEDIA_FOLDER", "media/", "saveUserMedia", "media/r1"],
    ] as const)("%s=%j trims trailing slashes", async (key, folder, method, expected) => {
      uploadCallsBack({ public_id: "x" });
      await setup({ [key]: folder })[method]("r1", "f.png", Buffer.from("a"), "image/png");
      expect(uploadOptions()).toMatchObject({ asset_folder: expected });
    });

    it.each([
      ["image/png", "png"],
      ["image/webp", "webp"],
      ["image/gif", undefined],
    ])("maps %s to format %s", async (mime, format) => {
      uploadCallsBack({ public_id: "x" });
      await setup().save("r1", "f.bin", Buffer.from("a"), mime);
      expect(uploadOptions()).toMatchObject({ format });
    });

    it("keeps the full filename as public id when it has no stem", async () => {
      uploadCallsBack({ public_id: "x" });
      await setup().save("r1", ".gif", Buffer.from("a"), "image/gif");
      expect(uploadOptions()).toMatchObject({ public_id: ".gif" });
    });

    it("uploads user media as authenticated assets in the default folder", async () => {
      uploadCallsBack({ public_id: "munib-tracker/custom-adhkar/u1/media-id" });
      const stored = await setup().saveUserMedia(
        "u1",
        "media-id.jpg",
        Buffer.from("i"),
        "image/jpeg",
      );
      expect(stored.storagePath).toBe("cloudinary:munib-tracker/custom-adhkar/u1/media-id");
      expect(uploadOptions()).toMatchObject({
        asset_folder: "munib-tracker/custom-adhkar/u1",
        type: "authenticated",
      });
    });

    it("stores user-media PDFs as raw resources without a format", async () => {
      uploadCallsBack({ public_id: "media/u1/doc" });
      const stored = await setup().saveUserMedia(
        "u1",
        "doc.pdf",
        Buffer.from("%PDF"),
        "application/pdf",
      );
      expect(stored.storagePath).toBe("cloudinary:raw:media/u1/doc");
      expect(uploadOptions()).toMatchObject({ resource_type: "raw", format: undefined });
    });

    it.each([
      ["the upload errors", undefined, new Error("upload failed"), "upload failed"],
      ["no result comes back", undefined, undefined, "Cloudinary upload returned no result"],
      ["the result lacks a public id", { public_id: "" }, undefined, "missing public_id"],
    ])("rejects when %s", async (_label, result, error, message) => {
      uploadCallsBack(result, error);
      await expect(setup().save("r", "a.jpg", Buffer.from("a"), "image/jpeg")).rejects.toThrow(
        message,
      );
    });
  });

  describe("disk storage", () => {
    it("writes report attachments under REPORT_ATTACHMENTS_DIR", async () => {
      await withTempDir(async (dir) => {
        const service = setup({ REPORT_ATTACHMENTS_DIR: dir }, { cloud: false });
        const stored = await service.save("r2", "a.png", Buffer.from("png"), "image/png");
        expect(stored.storagePath).toBe(join(dir, "r2", "a.png"));
      });
    });

    it("reads disk paths directly", async () => {
      await withTempDir(async (dir) => {
        const file = join(dir, "x.bin");
        await writeFile(file, "disk-bytes");
        const buf = await setup({}, { cloud: false }).read(file);
        expect(buf.toString()).toBe("disk-bytes");
      });
    });

    it("removes disk files written under USER_MEDIA_DIR", async () => {
      await withTempDir(async (dir) => {
        const service = setup({ USER_MEDIA_DIR: dir }, { cloud: false });
        const stored = await service.saveUserMedia("u1", "a.png", Buffer.from("x"), "image/png");
        await service.remove(stored.storagePath);
        await expect(stat(stored.storagePath)).rejects.toThrow();
      });
    });

    it("ignores missing disk files on remove", async () => {
      await expect(
        setup({}, { cloud: false }).remove(join(tmpdir(), "munib-missing-file.png")),
      ).resolves.toBeUndefined();
    });
  });

  describe("Cloudinary reads", () => {
    it.each([
      ["authenticated raw", "cloudinary:raw:media/u1/doc", "authenticated", "raw", true],
      ["public image", "cloudinary:reports/r1/a", undefined, "image", false],
    ] as const)("builds a %s delivery URL", async (_l, path, delivery, resourceType, signed) => {
      cloudinaryUrl.mockReturnValue("https://res.cloudinary.test/asset");
      stubFetch(() => new Response("bytes"));
      await setup().read(path, delivery);
      expect(cloudinaryUrl).toHaveBeenCalledWith(path.replace(/^cloudinary:(raw:)?/, ""), {
        resource_type: resourceType,
        type: delivery ?? "upload",
        sign_url: signed,
        secure: true,
      });
    });

    it("returns the fetched bytes", async () => {
      cloudinaryUrl.mockReturnValue("https://res.cloudinary.test/asset");
      const fetchMock = stubFetch(() => new Response("bytes"));
      const buf = await setup().read("cloudinary:reports/r1/a");
      expect(buf.toString()).toBe("bytes");
      expect(fetchMock).toHaveBeenCalledWith("https://res.cloudinary.test/asset");
    });

    it("throws when the fetch fails", async () => {
      stubFetch(() => new Response("nope", { status: 404 }));
      await expect(setup().read("cloudinary:reports/r1/a")).rejects.toThrow(
        "Failed to fetch Cloudinary asset (404)",
      );
    });

    it.each([
      ["the public id is empty", "cloudinary:", true],
      ["Cloudinary is not configured", "cloudinary:reports/a", false],
    ])("throws without fetching when %s", async (_label, path, cloud) => {
      const fetchMock = stubFetch();
      await expect(setup({}, { cloud }).read(path)).rejects.toThrow(
        "Cloudinary asset is not available",
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("Cloudinary removes", () => {
    beforeEach(() => {
      vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    });

    it.each([
      ["a public image", "cloudinary:reports/r1/f", undefined, "reports/r1/f", "image", "upload"],
      [
        "an authenticated image",
        "cloudinary:media/u1/m",
        "authenticated",
        "media/u1/m",
        "image",
        "authenticated",
      ],
      [
        "an authenticated raw file",
        "cloudinary:raw:media/u1/doc",
        "authenticated",
        "media/u1/doc",
        "raw",
        "authenticated",
      ],
    ] as const)("destroys %s", async (_l, path, delivery, publicId, resourceType, type) => {
      destroy.mockResolvedValue({ result: "ok" });
      await setup().remove(path, delivery);
      expect(destroy).toHaveBeenCalledWith(publicId, {
        resource_type: resourceType,
        type,
        invalidate: true,
      });
    });

    it.each([{ result: "ok" }, { result: "not found" }, undefined])(
      "does not warn for destroy result %j",
      async (result) => {
        destroy.mockResolvedValue(result);
        await setup().remove("cloudinary:reports/a");
        expect(Logger.prototype.warn).not.toHaveBeenCalled();
      },
    );

    it("warns on an unexpected destroy result", async () => {
      destroy.mockResolvedValue({ result: "error" });
      await setup().remove("cloudinary:reports/a");
      expect(Logger.prototype.warn).toHaveBeenCalledWith(
        "Cloudinary destroy for reports/a returned unexpected result: error",
      );
    });

    it.each([
      [new Error("api down"), "api down"],
      ["raw-fail", "raw-fail"],
    ])("logs destroy failure %s without throwing", async (error, message) => {
      destroy.mockRejectedValue(error);
      await expect(setup().remove("cloudinary:reports/a")).resolves.toBeUndefined();
      expect(Logger.prototype.warn).toHaveBeenCalledWith(
        `Failed to delete Cloudinary asset reports/a: ${message}`,
      );
    });

    it.each([
      ["Cloudinary is not configured", "cloudinary:reports/a", false],
      ["the public id is empty", "cloudinary:", true],
    ])("skips the destroy when %s", async (_label, path, cloud) => {
      await setup({}, { cloud }).remove(path);
      expect(destroy).not.toHaveBeenCalled();
    });
  });
});
