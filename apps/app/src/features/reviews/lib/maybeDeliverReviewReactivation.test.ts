import {
  reviewReactivationDedupeKey,
  reviewReactivationWindowKey,
} from "@munib-tracker/shared/reviews";
import { maybeDeliverReviewReactivation } from "@/features/reviews/lib/maybeDeliverReviewReactivation";

const mockScheduleNotificationAsync = jest.fn(async (..._args: unknown[]) => "id");
const mockWriteDedupe = jest.fn(async (_value: string) => undefined);
const mockEnv = {
  localSupported: true,
  reactivationEnabled: true,
  gateAllowed: true,
  priorDedupe: null as string | null,
};

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: (...args: unknown[]) => mockScheduleNotificationAsync(...args),
}));

jest.mock("@/lib/notifications/platform", () => ({
  isLocalNotificationSupported: () => mockEnv.localSupported,
}));

jest.mock("@/features/reviews/lib/reviewGating", () => ({
  canSendReviewReactivationPush: () => ({ allowed: mockEnv.gateAllowed }),
}));

jest.mock("@/features/reviews/lib/reviewStorage", () => ({
  readReviewGating: async () =>
    jest.requireActual("@/features/reviews/lib/reviewStorage").EMPTY_REVIEW_GATING,
  readReviewReactivationDedupe: async () => mockEnv.priorDedupe,
  writeReviewReactivationDedupe: (value: string) => mockWriteDedupe(value),
}));

jest.mock("@/auth/session-store", () => ({
  SessionStore: { getDeviceId: async () => "device-1" },
}));

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: () => ({
      prefs: { notificationPrefs: { reviewReactivationEnabled: mockEnv.reactivationEnabled } },
    }),
  },
}));

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: { t: (key: string) => key },
}));

const currentDedupeKey = () =>
  reviewReactivationDedupeKey("device-1", reviewReactivationWindowKey());

function setup(overrides: Partial<typeof mockEnv> = {}) {
  Object.assign(mockEnv, overrides);
  return maybeDeliverReviewReactivation("achievement_unlock");
}

describe("maybeDeliverReviewReactivation", () => {
  beforeEach(() => {
    mockScheduleNotificationAsync.mockClear();
    mockWriteDedupe.mockClear();
    Object.assign(mockEnv, {
      localSupported: true,
      reactivationEnabled: true,
      gateAllowed: true,
      priorDedupe: null,
    });
  });

  it.each([
    ["local notifications are unsupported", { localSupported: false }],
    ["the preference is disabled", { reactivationEnabled: false }],
    ["gating disallows the push", { gateAllowed: false }],
  ])("skips when %s", async (_label, overrides) => {
    await expect(setup(overrides)).resolves.toBe(false);
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("skips when this window was already delivered", async () => {
    await expect(setup({ priorDedupe: currentDedupeKey() })).resolves.toBe(false);
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("schedules a review notification carrying the trigger id", async () => {
    await expect(setup()).resolves.toBe(true);
    expect(mockScheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "localNotifications.reviewReactivationTitle",
        body: "localNotifications.reviewReactivationBody",
        data: {
          type: "review_reactivation",
          action: "open_review_funnel",
          triggerId: "achievement_unlock",
        },
      },
      trigger: null,
    });
  });

  it("records the dedupe key after delivering", async () => {
    await setup();
    expect(mockWriteDedupe).toHaveBeenCalledWith(currentDedupeKey());
  });
});
