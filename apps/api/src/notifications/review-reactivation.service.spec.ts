import { DataSource } from "typeorm";
import { describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { UserEntity } from "../database/entities";
import { buildUser } from "../test-support/fixtures/user";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import { ReviewReactivationService } from "./review-reactivation.service";

const UNKNOWN_USER_ID = "00000000-0000-4000-8000-000000000000";

async function setup() {
  const module = await createAuthTestingModule([ReviewReactivationService]);
  const { userId } = await module.get(AuthService).createGuestSession({});
  const service = module.get(ReviewReactivationService);
  return {
    userId,
    users: module.get(DataSource).getRepository(UserEntity),
    reserve: (id = userId) =>
      service.maybeDeliverServerReviewReactivation(id, "weekly_report", "en"),
  };
}

describe("ReviewReactivationService", () => {
  it("reserves the current window for a user", async () => {
    const { reserve } = await setup();
    await expect(reserve()).resolves.toBe(true);
  });

  it("does not reserve the same window twice", async () => {
    const { reserve } = await setup();
    await reserve();
    await expect(reserve()).resolves.toBe(false);
  });

  it("returns false for unknown users", async () => {
    const { reserve } = await setup();
    await expect(reserve(UNKNOWN_USER_ID)).resolves.toBe(false);
  });

  it("advances a user whose last reservation was in an older window", async () => {
    const { reserve, users, userId } = await setup();
    await users.update({ id: userId }, { reviewReactivationLastWindowKey: "1" });

    await expect(reserve()).resolves.toBe(true);
    expect((await users.findOneByOrFail({ id: userId })).reviewReactivationLastWindowKey).not.toBe(
      "1",
    );
  });

  it("returns false when a concurrent reservation wins the conditional update", async () => {
    const repository = buildMockRepository({
      findOne: vi.fn().mockResolvedValue(buildUser()),
      update: vi.fn().mockResolvedValue({}),
    });
    const service = new ReviewReactivationService(asRepository<UserEntity>(repository));

    await expect(
      service.maybeDeliverServerReviewReactivation("user-1", "weekly_report"),
    ).resolves.toBe(false);
  });
});
