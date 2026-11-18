import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { renderHook } from "@testing-library/react-native";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useNotificationBadgeCount } from "./use-notification-badge";

jest.mock("@/providers/in-app-notifications-provider", () => ({
  useInAppNotifications: () => ({ unreadCount: mockState.unread }),
}));
jest.mock("@/hooks/use-notification-permissions", () => ({
  useNotificationPermissions: () => ({
    permission: mockState.permission,
    canEnableLocalReminders: mockState.canEnable,
  }),
}));

const mockState = { unread: 2, permission: "denied", canEnable: true };

async function badge(masterEnabled: boolean) {
  await setPreferences({
    notificationPrefs: { ...DEFAULT_USER_PREFERENCES.notificationPrefs, masterEnabled },
  });
  const { result } = await renderHook(() => useNotificationBadgeCount());
  return result.current;
}

beforeEach(() => {
  Object.assign(mockState, { unread: 2, permission: "denied", canEnable: true });
});
afterEach(resetPreferences);

describe("useNotificationBadgeCount", () => {
  it("adds a nudge when reminders are on but permission is missing", async () => {
    expect(await badge(true)).toBe(3);
  });

  it("counts only unread items once permission is granted", async () => {
    mockState.permission = "granted";
    expect(await badge(true)).toBe(2);
  });

  it("does not nudge when reminders are off", async () => {
    expect(await badge(false)).toBe(2);
  });

  it("does not nudge where local reminders are unavailable", async () => {
    mockState.canEnable = false;
    expect(await badge(true)).toBe(2);
  });
});
