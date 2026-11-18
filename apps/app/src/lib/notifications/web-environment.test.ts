import {
  IPHONE_CHROME_UA,
  IPHONE_SAFARI_UA,
  installBrowser,
  useBrowser,
} from "@/test-support/browser";
import {
  mockNotificationsOs,
  resetSwitchableNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";
import { usePlatform } from "@/test-support/platform";

import {
  beginWebNotificationPermissionRequest,
  canRequestWebNotificationPermission,
  getWebNotificationBlockingReason,
  getWebNotificationGuidance,
  isSecureWebContext,
  isServiceWorkerSupported,
  isWebNotificationApiAvailable,
  readWebNotificationPermission,
} from "./web-environment";

jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").switchableNotificationsPlatformMock,
);

const notification = (permission: string, requestPermission = jest.fn(async () => "granted")) => ({
  permission,
  requestPermission,
});

beforeEach(resetSwitchableNotificationsPlatformMock);

describe("on native", () => {
  it("never blocks and never prompts", () => {
    expect(getWebNotificationBlockingReason()).toBeNull();
    expect(canRequestWebNotificationPermission()).toBe(false);
    expect(isWebNotificationApiAvailable()).toBe(false);
    expect(isServiceWorkerSupported()).toBe(false);
  });

  it("reports guidance without a browser matrix", () => {
    expect(getWebNotificationGuidance()).toEqual({
      tier: null,
      isIos: false,
      isInstalledPwa: false,
      needsSafariForInstall: false,
      blockingReason: null,
    });
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });
  beforeEach(() => {
    mockNotificationsOs.current = "web";
  });

  describe("desktop Chrome with notifications", () => {
    useBrowser({ notification: notification("default"), serviceWorker: {} });

    it("is unblocked and can prompt", () => {
      expect(getWebNotificationBlockingReason()).toBeNull();
      expect(canRequestWebNotificationPermission()).toBe(true);
      expect(isServiceWorkerSupported()).toBe(true);
      expect(isSecureWebContext()).toBe(true);
    });

    it("reports the chromium tier", () => {
      expect(getWebNotificationGuidance()).toMatchObject({ tier: "chromium_full", isIos: false });
    });

    it("starts the permission prompt", async () => {
      await expect(beginWebNotificationPermissionRequest()).resolves.toBe("granted");
    });
  });

  it.each(["granted", "denied"])("does not prompt once permission is %s", (permission) => {
    const restore = installBrowser({ notification: notification(permission) });
    try {
      expect(readWebNotificationPermission()).toBe(permission);
      expect(canRequestWebNotificationPermission()).toBe(false);
      expect(beginWebNotificationPermissionRequest()).toBeNull();
    } finally {
      restore();
    }
  });

  it("returns null when the prompt throws", () => {
    const restore = installBrowser({
      notification: notification(
        "default",
        jest.fn(() => {
          throw new Error("not a gesture");
        }),
      ),
    });
    try {
      expect(beginWebNotificationPermissionRequest()).toBeNull();
    } finally {
      restore();
    }
  });

  it("returns a synchronous legacy prompt result as-is", () => {
    const restore = installBrowser({
      notification: notification(
        "default",
        jest.fn(() => "denied"),
      ),
    });
    try {
      expect(beginWebNotificationPermissionRequest()).toBe("denied");
    } finally {
      restore();
    }
  });

  it("is unsupported without the Notification API", () => {
    const restore = installBrowser();
    try {
      expect(getWebNotificationBlockingReason()).toBe("unsupported");
      expect(readWebNotificationPermission()).toBeNull();
      expect(beginWebNotificationPermissionRequest()).toBeNull();
    } finally {
      restore();
    }
  });

  it("is unsupported in an insecure context", () => {
    const restore = installBrowser({ secureContext: false, notification: notification("default") });
    try {
      expect(isSecureWebContext()).toBe(false);
      expect(getWebNotificationBlockingReason()).toBe("unsupported");
    } finally {
      restore();
    }
  });

  it("requires an installed PWA in an iPhone Safari tab", () => {
    const restore = installBrowser({ userAgent: IPHONE_SAFARI_UA, platform: "iPhone" });
    try {
      expect(getWebNotificationBlockingReason()).toBe("ios_requires_pwa");
      expect(canRequestWebNotificationPermission()).toBe(false);
    } finally {
      restore();
    }
  });

  it("asks iPhone Chrome users to install from Safari", () => {
    const restore = installBrowser({ userAgent: IPHONE_CHROME_UA, platform: "iPhone" });
    try {
      expect(getWebNotificationGuidance()).toMatchObject({
        isIos: true,
        needsSafariForInstall: true,
        blockingReason: "ios_requires_pwa",
      });
    } finally {
      restore();
    }
  });
});
