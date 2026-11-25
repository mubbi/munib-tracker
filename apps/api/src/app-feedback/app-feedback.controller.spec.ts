import { UnauthorizedException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import { AppFeedbackController } from "./app-feedback.controller";
import type { AppFeedbackService } from "./app-feedback.service";
import { SubmitAppFeedbackDto } from "./dto/app-feedback.dto";

function setup() {
  const service = { submit: vi.fn().mockResolvedValue(undefined) };
  const controller = new AppFeedbackController(service as unknown as AppFeedbackService);
  return { service, controller, req: buildRequest() };
}

describe("AppFeedbackController", () => {
  it("forwards the access token and DTO", async () => {
    const { service, controller, req } = setup();
    const dto = { rating: 1 } as SubmitAppFeedbackDto;
    await controller.submit(TEST_BEARER, req, dto);
    expect(service.submit).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, dto);
  });

  it("requires credentials", () => {
    const { controller, req } = setup();
    expect(() => controller.submit(undefined, req, {} as SubmitAppFeedbackDto)).toThrow(
      UnauthorizedException,
    );
  });
});

describe("SubmitAppFeedbackDto", () => {
  const VALID = {
    rating: 2,
    source: "settings",
    triggerId: "perfect_day",
    appVersion: "1.0.0",
    platform: "ios",
  };

  it.each([
    ["a valid payload", {}, []],
    ["a top rating", { rating: 5 }, []],
    ["a rating above 5", { rating: 6 }, ["rating"]],
    ["a rating below 1", { rating: 0 }, ["rating"]],
    ["an unknown trigger", { triggerId: "nope" }, ["triggerId"]],
  ])("validates %s", (_label, overrides, properties) => {
    const errors = validateSync(plainToInstance(SubmitAppFeedbackDto, { ...VALID, ...overrides }));
    expect(errors.map((e) => e.property)).toEqual(properties);
  });
});
