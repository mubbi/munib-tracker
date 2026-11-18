import { type HttpException, UnauthorizedException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppFeedbackEntity } from "../database/entities";
import { buildMockAuthService } from "../test-support/auth";
import { buildAuthUser } from "../test-support/fixtures/user";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import { AppFeedbackService } from "./app-feedback.service";
import type { SubmitAppFeedbackDto } from "./dto/app-feedback.dto";

const isAppFeedbackRateLimited = vi.fn();

vi.mock("./app-feedback-rate-limit", () => ({
  isAppFeedbackRateLimited: (...args: unknown[]) => isAppFeedbackRateLimited(...args),
}));

function buildFeedbackDto(overrides: Partial<SubmitAppFeedbackDto> = {}): SubmitAppFeedbackDto {
  return {
    rating: 3,
    source: "in_app_review",
    appVersion: "1.0.0",
    platform: "android",
    ...overrides,
  } as SubmitAppFeedbackDto;
}

function setup() {
  const repo = buildMockRepository();
  const auth = buildMockAuthService(buildAuthUser({ accountType: "guest" }));
  const service = new AppFeedbackService(asRepository<AppFeedbackEntity>(repo), auth.asService());
  const savedRow = () => repo.create.mock.calls[0]?.[0];
  return { repo, auth, service, savedRow };
}

describe("AppFeedbackService (unit)", () => {
  beforeEach(() => {
    isAppFeedbackRateLimited.mockReset().mockResolvedValue(false);
  });

  it.each([0, 4, 2.5])("rejects rating %s before resolving the user", async (rating) => {
    const { auth, service } = setup();
    await expect(service.submit("tok", buildFeedbackDto({ rating }))).rejects.toThrow(
      "Rating must be an integer between 1 and 3.",
    );
    expect(auth.getCurrentUser).not.toHaveBeenCalled();
  });

  it("requires a token", async () => {
    const { service } = setup();
    await expect(service.submit("", buildFeedbackDto())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("returns 429 without saving when rate limited", async () => {
    const { repo, service } = setup();
    isAppFeedbackRateLimited.mockResolvedValue(true);
    const error = await service.submit("tok", buildFeedbackDto()).catch((e: unknown) => e);
    expect((error as HttpException).getStatus()).toBe(429);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("records the user as the device", async () => {
    const { service, savedRow } = setup();
    await service.submit("tok", buildFeedbackDto());
    expect(savedRow()).toMatchObject({ userId: "user-1", deviceId: "user-1", rating: 3 });
  });

  it.each([
    ["omitted", {}],
    ["blank", { message: "   " }],
  ])("stores null for %s optional fields", async (_label, overrides) => {
    const { service, savedRow } = setup();
    await service.submit("tok", buildFeedbackDto(overrides));
    expect(savedRow()).toMatchObject({ message: null, triggerId: null, locale: null });
  });

  it("trims the message and keeps provided optional fields", async () => {
    const { service, savedRow } = setup();
    await service.submit(
      "tok",
      buildFeedbackDto({ message: "  hello  ", triggerId: "manual", locale: "ur" }),
    );
    expect(savedRow()).toMatchObject({ message: "hello", triggerId: "manual", locale: "ur" });
  });
});
