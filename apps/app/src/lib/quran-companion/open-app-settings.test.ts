import { Linking } from "react-native";

import { usePlatform } from "@/test-support/platform";

import { arabicWordRowStyle } from "./arabic-row";
import { canOpenAppSettings, openAppSettings } from "./open-app-settings";

describe("openAppSettings on native", () => {
  let openSettings: jest.SpyInstance;
  beforeEach(() => {
    openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue(undefined);
  });
  afterEach(() => openSettings.mockRestore());

  it("opens the OS settings", async () => {
    expect(canOpenAppSettings()).toBe(true);
    expect(await openAppSettings()).toBe(true);
    expect(openSettings).toHaveBeenCalled();
  });

  it("returns false when opening fails", async () => {
    openSettings.mockRejectedValueOnce(new Error("no settings"));
    expect(await openAppSettings()).toBe(false);
  });
});

describe("openAppSettings on web", () => {
  usePlatform({ OS: "web" });

  it("is not possible", async () => {
    expect(canOpenAppSettings()).toBe(false);
    expect(await openAppSettings()).toBe(false);
  });
});

describe("arabicWordRowStyle", () => {
  it("pins row-reverse LTR on native", () => {
    expect(arabicWordRowStyle(true)).toEqual({ flexDirection: "row-reverse", direction: "ltr" });
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it.each([
      [true, "row"],
      [false, "row-reverse"],
    ])("rtl=%p uses %s", (rtl, flexDirection) => {
      expect(arabicWordRowStyle(rtl)).toEqual({ flexDirection });
    });
  });
});
