import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";

import {
  INSTALL_PROMPT_DISMISS_KEY,
  InstallPromptBanner,
} from "@/components/pwa/install-prompt-banner";
import {
  isInstallPromptAvailable,
  listenForInstallPrompt,
  promptInstall,
  resetInstallPromptForTests,
} from "@/components/pwa/install-prompt-store";
import { DESKTOP_FIREFOX_UA, installBrowser } from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const TITLE = "Install the app";

type Outcome = "accepted" | "dismissed";

const MAC_SAFARI_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15";
const ANDROID_FIREFOX_UA = "Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0";

/** Window stand-in that can dispatch the Chromium install events. */
function setupBrowser({
  standalone = false,
  userAgent,
}: {
  standalone?: boolean;
  userAgent?: string;
} = {}) {
  const target = new EventTarget();
  const restore = installBrowser({
    standalone,
    userAgent,
    window: {
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
    },
  });
  const firePrompt = (outcome: Outcome = "accepted") => {
    const prompt = jest.fn(async () => undefined);
    const event = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt,
      userChoice: Promise.resolve({ outcome }),
    });
    target.dispatchEvent(event);
    return { event, prompt };
  };
  const fireInstalled = () => target.dispatchEvent(new Event("appinstalled"));
  return { restore, firePrompt, fireInstalled };
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("install prompt store", () => {
  let browser: ReturnType<typeof setupBrowser>;

  beforeEach(() => {
    browser = setupBrowser();
    resetInstallPromptForTests();
  });
  afterEach(() => {
    resetInstallPromptForTests();
    browser.restore();
  });

  it("ignores the event off web", () => {
    listenForInstallPrompt();
    browser.firePrompt();
    expect(isInstallPromptAvailable()).toBe(false);
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("captures the prompt and suppresses the browser's own infobar", () => {
      listenForInstallPrompt();
      const { event } = browser.firePrompt();
      expect(event.defaultPrevented).toBe(true);
      expect(isInstallPromptAvailable()).toBe(true);
    });

    it("listens only once", () => {
      const stop = listenForInstallPrompt();
      expect(listenForInstallPrompt()).toBe(stop);
      stop();
      browser.firePrompt();
      expect(isInstallPromptAvailable()).toBe(false);
    });

    it("uses the prompt once and reports the outcome", async () => {
      listenForInstallPrompt();
      const { prompt } = browser.firePrompt("dismissed");
      await expect(promptInstall()).resolves.toBe("dismissed");
      expect(prompt).toHaveBeenCalledTimes(1);
      expect(isInstallPromptAvailable()).toBe(false);
      await expect(promptInstall()).resolves.toBe("unavailable");
    });

    it("treats a failing prompt as dismissed", async () => {
      listenForInstallPrompt();
      const { prompt } = browser.firePrompt();
      prompt.mockRejectedValueOnce(new Error("not allowed"));
      await expect(promptInstall()).resolves.toBe("dismissed");
    });

    it("forgets the prompt once the app is installed", () => {
      listenForInstallPrompt();
      browser.firePrompt();
      browser.fireInstalled();
      expect(isInstallPromptAvailable()).toBe(false);
    });
  });
});

describe("InstallPromptBanner", () => {
  let browser: ReturnType<typeof setupBrowser>;

  beforeEach(async () => {
    resetInstallPromptForTests();
    await AsyncStorage.clear();
  });
  afterEach(() => {
    resetInstallPromptForTests();
    browser?.restore();
  });

  async function renderBanner(options?: { standalone?: boolean; userAgent?: string }) {
    browser = setupBrowser(options);
    await renderWithTheme(<InstallPromptBanner />);
    await flush();
  }

  it("never shows on native", async () => {
    await renderBanner();
    await act(async () => {
      browser.firePrompt();
    });
    expect(screen.queryByText(TITLE)).toBeNull();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("waits for the browser to offer an install", async () => {
      await renderBanner();
      expect(screen.queryByText(TITLE)).toBeNull();

      await act(async () => {
        browser.firePrompt();
      });
      expect(screen.getByText(TITLE)).toBeTruthy();
    });

    it("opens the browser's install dialog from Install", async () => {
      await renderBanner();
      const { prompt } = await act(async () => browser.firePrompt());

      await fireEvent.press(screen.getByText("Install"));
      await flush();

      expect(prompt).toHaveBeenCalledTimes(1);
      // The event is single-use, so the banner goes away.
      expect(screen.queryByText(TITLE)).toBeNull();
    });

    it("remembers a dismissal", async () => {
      await renderBanner();
      await act(async () => {
        browser.firePrompt();
      });

      await fireEvent.press(screen.getByLabelText("Dismiss"));

      expect(screen.queryByText(TITLE)).toBeNull();
      expect(await AsyncStorage.getItem(INSTALL_PROMPT_DISMISS_KEY)).toBe("1");
    });

    it("stays hidden after a previous dismissal", async () => {
      await AsyncStorage.setItem(INSTALL_PROMPT_DISMISS_KEY, "1");
      await renderBanner();
      await act(async () => {
        browser.firePrompt();
      });
      expect(screen.queryByText(TITLE)).toBeNull();
    });

    it("shows File → Add to Dock steps in Safari on macOS", async () => {
      await renderBanner({ userAgent: MAC_SAFARI_UA });
      expect(screen.getByText(TITLE)).toBeTruthy();
      expect(screen.getByText(/File → Add to Dock/)).toBeTruthy();
      expect(screen.queryByText("Install")).toBeNull();
    });

    it("shows browser-menu steps in Firefox on Android", async () => {
      await renderBanner({ userAgent: ANDROID_FIREFOX_UA });
      expect(screen.getByText(/Open the browser menu/)).toBeTruthy();
    });

    it("remembers a dismissal of the manual steps", async () => {
      await renderBanner({ userAgent: MAC_SAFARI_UA });
      await fireEvent.press(screen.getByLabelText("Dismiss"));
      expect(screen.queryByText(TITLE)).toBeNull();
      expect(await AsyncStorage.getItem(INSTALL_PROMPT_DISMISS_KEY)).toBe("1");
    });

    it("shows nothing where the browser can't install (desktop Firefox)", async () => {
      await renderBanner({ userAgent: DESKTOP_FIREFOX_UA });
      expect(screen.queryByText(TITLE)).toBeNull();
    });

    it("stays hidden inside the installed app", async () => {
      await renderBanner({ standalone: true });
      await act(async () => {
        browser.firePrompt();
      });
      expect(screen.queryByText(TITLE)).toBeNull();
    });
  });
});
