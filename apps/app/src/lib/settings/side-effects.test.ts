import { act } from "@testing-library/react-native";

import * as I18n from "@/i18n";
import { rescheduleAll } from "@/notifications/scheduler";
import { preferencesStore } from "@/stores/preferences-store";
import { resetSettingsStores } from "@/test-support/settings";

import { getSetting } from "./registry";
import { runSideEffects } from "./side-effects";
import { writeSetting } from "./use-setting";

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

let changeAppLocale: jest.SpyInstance;

beforeEach(async () => {
  await resetSettingsStores();
  // Keep the real catalogs; only observe the locale switch.
  changeAppLocale = jest.spyOn(I18n, "changeAppLocale").mockResolvedValue(false);
  jest.mocked(rescheduleAll).mockClear();
});

afterEach(() => {
  changeAppLocale.mockRestore();
});

describe("reload-locale side effect (plan §4.5, language.app)", () => {
  const appLanguage = () => {
    const def = getSetting("language.app");
    if (!def) throw new Error("language.app is not registered");
    return def;
  };

  it("is declared on the app-language setting", () => {
    expect(appLanguage().sideEffects).toContain("reload-locale");
  });

  it("writing the setting reloads the locale exactly once and persists it", async () => {
    await act(async () => {
      await writeSetting(appLanguage(), "fr");
    });
    expect(changeAppLocale).toHaveBeenCalledTimes(1);
    expect(changeAppLocale).toHaveBeenCalledWith("fr");
    expect(preferencesStore.getState().prefs.locale).toBe("fr");
  });

  it("runSideEffects doesn't reload a second time or reschedule for reload-locale alone", async () => {
    await runSideEffects(["reload-locale"]);
    expect(changeAppLocale).not.toHaveBeenCalled();
    expect(rescheduleAll).not.toHaveBeenCalled();
  });
});
