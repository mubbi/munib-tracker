import { render } from "@testing-library/react-native";

import { LocalePathBootstrap } from "@/components/locale-path-bootstrap";
import { changeAppLocale } from "@/i18n";
import { MUNIB_LOCALE_BOOT_KEY } from "@/lib/locale-path";
import { preferencesStore } from "@/stores/preferences-store";
import { installBrowser } from "@/test-support/browser";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { setPreferences } from "@/test-support/preferences";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/i18n", () => ({ changeAppLocale: jest.fn(async () => {}) }));

const realUpdate = preferencesStore.getState().update;
const update = jest.fn(async () => {});

/** A fake session store + URL for the boot script's hand-off. */
const visit = (pathname: string, bootLocale: string | null = null) => {
  const store = new Map<string, string>(bootLocale ? [[MUNIB_LOCALE_BOOT_KEY, bootLocale]] : []);
  return installBrowser({
    window: {
      location: { pathname },
      sessionStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        removeItem: (key: string) => store.delete(key),
      },
    },
  });
};

let restoreBrowser = () => {};

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  preferencesStore.setState({ update });
});
afterEach(async () => {
  restoreBrowser();
  preferencesStore.setState({ update: realUpdate });
  await setPreferences();
});

describe("LocalePathBootstrap on native", () => {
  it("never touches the locale", async () => {
    await render(<LocalePathBootstrap />);

    expect(changeAppLocale).not.toHaveBeenCalled();
  });
});

describe("LocalePathBootstrap on web", () => {
  usePlatform({ OS: "web" });

  it("applies the locale from a prefixed URL and strips the prefix", async () => {
    restoreBrowser = visit("/ar/quran");
    await render(<LocalePathBootstrap />);

    expect(update).toHaveBeenCalledWith({ locale: "ar", translationLocale: "ar" });
    expect(changeAppLocale).toHaveBeenCalledWith("ar");
    expect(mockRouter.replace).toHaveBeenCalledWith("/quran");
  });

  it("prefers the locale handed off by the boot script", async () => {
    restoreBrowser = visit("/quran", "ur");
    await render(<LocalePathBootstrap />);

    expect(changeAppLocale).toHaveBeenCalledWith("ur");
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("ignores an unknown boot locale", async () => {
    restoreBrowser = visit("/quran", "xx");
    await render(<LocalePathBootstrap />);

    expect(changeAppLocale).not.toHaveBeenCalled();
  });

  it("skips the update when the locale already matches", async () => {
    await setPreferences({ locale: "ar", translationLocale: "ar" });
    restoreBrowser = visit("/ar");
    await render(<LocalePathBootstrap />);

    expect(update).not.toHaveBeenCalled();
  });
});
