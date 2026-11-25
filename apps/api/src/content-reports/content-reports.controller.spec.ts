import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import { buildMulterFile, buildUpload } from "../test-support/uploads";
import { ContentReportsController } from "./content-reports.controller";
import type { ContentReportsService } from "./content-reports.service";
import { ContentReportListQueryDto } from "./dto/content-report.dto";

const VALID_PAYLOAD = {
  issueType: "incorrect_translation",
  description: "The translation does not match the Arabic.",
  content: {
    kind: "dua",
    contentId: "daily-before-eating",
    route: "/dua/detail/daily-before-eating",
    locale: "en",
    snapshot: { title: "Before eating", arabic: "بِسْمِ اللَّهِ" },
  },
};

const payloadWith = (overrides: Record<string, unknown>) =>
  JSON.stringify({ ...VALID_PAYLOAD, ...overrides });

function setup() {
  const service = {
    create: vi.fn().mockResolvedValue({ id: "r1" }),
    list: vi.fn().mockResolvedValue({ items: [] }),
    getById: vi.fn().mockResolvedValue({ id: "r1" }),
  };
  const controller = new ContentReportsController(service as unknown as ContentReportsService);
  const req = buildRequest();
  const create = (payload: string, files?: Express.Multer.File[], auth = TEST_BEARER) =>
    controller.create(auth, req, payload, files);
  return { service, controller, req, create };
}

describe("ContentReportsController", () => {
  describe("create", () => {
    it("forwards the access token", async () => {
      const { service, create } = setup();
      await create(JSON.stringify(VALID_PAYLOAD));
      expect(service.create.mock.calls[0]?.[0]).toBe(TEST_ACCESS_TOKEN);
    });

    it("parses the JSON payload into the DTO", async () => {
      const { service, create } = setup();
      await create(JSON.stringify(VALID_PAYLOAD));
      expect(service.create.mock.calls[0]?.[1]).toMatchObject({
        issueType: "incorrect_translation",
        content: { contentId: "daily-before-eating" },
      });
    });

    it("unwraps Multer files into attachments", async () => {
      const { service, create } = setup();
      await create(JSON.stringify(VALID_PAYLOAD), [buildMulterFile()]);
      expect(service.create.mock.calls[0]?.[2]).toEqual([buildUpload()]);
    });

    it("treats missing files as no attachments", async () => {
      const { service, create } = setup();
      await create(JSON.stringify(VALID_PAYLOAD));
      expect(service.create.mock.calls[0]?.[2]).toEqual([]);
    });

    it.each([
      ["a missing payload", undefined as unknown as string, "Missing report payload"],
      ["an empty payload", "", "Missing report payload"],
      ["a blank payload", "   ", "Missing report payload"],
      ["malformed JSON", "{not json", "Invalid report payload JSON"],
      ["a too-short description", payloadWith({ description: "short" }), "description"],
      ["an unknown field", payloadWith({ extra: 1 }), "extra"],
      [
        "an unknown content kind",
        payloadWith({ content: { ...VALID_PAYLOAD.content, kind: "bogus" } }),
        "content",
      ],
    ])("rejects %s", (_label, payload, message) => {
      const { service, create } = setup();
      expect(() => create(payload)).toThrow(BadRequestException);
      expect(() => create(payload)).toThrow(message);
      expect(service.create).not.toHaveBeenCalled();
    });

    it.each(["jahannam", "last_day", "screen"])("accepts the %s content kind", async (kind) => {
      const { service, create } = setup();
      await create(payloadWith({ content: { ...VALID_PAYLOAD.content, kind } }));
      expect(service.create.mock.calls[0]?.[1]).toMatchObject({ content: { kind } });
    });

    it("requires credentials", () => {
      const { create } = setup();
      expect(() => create(JSON.stringify(VALID_PAYLOAD), undefined, "")).toThrow(
        UnauthorizedException,
      );
    });
  });

  it("lists with query paging", async () => {
    const { service, controller, req } = setup();
    await controller.list(TEST_BEARER, req, { page: 2, limit: 5 });
    expect(service.list).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, 2, 5);
  });

  it("gets a single report", async () => {
    const { service, controller, req } = setup();
    await controller.getById(TEST_BEARER, req, "r9");
    expect(service.getById).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, "r9");
  });
});

describe("ContentReportListQueryDto", () => {
  const parse = (plain: Record<string, unknown>) =>
    plainToInstance(ContentReportListQueryDto, plain);

  it("coerces numeric strings", () => {
    expect(parse({ page: "3", limit: "10" })).toMatchObject({ page: 3, limit: 10 });
  });

  it("defaults page and limit", () => {
    expect(parse({})).toMatchObject({ page: 1, limit: 20 });
  });

  it.each([
    [{ page: "3", limit: "10" }, []],
    [{ page: "0" }, ["page"]],
    [{ limit: "101" }, ["limit"]],
  ])("validates %j → errors on %j", (plain, properties) => {
    expect(validateSync(parse(plain)).map((e) => e.property)).toEqual(properties);
  });
});
