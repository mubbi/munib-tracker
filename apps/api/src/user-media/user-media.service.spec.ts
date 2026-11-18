import { BadRequestException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import type { UserMediaEntity } from "../database/entities";
import { buildMockAuthService } from "../test-support/auth";
import { buildAuthUser } from "../test-support/fixtures/user";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import {
  buildMockAttachmentStorage,
  buildUpload,
  JPEG_BYTES,
  PDF_BYTES,
  PNG_BYTES,
  WEBP_BYTES,
} from "../test-support/uploads";
import { normalizeUploadFilename, UserMediaService } from "./user-media.service";

const CREATED_AT = new Date("2026-01-01T00:00:00.000Z");
const ONE_MIB = 1024 * 1024;

function buildMediaRow(overrides: Partial<UserMediaEntity> = {}): UserMediaEntity {
  return {
    id: "m1",
    userId: "user-1",
    mimeType: "image/png",
    filename: "a.png",
    sizeBytes: 10,
    storagePath: "/disk/a.png",
    createdAt: CREATED_AT,
    ...overrides,
  } as UserMediaEntity;
}

function setup(user = buildAuthUser()) {
  const repo = buildMockRepository({
    save: vi.fn(async (row: object) => ({ ...row, createdAt: CREATED_AT })),
  });
  const auth = buildMockAuthService(user);
  const storage = buildMockAttachmentStorage();
  const service = new UserMediaService(
    asRepository<UserMediaEntity>(repo),
    auth.asService(),
    storage.asService(),
  );
  return { repo, auth, storage, service };
}

describe("UserMediaService", () => {
  describe("access", () => {
    it("rejects a missing token before resolving the user", async () => {
      const { auth, service } = setup();
      await expect(service.getMeta("", "m1")).rejects.toThrow("Missing bearer token");
      expect(auth.getCurrentUser).not.toHaveBeenCalled();
    });

    it("rejects guests", async () => {
      const { service } = setup(buildAuthUser({ accountType: "guest" }));
      await expect(service.upload("tok", [buildUpload()])).rejects.toMatchObject({
        response: { code: "GUEST_NOT_ALLOWED" },
      });
    });

    it("hides media owned by someone else", async () => {
      const { repo, service } = setup();
      await expect(service.getContent("tok", "missing")).rejects.toThrow("Media not found");
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: "missing", userId: "user-1" } });
    });
  });

  describe("upload validation", () => {
    it.each([
      ["no files", [], "At least one attachment is required"],
      ["six files", Array.from({ length: 6 }, () => buildUpload()), "At most 5 attachments"],
      ["a declared size over 1 MB", [buildUpload({ size: ONE_MIB + 1 })], "1 MB"],
      [
        "a buffer over 1 MB with a small declared size",
        [buildUpload({ buffer: Buffer.alloc(ONE_MIB + 1), size: 1 })],
        "1 MB",
      ],
      [
        "unsupported bytes",
        [buildUpload({ buffer: Buffer.from("GIF89a-not-allowed") })],
        "Unsupported attachment type",
      ],
    ])("rejects %s", async (_label, files, message) => {
      const { storage, service } = setup();
      const error = await service.upload("tok", files).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as Error).message).toContain(message);
      expect(storage.saveUserMedia).not.toHaveBeenCalled();
    });
  });

  describe("upload", () => {
    it.each([
      ["JPEG", JPEG_BYTES, "image/jpeg", ".jpg"],
      ["PNG", PNG_BYTES, "image/png", ".png"],
      ["WebP", WEBP_BYTES, "image/webp", ".webp"],
      ["PDF", PDF_BYTES, "application/pdf", ".pdf"],
    ])(
      "stores %s under the user with a sniffed MIME and extension",
      async (_l, bytes, mime, ext) => {
        const { storage, service } = setup();
        await service.upload("tok", [buildUpload({ buffer: bytes, mimetype: "image/png" })]);
        expect(storage.saveUserMedia).toHaveBeenCalledWith(
          "user-1",
          expect.stringMatching(new RegExp(`\\${ext}$`)),
          bytes,
          mime,
        );
      },
    );

    it("trusts sniffed bytes over the picker MIME", async () => {
      const { service } = setup();
      const [item] = await service.upload("tok", [
        buildUpload({ buffer: JPEG_BYTES, mimetype: "image/png" }),
      ]);
      expect(item?.mimeType).toBe("image/jpeg");
    });

    it("returns a DTO with an authenticated content path", async () => {
      const { service } = setup();
      const [item] = await service.upload("tok", [buildUpload({ originalname: "zikr.png" })]);
      expect(item).toEqual({
        id: expect.any(String),
        mimeType: "image/png",
        filename: "zikr.png",
        sizeBytes: PNG_BYTES.length,
        contentPath: `/api/v1/user-media/${item?.id}/content`,
        createdAt: CREATED_AT.toISOString(),
      });
    });

    it("falls back to the generated filename when none is supplied", async () => {
      const { storage, service } = setup();
      const [item] = await service.upload("tok", [
        buildUpload({ originalname: undefined as unknown as string }),
      ]);
      expect(item?.filename).toBe(storage.saveUserMedia.mock.calls[0]?.[1]);
    });

    it("removes the stored blob when the DB write fails", async () => {
      const { repo, storage, service } = setup();
      repo.save.mockRejectedValueOnce(new Error("db write failed"));

      await expect(service.upload("tok", [buildUpload()])).rejects.toThrow("db write failed");
      expect(storage.remove).toHaveBeenCalledWith(
        expect.stringMatching(/^\/disk\/user-1\//),
        "authenticated",
      );
    });
  });

  describe("reads", () => {
    it("returns metadata for owned media", async () => {
      const { repo, service } = setup();
      repo.findOne.mockResolvedValue(buildMediaRow());
      await expect(service.getMeta("tok", "m1")).resolves.toMatchObject({
        id: "m1",
        contentPath: "/api/v1/user-media/m1/content",
        createdAt: CREATED_AT.toISOString(),
      });
    });

    it("reads content through authenticated storage", async () => {
      const { repo, storage, service } = setup();
      repo.findOne.mockResolvedValue(buildMediaRow());
      storage.read.mockResolvedValue(Buffer.from("bytes"));

      await expect(service.getContent("tok", "m1")).resolves.toEqual({
        buffer: Buffer.from("bytes"),
        mimeType: "image/png",
        filename: "a.png",
      });
      expect(storage.read).toHaveBeenCalledWith("/disk/a.png", "authenticated");
    });
  });

  describe("remove", () => {
    it("deletes the blob before the row", async () => {
      const { repo, storage, service } = setup();
      const order: string[] = [];
      repo.findOne.mockResolvedValue(buildMediaRow());
      storage.remove.mockImplementation(async () => order.push("blob"));
      repo.delete.mockImplementation(async () => order.push("row"));

      await service.remove("tok", "m1");

      expect(storage.remove).toHaveBeenCalledWith("/disk/a.png", "authenticated");
      expect(repo.delete).toHaveBeenCalledWith({ id: "m1" });
      expect(order).toEqual(["blob", "row"]);
    });
  });

  describe("removeMany", () => {
    it("does nothing for an empty id list", async () => {
      const { auth, service } = setup();
      await service.removeMany("tok", []);
      expect(auth.getCurrentUser).not.toHaveBeenCalled();
    });

    it("does not delete when the user owns none of the ids", async () => {
      const { repo, service } = setup();
      await service.removeMany("tok", ["x"]);
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it("dedupes ids in the ownership query", async () => {
      const { repo, service } = setup();
      await service.removeMany("tok", ["a", "b", "a"]);
      const where = repo.find.mock.calls[0]?.[0].where;
      expect(where.userId).toBe("user-1");
      expect(where.id.value).toEqual(["a", "b"]);
    });

    it("deletes every owned blob and row", async () => {
      const { repo, storage, service } = setup();
      repo.find.mockResolvedValue([
        buildMediaRow({ id: "a", storagePath: "p/a" }),
        buildMediaRow({ id: "b", storagePath: "p/b" }),
      ]);

      await service.removeMany("tok", ["a", "b"]);

      expect(storage.remove.mock.calls).toEqual([
        ["p/a", "authenticated"],
        ["p/b", "authenticated"],
      ]);
      expect(repo.delete.mock.calls[0]?.[0].id.value).toEqual(["a", "b"]);
    });
  });
});

describe("normalizeUploadFilename", () => {
  const mojibake = Buffer.from("دعا.png", "utf8").toString("latin1");

  it.each([
    ["undefined", undefined, "fallback.png"],
    ["empty", "", "fallback.png"],
    ["control characters only", " \u0001\u007f ", "fallback.png"],
    ["latin1 mojibake of UTF-8", mojibake, "دعا.png"],
    ["latin1 that is not valid UTF-8", "café.png", "café.png"],
    ["already non-latin1", "اذكار.pdf", "اذكار.pdf"],
    ["percent-encoded", "my%20file.png", "my file.png"],
    ["a stray percent", "100%zz%2", "100%zz%2"],
    ["a broken escape", "bad%E0%A4%A.png", "bad%E0%A4%A.png"],
    ["path separators and controls", "../etc\\pass\nwd", ".._etc_passwd"],
  ])("handles %s", (_label, input, expected) => {
    expect(normalizeUploadFilename(input, "fallback.png")).toBe(expected);
  });

  it("caps length by code point without splitting surrogate pairs", () => {
    const out = normalizeUploadFilename("😀".repeat(300), "f");
    expect(Array.from(out)).toHaveLength(255);
    expect(out.endsWith("😀")).toBe(true);
  });
});
