import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import type { SyncPushDto } from "./dto/sync.dto";
import { SyncController } from "./sync.controller";
import type { SyncService } from "./sync.service";

function setup() {
  const service = {
    pull: vi.fn().mockResolvedValue({ changes: [], serverTime: "t" }),
    push: vi.fn().mockResolvedValue({ accepted: 0, conflicts: [], serverTime: "t" }),
  };
  const controller = new SyncController(service as unknown as SyncService);
  return { service, controller, req: buildRequest() };
}

describe("SyncController", () => {
  it("pulls with the access token and since", async () => {
    const { service, controller, req } = setup();
    await controller.pull(TEST_BEARER, req, { since: "2026-01-01T00:00:00Z" });
    expect(service.pull).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, "2026-01-01T00:00:00Z");
  });

  it("returns the pull response", async () => {
    const { controller, req } = setup();
    await expect(controller.pull(TEST_BEARER, req, {})).resolves.toEqual({
      changes: [],
      serverTime: "t",
    });
  });

  it("pushes the DTO with the access token", async () => {
    const { service, controller, req } = setup();
    const dto = { changes: [] } as unknown as SyncPushDto;
    await controller.push(TEST_BEARER, req, dto);
    expect(service.push).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, dto);
  });

  it("requires credentials", () => {
    const { controller, req } = setup();
    expect(() => controller.pull(undefined, req, {})).toThrow(UnauthorizedException);
  });
});
