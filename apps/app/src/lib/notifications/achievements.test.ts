import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import {
  mockNotificationsPlatform,
  resetNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";

import { notifyAchievementUnlocked } from "./achievements";

jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").notificationsPlatformMock,
);

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
});

describe("notifyAchievementUnlocked", () => {
  it.each([
    ["notifications are off", { masterEnabled: false, achievements: true }],
    ["achievement alerts are off", { masterEnabled: true, achievements: false }],
  ])("skips when %s", async (_label, prefs) => {
    await notifyAchievementUnlocked("Badge", prefsWith(prefs));
    expect(mockReadPermission).not.toHaveBeenCalled();
  });

  it("skips where local notifications are unsupported", async () => {
    mockNotificationsPlatform.expoGo = true;
    await notifyAchievementUnlocked(
      "Badge",
      prefsWith({ masterEnabled: true, achievements: true }),
    );
    expect(mockReadPermission).not.toHaveBeenCalled();
  });

  it("checks permission and stops when it is not granted", async () => {
    await expect(
      notifyAchievementUnlocked("Badge", prefsWith({ masterEnabled: true, achievements: true })),
    ).resolves.toBeUndefined();
    expect(mockReadPermission).toHaveBeenCalled();
  });
});
