import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ContentReportAttachmentEntity, ContentReportEntity } from "../database/entities";
import { buildMockAuthService } from "../test-support/auth";
import { buildAuthUser } from "../test-support/fixtures/user";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import { buildMockAttachmentStorage, buildUpload } from "../test-support/uploads";
import { ContentReportsService } from "./content-reports.service";
import type { CreateContentReportDto } from "./dto/content-report.dto";

const isContentReportRateLimited = vi.fn();

vi.mock("./content-report-rate-limit", () => ({
  isContentReportRateLimited: (...args: unknown[]) => isContentReportRateLimited(...args),
}));

const CREATED_AT = new Date("2026-03-01T10:00:00.000Z");
const UPDATED_AT = new Date("2026-03-02T10:00:00.000Z");
const TWO_MIB = 2 * 1024 * 1024;

function buildReportRow(overrides: Partial<ContentReportEntity> = {}): ContentReportEntity {
  return {
    id: "r1",
    userId: "user-1",
    status: "pending",
    issueType: "typo",
    description: "Something is off here",
    suggestedCorrection: null,
    userReference: null,
    content: { kind: "dua", contentId: "d1", route: "/dua/d1", locale: "en" },
    appVersion: null,
    platform: null,
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    resolvedAt: null,
    ...overrides,
  } as ContentReportEntity;
}

function buildCreateDto(overrides: Partial<CreateContentReportDto> = {}): CreateContentReportDto {
  return {
    issueType: "typo",
    description: "Something is off here",
    content: { kind: "dua", contentId: "d1", route: "/dua/d1", locale: "en" },
    ...overrides,
  };
}

function setup(user = buildAuthUser()) {
  const queryBuilder = {
    select: vi.fn().mockReturnThis(),
    addSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    groupBy: vi.fn().mockReturnThis(),
    getRawMany: vi.fn().mockResolvedValue([]),
  };
  const reports = {
    ...buildMockRepository({ findOne: vi.fn().mockResolvedValue(buildReportRow()) }),
    findAndCount: vi.fn().mockResolvedValue([[], 0]),
  };
  const attachments = buildMockRepository({
    createQueryBuilder: vi.fn(() => queryBuilder),
  });
  const auth = buildMockAuthService(user);
  const storage = buildMockAttachmentStorage();
  const service = new ContentReportsService(
    asRepository<ContentReportEntity>(reports),
    asRepository<ContentReportAttachmentEntity>(attachments),
    auth.asService(),
    storage.asService(),
  );
  const createdRow = () => reports.create.mock.calls[0]?.[0];
  return { reports, attachments, queryBuilder, auth, storage, service, createdRow };
}

