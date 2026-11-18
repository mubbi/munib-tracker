import * as Localization from "expo-localization";

import { detectDeviceLocale } from "@/lib/device-locale";

const getLocales = jest.spyOn(Localization, "getLocales");
const locale = (languageTag: string) => ({ languageTag }) as Localization.Locale;

afterEach(() => getLocales.mockReset());

describe("detectDeviceLocale", () => {
  it("matches the most preferred supported device language", () => {
    getLocales.mockReturnValue([locale("xx-XX"), locale("ur-PK"), locale("en-US")]);
    expect(detectDeviceLocale()).toBe("ur");
  });

  it("returns null when no device language is supported", () => {
    getLocales.mockReturnValue([locale("xx-XX")]);
    expect(detectDeviceLocale()).toBeNull();
  });

  it("returns null when the locale API throws", () => {
    getLocales.mockImplementation(() => {
      throw new Error("unavailable");
    });
    expect(detectDeviceLocale()).toBeNull();
  });
});
