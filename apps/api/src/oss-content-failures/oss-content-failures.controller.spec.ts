import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import type { ReportOssContentDownloadFailureDto } from "./dto/oss-content-failure.dto";
import { OssContentFailuresController } from "./oss-content-failures.controller";
import type { OssContentFailuresService } from "./oss-content-failures.service";

function setup() {
  const service = { report: vi.fn().mockResolvedValue(undefined) };
  const controller = new OssContentFailuresController(
    service as unknown as OssContentFailuresService,
  );
  return { service, controller, req: buildRequest() };
}

describe("OssContentFailuresController", () => {
  it("forwards the access token and DTO", async () => {
    const { service, controller, req } = setup();
    const dto = { contentKind: "font" } as unknown as ReportOssContentDownloadFailureDto;
    await controller.report(TEST_BEARER, req, dto);
    expect(service.report).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, dto);
  });

  it("requires credentials", () => {
    const { controller, req } = setup();
    expect(() =>
      controller.report(undefined, req, {} as ReportOssContentDownloadFailureDto),
    ).toThrow(UnauthorizedException);
  });
});
