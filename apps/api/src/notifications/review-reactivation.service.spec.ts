import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { ReviewReactivationService } from "./review-reactivation.service";

describe("ReviewReactivationService", () => {
  let authService: AuthService;
  let reviewReactivationService: ReviewReactivationService;

  beforeEach(async () => {
    const module = await createAuthTestingModule([ReviewReactivationService]);
    authService = module.get(AuthService);
    reviewReactivationService = module.get(ReviewReactivationService);
  });

  it("reserves the current window once per user", async () => {
    const guest = await authService.createGuestSession({});

    const first = await reviewReactivationService.maybeDeliverServerReviewReactivation(
      guest.userId,
      "weekly_report",
      "en",
    );
    const second = await reviewReactivationService.maybeDeliverServerReviewReactivation(
      guest.userId,
      "weekly_report",
      "en",
    );

    expect(first).toBe(true);
    expect(second).toBe(false);
  });
});
