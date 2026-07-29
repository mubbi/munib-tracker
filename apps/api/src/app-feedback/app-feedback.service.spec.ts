import { BadRequestException } from "@nestjs/common";
import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { AppFeedbackService } from "./app-feedback.service";
import { resetAppFeedbackRateLimits } from "./app-feedback-rate-limit";

const samplePayload = {
  rating: 2,
  message: "Prayer reminders could be clearer.",
  source: "in_app_review",
  triggerId: "perfect_day",
  appVersion: "1.0.0",
  platform: "ios" as const,
  locale: "en",
};

describe("AppFeedbackService", () => {
  let authService: AuthService;
  let appFeedbackService: AppFeedbackService;

  beforeEach(async () => {
    resetAppFeedbackRateLimits();
    const module = await createAuthTestingModule([AppFeedbackService]);
    authService = module.get(AuthService);
    appFeedbackService = module.get(AppFeedbackService);
  });

  it("accepts feedback from guest sessions", async () => {
    const guest = await authService.createGuestSession({});

    await expect(
      appFeedbackService.submit(guest.accessToken, samplePayload),
    ).resolves.toBeUndefined();
  });

  it("accepts feedback from linked OAuth users", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });

    await expect(
      appFeedbackService.submit(session.accessToken, samplePayload),
    ).resolves.toBeUndefined();
  });

  it("rejects ratings outside 1–3", async () => {
    const guest = await authService.createGuestSession({});

    await expect(
      appFeedbackService.submit(guest.accessToken, { ...samplePayload, rating: 4 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
