import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import {
  mockNotificationsPlatform,
  resetNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";

import { achievementNotificationIdentifier, notifyAchievementUnlocked } from "./achievements";

jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").notificationsPlatformMock,
);

const mockScheduleNotification = jest.fn(async () => "id");
jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: (...args: unknown[]) => mockScheduleNotification(...args),
}));

const mockReadPermission = jest.fn();
jest.mock("@/lib/notifications/permissions", () => ({
  readNotificationPermissionUiState: () => mockReadPermission(),
}));

function prefsWith(
  notificationPrefs: Partial<UserPreferences["notificationPrefs"]>,
): UserPreferences {
  return {
    ...DEFAULT_USER_PREFERENCES,
    notificationPrefs: { ...DEFAULT_USER_PREFERENCES.notificationPrefs, ...notificationPrefs },
  } as UserPreferences;
}

beforeEach(() => {
  resetNotificationsPlatformMock();
  mockReadPermission.mockReset().mockResolvedValue("denied");
  mockScheduleNotification.mockClear();
});

describe("notifyAchievementUnlocked", () => {
  it.each([
    ["notifications are off", { masterEnabled: false, achievements: true }],
    ["achievement alerts are off", { masterEnabled: true, achievements: false }],
  ])("skips when %s", async (_label, prefs) => {
    await notifyAchievementUnlocked("salah_1", "Badge", prefsWith(prefs));
    expect(mockReadPermission).not.toHaveBeenCalled();
  });

  it("skips where local notifications are unsupported", async () => {
    mockNotificationsPlatform.expoGo = true;
    await notifyAchievementUnlocked(
      "salah_1",
      "Badge",
      prefsWith({ masterEnabled: true, achievements: true }),
    );
    expect(mockReadPermission).not.toHaveBeenCalled();
  });

  it("checks permission and stops when it is not granted", async () => {
    await expect(
      notifyAchievementUnlocked(
        "salah_1",
        "Badge",
        prefsWith({ masterEnabled: true, achievements: true }),
      ),
    ).resolves.toBeUndefined();
    expect(mockReadPermission).toHaveBeenCalled();
  });

  it("posts under a stable per-achievement identifier so a repeat replaces it", async () => {
    mockReadPermission.mockResolvedValue("granted");
    const prefs = prefsWith({ masterEnabled: true, achievements: true });
    await notifyAchievementUnlocked("salah_1", "First Step", prefs);
    await notifyAchievementUnlocked("salah_1", "First Step", prefs);
    expect(mockScheduleNotification).toHaveBeenCalledTimes(2);
    for (const [request] of mockScheduleNotification.mock.calls as unknown as [
      { identifier: string; content: { body: string } },
    ][]) {
      expect(request.identifier).toBe(achievementNotificationIdentifier("salah_1"));
      expect(request.content.body).toBe("First Step");
    }
  });
});