describe("ContentReportsService (unit)", () => {
  beforeEach(() => {
    isContentReportRateLimited.mockReset().mockResolvedValue(false);
  });

  describe("access", () => {
    it("rejects a missing token before resolving the user", async () => {
      const { auth, service } = setup();
      await expect(service.list("")).rejects.toBeInstanceOf(UnauthorizedException);
      expect(auth.getCurrentUser).not.toHaveBeenCalled();
    });

    it("rejects guests with GUEST_NOT_ALLOWED", async () => {
      const { service } = setup(buildAuthUser({ accountType: "guest" }));
      const error = await service.getById("tok", "r1").catch((e: unknown) => e);
      expect(error).toBeInstanceOf(ForbiddenException);
      expect((error as ForbiddenException).getResponse()).toMatchObject({
        code: "GUEST_NOT_ALLOWED",
      });
    });

    it("hides reports owned by someone else", async () => {
      const { reports, service } = setup();
      reports.findOne.mockResolvedValue(null);
      await expect(service.getById("tok", "nope")).rejects.toBeInstanceOf(NotFoundException);
      expect(reports.findOne).toHaveBeenCalledWith({ where: { id: "nope", userId: "user-1" } });
    });
  });

  describe("create", () => {
    it("returns 429 without saving when rate limited", async () => {
      const { reports, service } = setup();
      isContentReportRateLimited.mockResolvedValue(true);
      const error = await service.create("tok", buildCreateDto()).catch((e: unknown) => e);
      expect((error as HttpException).getStatus()).toBe(429);
      expect(reports.save).not.toHaveBeenCalled();
    });

    it("rate limits per user id", async () => {
      const { service } = setup();
      await service.create("tok", buildCreateDto());
      expect(isContentReportRateLimited).toHaveBeenCalledWith("user-1");
    });

    it.each([
      ["four attachments", Array.from({ length: 4 }, () => buildUpload()), "At most 3"],
      ["an unsupported MIME type", [buildUpload({ mimetype: "application/pdf" })], "Unsupported"],
      ["an attachment over 2 MB", [buildUpload({ size: TWO_MIB + 1 })], "2 MB"],
    ])("rejects %s", async (_label, files, message) => {
      const { service } = setup();
      const error = await service.create("tok", buildCreateDto(), files).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as Error).message).toContain(message);
    });

    it("saves a pending report with trimmed text", async () => {
      const { service, createdRow } = setup();
      await service.create(
        "tok",
        buildCreateDto({ description: "  Long description  ", userReference: "  Ref  " }),
      );
      expect(createdRow()).toMatchObject({
        userId: "user-1",
        status: "pending",
        description: "Long description",
        userReference: "Ref",
      });
    });

    it.each([
      ["omitted", {}],
      ["blank", { suggestedCorrection: "   ", userReference: "" }],
    ])("stores null for %s optional fields", async (_label, overrides) => {
      const { service, createdRow } = setup();
      await service.create("tok", buildCreateDto(overrides));
      expect(createdRow()).toMatchObject({
        suggestedCorrection: null,
        userReference: null,
        appVersion: null,
        platform: null,
      });
    });

    it("keeps app version and platform", async () => {
      const { service, createdRow } = setup();
      await service.create("tok", buildCreateDto({ appVersion: "1.0.0", platform: "ios" }));
      expect(createdRow()).toMatchObject({ appVersion: "1.0.0", platform: "ios" });
    });

    it("skips storage when there are no attachments", async () => {
      const { storage, service } = setup();
      await service.create("tok", buildCreateDto());
      expect(storage.save).not.toHaveBeenCalled();
    });

    it.each([
      ["image/jpeg", ".jpg"],
      ["image/png", ".png"],
      ["image/webp", ".webp"],
    ])("stores %s attachments with a %s extension", async (mimetype, ext) => {
      const { storage, service } = setup();
      await service.create("tok", buildCreateDto(), [buildUpload({ mimetype })]);
      expect(storage.save).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringMatching(new RegExp(`\\${ext}$`)),
        expect.any(Buffer),
        mimetype,
      );
    });

    it("records attachment rows with the original filename", async () => {
      const { attachments, service } = setup();
      await service.create("tok", buildCreateDto(), [buildUpload({ originalname: "a.png" })]);
      expect(attachments.create.mock.calls[0]?.[0]).toMatchObject({
        filename: "a.png",
        mimeType: "image/png",
        sizeBytes: buildUpload().size,
        storagePath: expect.stringMatching(/^\/disk\//),
      });
    });

    it("falls back to the generated filename when the original is blank", async () => {
      const { attachments, storage, service } = setup();
      await service.create("tok", buildCreateDto(), [buildUpload({ originalname: "" })]);
      expect(attachments.create.mock.calls[0]?.[0].filename).toBe(storage.save.mock.calls[0]?.[1]);
    });

    it("returns the stored report detail", async () => {
      const { attachments, service } = setup();
      attachments.count.mockResolvedValue(1);
      await expect(service.create("tok", buildCreateDto(), [buildUpload()])).resolves.toMatchObject(
        { id: "r1", status: "pending", attachmentCount: 1 },
      );
    });
  });

  describe("getById", () => {
    it("maps timestamps and detail fields", async () => {
      const { reports, service } = setup();
      reports.findOne.mockResolvedValue(
        buildReportRow({
          suggestedCorrection: "fix",
          userReference: "Ref",
          appVersion: "1.0.0",
          platform: "ios",
          resolvedAt: UPDATED_AT,
        }),
      );
      await expect(service.getById("tok", "r1")).resolves.toMatchObject({
        createdAt: CREATED_AT.toISOString(),
        updatedAt: UPDATED_AT.toISOString(),
        resolvedAt: UPDATED_AT.toISOString(),
        suggestedCorrection: "fix",
        userReference: "Ref",
        appVersion: "1.0.0",
        platform: "ios",
      });
    });

    it("maps undefined optional columns to null", async () => {
      const { reports, service } = setup();
      reports.findOne.mockResolvedValue(
        buildReportRow({
          suggestedCorrection: undefined,
          userReference: undefined,
          appVersion: undefined,
          platform: undefined,
          resolvedAt: undefined,
        } as unknown as Partial<ContentReportEntity>),
      );
      await expect(service.getById("tok", "r1")).resolves.toMatchObject({
        suggestedCorrection: null,
        userReference: null,
        appVersion: null,
        platform: null,
        resolvedAt: null,
      });
    });
  });

  describe("list", () => {
    it.each([
      ["defaults", undefined, undefined, 0, 20, 1],
      ["clamped high limits and low pages", 0, 500, 0, 100, 1],
      ["clamped low limits", 3, 0, 2, 1, 3],
    ])("pages with %s", async (_label, page, limit, skip, take, expectedPage) => {
      const { reports, service } = setup();
      const out = await service.list("tok", page, limit);
      expect(reports.findAndCount).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        order: { createdAt: "DESC" },
        skip,
        take,
      });
      expect(out).toMatchObject({ page: expectedPage, limit: take });
    });

    it("skips the attachment count query for an empty page", async () => {
      const { attachments, service } = setup();
      await service.list("tok");
      expect(attachments.createQueryBuilder).not.toHaveBeenCalled();
    });

    it("attaches grouped attachment counts, defaulting to zero", async () => {
      const { reports, queryBuilder, service } = setup();
      reports.findAndCount.mockResolvedValue([
        [buildReportRow({ id: "a" }), buildReportRow({ id: "b" })],
        7,
      ]);
      queryBuilder.getRawMany.mockResolvedValue([{ reportId: "a", count: "2" }]);

      const out = await service.list("tok");

      expect(queryBuilder.where).toHaveBeenCalledWith("a.reportId IN (:...reportIds)", {
        reportIds: ["a", "b"],
      });
      expect(out.total).toBe(7);
      expect(out.items.map((item) => item.attachmentCount)).toEqual([2, 0]);
    });
  });
});
