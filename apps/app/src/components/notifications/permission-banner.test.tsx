import { act, fireEvent, screen } from "@testing-library/react-native";

import { NotificationPermissionBanner } from "@/components/notifications/permission-banner";
import { preferencesStore } from "@/stores/preferences-store";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import {
  mockNotificationsOs,
  resetSwitchableNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { resetPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

type PermState = {
  permission: string;
  granted: boolean;
  denied: boolean;
  requestPermission: jest.Mock;
  openSettings: jest.Mock;
  canEnableLocalReminders: boolean;
  isExpoGo: boolean;
  webGuidance: { tier: string; needsSafariForInstall?: boolean };
};

let mockPerm: PermState;
let mockBeginResult: unknown = null;
let mockCanRequestWeb = true;
const mockReschedule = jest.fn(async (..._a: unknown[]) => undefined);
const mockRegisterWebPush = jest.fn(async (_t: string) => undefined);

jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").switchableNotificationsPlatformMock,
);
jest.mock("@/hooks/use-notification-permissions", () => ({
  useNotificationPermissions: () => mockPerm,
}));
jest.mock("@/lib/notifications/register-push-token", () => ({
  registerWebPushSubscriptionWithApi: (token: string) => mockRegisterWebPush(token),
}));
jest.mock("@/lib/notifications/web-environment", () => ({
  beginWebNotificationPermissionRequest: () => mockBeginResult,
  canRequestWebNotificationPermission: () => mockCanRequestWeb,
}));
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: (...args: unknown[]) => mockReschedule(...args),
}));

const ENABLE = "Enable notifications";

async function renderBanner(perm: Partial<PermState> = {}, showWhenGranted = false) {
  mockPerm = {
    permission: "undetermined",
    granted: false,
    denied: false,
    requestPermission: jest.fn(async () => ({ granted: true })),
    openSettings: jest.fn(),
    canEnableLocalReminders: true,
    isExpoGo: false,
    webGuidance: { tier: "chromium_full" },
    ...perm,
  };
  await renderWithTheme(<NotificationPermissionBanner showWhenGranted={showWhenGranted} />);
  return mockPerm;
}

async function pressEnable() {
  await fireEvent.press(screen.getByText(ENABLE));
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("NotificationPermissionBanner", () => {
  beforeEach(async () => {
    resetSwitchableNotificationsPlatformMock();
    mockBeginResult = null;
    mockCanRequestWeb = true;
    await resetPreferences();
    mockReschedule.mockClear();
    mockRegisterWebPush.mockClear();
    resetAuthMock();
    resetToastMock();
  });

  it.each([
    ["granted without showWhenGranted", { granted: true }],
    ["native reminders unsupported", { canEnableLocalReminders: false }],
  ])("renders nothing when %s", async (_label, perm) => {
    await renderBanner(perm);
    expect(screen.queryByText(/Notifications|Enable reminders/)).toBeNull();
  });

  describe("native", () => {
    it("enables reminders and reschedules after a grant", async () => {
      const perm = await renderBanner();
      await pressEnable();
      expect(perm.requestPermission).toHaveBeenCalledWith();
      // Shared `enableNotifications()` path (NF-3.0b): master on + one reschedule.
      expect(preferencesStore.getState().prefs.notificationPrefs.masterEnabled).toBe(true);
      expect(mockReschedule).toHaveBeenCalledTimes(1);
      expect(mockRegisterWebPush).not.toHaveBeenCalled();
    });

    it("warns when permission is refused", async () => {
      await renderBanner({ requestPermission: jest.fn(async () => ({ granted: false })) });
      await pressEnable();
      expect(mockToast.warning).toHaveBeenCalledWith(
        "Notifications blocked",
        "Open Settings and turn on notifications for Munib Tracker.",
      );
    });

    it("opens settings from the granted state", async () => {
      const perm = await renderBanner({ granted: true }, true);
      expect(screen.getByText("Notifications enabled")).toBeTruthy();
      await fireEvent.press(screen.getByText("Open Settings"));
      expect(perm.openSettings).toHaveBeenCalled();
    });

    it("shows the blocked state without an enable button", async () => {
      await renderBanner({ denied: true });
      expect(screen.getByText("Notifications blocked")).toBeTruthy();
      expect(screen.queryByText(ENABLE)).toBeNull();
    });

    it("explains Expo Go cannot schedule reminders", async () => {
      await renderBanner({ isExpoGo: true });
      expect(screen.getByText("Development build required")).toBeTruthy();
      expect(screen.queryByText(ENABLE)).toBeNull();
    });
  });

  describe("web", () => {
    beforeEach(() => {
      mockNotificationsOs.current = "web";
    });

    it("asks the user to tap Allow when no prompt could start", async () => {
      const perm = await renderBanner({ canEnableLocalReminders: false });
      await fireEvent.press(screen.getByText(ENABLE));
      expect(mockToast.info).toHaveBeenCalledWith(
        "Tap the Allow button below to enable browser notifications.",
      );
      expect(perm.requestPermission).not.toHaveBeenCalled();
    });

    it("registers web push after a granted prompt", async () => {
      setMockAuth({ session: { accessToken: "tok" }, isGuest: false });
      mockBeginResult = { pending: true };
      const perm = await renderBanner();
      await pressEnable();
      expect(perm.requestPermission).toHaveBeenCalledWith({
        webPermissionRequest: { pending: true },
      });
      expect(mockRegisterWebPush).toHaveBeenCalledWith("tok");
    });

    it("warns when the browser prompt is refused", async () => {
      await renderBanner({
        permission: "default",
        requestPermission: jest.fn(async () => ({ granted: false })),
      });
      await pressEnable();
      expect(mockToast.warning).toHaveBeenCalledWith(
        "Notifications blocked",
        "Turn notifications on in your browser or device settings.",
      );
    });

    it.each([
      ["chromium_full", {}, /Allow browser notifications/],
      ["chromium_full", { granted: true }, /Browser notifications are on/],
      ["chromium_full", { denied: true }, /Turn notifications on in your browser/],
      ["ios_webkit_installed", {}, /Allow browser notifications/],
      ["ios_webkit_installed", { granted: true }, /Reminders are scheduled on this device/],
      ["ios_webkit_installed", { denied: true }, /Open Settings and turn on notifications/],
      ["limited_web", {}, /Scheduled reminders run on iOS and Android/],
    ])("shows %s copy for %o", async (tier, perm, message) => {
      await renderBanner({ ...perm, webGuidance: { tier } }, true);
      expect(screen.getByText(message)).toBeTruthy();
      expect(screen.queryByText("Open Settings")).toBeNull();
    });

    it.each([
      [true, /Open this page in Safari/],
      [false, /In Safari: Share/],
    ])(
      "guides iOS Safari tabs to install (needsSafari=%s)",
      async (needsSafariForInstall, steps) => {
        await renderBanner({ webGuidance: { tier: "ios_webkit_tab", needsSafariForInstall } });
        expect(screen.getByText("Install the web app first")).toBeTruthy();
        expect(screen.getByText(steps)).toBeTruthy();
        expect(screen.queryByText(ENABLE)).toBeNull();
      },
    );
  });
});
