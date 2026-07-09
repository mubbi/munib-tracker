import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockScheduleNotificationAsync = jest.fn<() => Promise<string>>().mockResolvedValue("id");
let mockReviewReactivationEnabled = true;

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: (...args: unknown[]) => mockScheduleNotificationAsync(...args),
}));

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("@/features/reviews/lib/reviewGating", () => ({
  canSendReviewReactivationPush: jest.fn(() => ({ allowed: true })),
}));

jest.mock("@/features/reviews/lib/reviewEngagementBridge", () => ({
  getReviewPromptRuntime: jest.fn(() => ({
    isSyncing: false,
    prayersLogged: 5,
    currentStreak: 3,
    achievementsUnlocked: 1,
    hasCompletedOnboarding: true,
  })),
}));

jest.mock("@/features/reviews/lib/reviewStorage", () => ({
  readReviewGating: jest.fn(async () => ({
    firstOpenAt: new Date().toISOString(),
    sessionCount: 5,
    meaningfulInteractionCount: 6,
    lastSessionValueAt: new Date().toISOString(),
    lastPromptedAt: null,
    lastDismissedAt: null,
    lastStoreReviewRequestAt: null,
    lastFeedbackSentAt: null,
    lastErrorAt: null,
    lastForegroundAt: null,
    currentSessionStartedAt: new Date().toISOString(),
    sessionPromptShown: false,
    sessionErrorAt: null,
    lastTriggerCoalesceAt: null,
    promptCountLifetime: 0,
    dismissStreak: 0,
  })),
  readReviewReactivationDedupe: jest.fn(async () => null),
  writeReviewReactivationDedupe: jest.fn(async () => undefined),
}));

jest.mock("@/auth/session-store", () => ({
  SessionStore: {
    getDeviceId: jest.fn(async () => "device-1"),
  },
}));

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: () => ({
      prefs: {
        notificationPrefs: {
          get reviewReactivationEnabled() {
            return mockReviewReactivationEnabled;
          },
        },
      },
    }),
  },
}));

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: { t: (key: string) => key },
}));

import { maybeDeliverReviewReactivation } from "@/features/reviews/lib/maybeDeliverReviewReactivation";

describe("maybeDeliverReviewReactivation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReviewReactivationEnabled = true;
  });

  it("skips when preference disabled", async () => {
    mockReviewReactivationEnabled = false;

    const sent = await maybeDeliverReviewReactivation("perfect_day");
    expect(sent).toBe(false);
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("schedules a local notification when allowed", async () => {
    const sent = await maybeDeliverReviewReactivation("achievement_unlock");
    expect(sent).toBe(true);
    expect(mockScheduleNotificationAsync).toHaveBeenCalledTimes(1);
  });
});
