import { maybeDeliverReviewReactivation } from "@/features/reviews/lib/maybeDeliverReviewReactivation.web";

describe("maybeDeliverReviewReactivation (web)", () => {
  it("never delivers on web", async () => {
    await expect(maybeDeliverReviewReactivation("perfect_day")).resolves.toBe(false);
  });
});
