import { act, renderHook } from "@testing-library/react-native";
import {
  ReviewEngagementProvider,
  useReviewEngagement,
} from "@/features/reviews/context/ReviewEngagementProvider";
import { getReviewPromptRuntime } from "@/features/reviews/lib/reviewEngagementBridge";
import type { ReviewGatingState } from "@/features/reviews/lib/reviewStorage";
import { deferred } from "@/test-support/async";

jest.unmock("@/features/reviews/context/ReviewEngagementProvider");

const mockEnv = {
  stored: null as ReviewGatingState | null,
  writes: 0,
  prefsReady: true,
  achievementIds: Promise.resolve(["a", "b"]) as Promise<string[]>,
};

jest.mock("@/features/reviews/lib/reviewStorage", () => {
  const actual = jest.requireActual("@/features/reviews/lib/reviewStorage");
  return {
    ...actual,
    readReviewGating: async () => ({ ...(mockEnv.stored ?? actual.EMPTY_REVIEW_GATING) }),
    writeReviewGating: async (state: ReviewGatingState) => {
      mockEnv.stored = state;
      mockEnv.writes += 1;
    },
  };
});

jest.mock("@/lib/achievements-persistence", () => ({
  readPersistedAchievementIds: () => mockEnv.achievementIds,
}));

jest.mock("@/stores/preferences-store", () => ({
  usePreferencesReady: () => mockEnv.prefsReady,
  usePreferences: () => ({ hasCompletedOnboarding: true }),
}));

jest.mock("@/stores/tracker-store", () => ({ trackerStore: {} }));

jest.mock("@/stores/create-store", () => ({
  useStore: (_store: unknown, selector: (s: unknown) => unknown) =>
    selector({ achievementStats: { prayersCompleted: 12, streak: 4 } }),
}));

async function settle() {
  await act(async () => {
    for (let i = 0; i < 4; i += 1) await Promise.resolve();
  });
}

async function setup(env: Partial<typeof mockEnv> = {}) {
  Object.assign(mockEnv, env);
  const utils = await renderHook(() => useReviewEngagement(), {
    wrapper: ReviewEngagementProvider,
  });
  await settle();
  return utils;
}

describe("ReviewEngagementProvider", () => {
  beforeEach(() => {
    Object.assign(mockEnv, {
      stored: null,
      writes: 0,
      prefsReady: true,
      achievementIds: Promise.resolve(["a", "b"]),
    });
  });

  it("registers its runtime snapshot with the bridge", async () => {
    await setup();
    expect(getReviewPromptRuntime()).toEqual({
      isSyncing: false,
      prayersLogged: 12,
      currentStreak: 4,
      achievementsUnlocked: 2,
      hasCompletedOnboarding: true,
    });
  });

  it("unregisters from the bridge on unmount", async () => {
    const { unmount } = await setup();
    await unmount();
    expect(getReviewPromptRuntime().prayersLogged).toBe(0);
  });

  it("reports onboarding as incomplete while preferences load", async () => {
    await setup({ prefsReady: false });
    expect(getReviewPromptRuntime().hasCompletedOnboarding).toBe(false);
  });

  it("ignores achievements that resolve after unmount", async () => {
    const ids = deferred<string[]>();
    const { unmount } = await setup({ achievementIds: ids.promise });
    await unmount();
    await act(async () => {
      ids.resolve(["x"]);
      await Promise.resolve();
    });
    expect(getReviewPromptRuntime().achievementsUnlocked).toBe(0);
  });

  it("counts each interaction kind once per session", async () => {
    const { result } = await setup();
    await act(async () => {
      result.current.trackInteraction("mark_prayer");
      result.current.trackInteraction("mark_prayer");
      result.current.trackInteraction("mark_zikr");
    });
    await settle();
    expect(mockEnv.writes).toBe(2);
  });

  it("persists an error marker", async () => {
    const { result } = await setup();
    await act(async () => {
      result.current.recordError();
    });
    await settle();
    const errorAt = mockEnv.stored?.lastErrorAt;
    expect(errorAt).toEqual(expect.any(String));
    expect(mockEnv.stored?.sessionErrorAt).toBe(errorAt);
  });

  it("throws outside the provider", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useReviewEngagement())).rejects.toThrow(
      "useReviewEngagement must be used within ReviewEngagementProvider",
    );
    spy.mockRestore();
  });
});
