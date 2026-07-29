import { beforeEach, describe, expect, it, vi } from "vitest";

const uploadMock = vi.fn();
const getCurrentUserMock = vi.fn();
const saveUserMediaMock = vi.fn();
const readMock = vi.fn();
const removeMock = vi.fn();

vi.mock("../auth/auth.service", () => ({
  AuthService: class {
    getCurrentUser = getCurrentUserMock;
  },
}));

import type { Repository } from "typeorm";
import type { AuthService } from "../auth/auth.service";
import type { AttachmentStorageService } from "../common/attachment-storage.service";
import type { UserMediaEntity } from "../database/entities";
import { UserMediaService } from "./user-media.service";

describe("UserMediaService", () => {
  let service: UserMediaService;
  let mediaRepository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    uploadMock.mockReset();
    getCurrentUserMock.mockReset();
    saveUserMediaMock.mockReset();
    readMock.mockReset();
    removeMock.mockReset();

    getCurrentUserMock.mockResolvedValue({
      userId: "user-1",
      accountType: "user",
    });
    saveUserMediaMock.mockResolvedValue({
      storagePath: "cloudinary:munib-tracker/custom-adhkar/user-1/file",
    });

    mediaRepository = {
      create: vi.fn((row) => row),
      save: vi.fn(async (row) => ({
        ...row,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
      })),
      findOne: vi.fn(),
      find: vi.fn(),
      delete: vi.fn(),
    };

    service = new UserMediaService(
      mediaRepository as unknown as Repository<UserMediaEntity>,
      { getCurrentUser: getCurrentUserMock } as unknown as AuthService,
      {
        saveUserMedia: saveUserMediaMock,
        read: readMock,
        remove: removeMock,
      } as unknown as AttachmentStorageService,
    );
  });

  it("uploads images for linked users", async () => {
    // Minimal JPEG magic bytes so content sniffing accepts the file.
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    const items = await service.upload("token", [
      {
        buffer: jpeg,
        mimetype: "image/jpeg",
        originalname: "zikr.jpg",
        size: jpeg.length,
      },
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]?.mimeType).toBe("image/jpeg");
    expect(items[0]?.contentPath).toMatch(/^\/api\/v1\/user-media\/.+\/content$/);
    expect(saveUserMediaMock).toHaveBeenCalled();
  });

  it("uploads PDFs for linked users", async () => {
    const pdf = Buffer.from("%PDF-1.4 mock");
    const items = await service.upload("token", [
      {
        buffer: pdf,
        mimetype: "application/pdf",
        originalname: "zikr.pdf",
        size: pdf.length,
      },
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]?.mimeType).toBe("application/pdf");
    expect(saveUserMediaMock).toHaveBeenCalledWith(
      "user-1",
      expect.stringMatching(/\.pdf$/),
      pdf,
      "application/pdf",
    );
  });

  it("rejects oversized images", async () => {
    await expect(
      service.upload("token", [
        {
          buffer: Buffer.alloc(2 * 1024 * 1024),
          mimetype: "image/png",
          originalname: "big.png",
          size: 2 * 1024 * 1024,
        },
      ]),
    ).rejects.toThrow("1 MB");
  });

  it("rejects guests", async () => {
    getCurrentUserMock.mockResolvedValue({ userId: "guest-1", accountType: "guest" });
    await expect(
      service.upload("token", [
        {
          buffer: Buffer.from("x"),
          mimetype: "image/jpeg",
          originalname: "a.jpg",
          size: 10,
        },
      ]),
    ).rejects.toMatchObject({ response: { code: "GUEST_NOT_ALLOWED" } });
  });

  it("only returns content for the owning user", async () => {
    mediaRepository.findOne.mockResolvedValue(null);
    await expect(service.getContent("token", "missing")).rejects.toThrow("Media not found");
  });
});
