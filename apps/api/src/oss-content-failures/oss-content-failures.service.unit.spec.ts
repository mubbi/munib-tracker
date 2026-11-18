import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import type { OssContentDownloadFailureEntity } from "../database/entities";
import { buildMockAuthService } from "../test-support/auth";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import type { ReportOssContentDownloadFailureDto } from "./dto/oss-content-failure.dto";
import { OssContentFailuresService } from "./oss-content-failures.service";

vi.mock("./oss-content-failure-rate-limit", () => ({
  isOssContentFailureRateLimited: vi.fn(async () => false),
}));

type FailureDto = ReportOssContentDownloadFailureDto;

function buildFailureDto(overrides: Partial<FailureDto> = {}): FailureDto {
  return {
    contentKind: "quran_edition",
    contentKey: "  key  ",
    sourceProvider: " provider ",
    sourceUrl: " https://cdn.example/x.json ",
    errorCode: "network_error",
    errorMessage: "timeout",
    appVersion: "1.0.0",
    platform: "web",
    ...overrides,
  } as FailureDto;
}

function setup() {
  const repo = buildMockRepository();
  const auth = buildMockAuthService();
  const service = new OssContentFailuresService(
    asRepository<OssContentDownloadFailureEntity>(repo),
    auth.asService(),
  );
  const report = async (overrides: Partial<FailureDto> = {}) => {
    await service.report("tok", buildFailureDto(overrides));
    return repo.create.mock.calls[0]?.[0] as Record<string, unknown>;
  };
  return { auth, service, report };
}

describe("OssContentFailuresService (unit)", () => {
  it("requires a token before resolving the user", async () => {
    const { auth, service } = setup();
    await expect(service.report("", buildFailureDto())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(auth.getCurrentUser).not.toHaveBeenCalled();
  });

  it("trims the content identifiers", async () => {
    const { report } = setup();
    await expect(report()).resolves.toMatchObject({
      userId: "user-1",
      contentKey: "key",
      sourceProvider: "provider",
      sourceUrl: "https://cdn.example/x.json",
    });
  });

  it.each([
    ["missing", undefined],
    ["an array", ["not", "an", "object"]],
  ])("replaces %s contentMeta with {}", async (_label, contentMeta) => {
    const { report } = setup();
    const row = await report({ contentMeta: contentMeta as unknown as FailureDto["contentMeta"] });
    expect(row.contentMeta).toEqual({});
  });

  it("keeps object contentMeta", async () => {
    const { report } = setup();
    const row = await report({ contentMeta: { surah: 2 } });
    expect(row.contentMeta).toEqual({ surah: 2 });
  });

  it("falls back to the error code for a blank message", async () => {
    const { report } = setup();
    await expect(report({ errorMessage: "   " })).resolves.toMatchObject({
      errorMessage: "network_error",
    });
  });

  it.each([
    ["contentKey", { contentKey: "k".repeat(300) }, 256],
    ["errorMessage", { errorMessage: "e".repeat(2500) }, 2000],
  ] as const)("truncates %s to %i characters", async (field, overrides, length) => {
    const { report } = setup();
    const row = await report(overrides);
    expect((row[field] as string).length).toBe(length);
  });

  it.each([
    ["blank", { locale: "  ", translationLocale: "" }, { locale: null, translationLocale: null }],
    [
      "padded",
      { locale: " ur ", translationLocale: " en " },
      { locale: "ur", translationLocale: "en" },
    ],
  ])("normalizes %s locales", async (_label, overrides, expected) => {
    const { report } = setup();
    await expect(report(overrides)).resolves.toMatchObject(expected);
  });

  it.each([
    [undefined, null],
    [503, 503],
  ])("stores httpStatus %j as %j", async (httpStatus, expected) => {
    const { report } = setup();
    await expect(report({ httpStatus })).resolves.toMatchObject({ httpStatus: expected });
  });
});
