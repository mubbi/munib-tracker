import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

import { openDirections } from "./open-directions";

jest.mock("expo-linking", () => ({ openURL: jest.fn() }));
jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

const openURL = Linking.openURL as jest.Mock;
const openBrowserAsync = WebBrowser.openBrowserAsync as jest.Mock;
const target = { lat: 24.86, lon: 67.01, name: "Masjid" };
const WEB_URL = "https://www.google.com/maps/dir/?api=1&destination=24.860000%2C67.010000";
const APP_URL = "comgooglemaps://?daddr=24.860000%2C67.010000";

const originalOS = Platform.OS;
const setOS = (os: typeof Platform.OS) =>
  Object.defineProperty(Platform, "OS", { value: os, configurable: true });

afterEach(() => {
  setOS(originalOS);
  openURL.mockReset();
  openBrowserAsync.mockReset();
  jest.restoreAllMocks();
});

describe("openDirections", () => {
  it("opens the Google Maps app on iOS when it is installed", async () => {
    setOS("ios");
    openURL.mockResolvedValue(true);
    await openDirections(target);
    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(APP_URL);
  });

  it("falls back to Google Maps in the in-app browser on iOS without the app", async () => {
    setOS("ios");
    openURL.mockRejectedValueOnce(new Error("Unable to open URL"));
    openBrowserAsync.mockResolvedValue({ type: "opened" });
    await openDirections(target);
    expect(openURL).toHaveBeenCalledTimes(1);
    expect(openURL).toHaveBeenCalledWith(APP_URL);
    expect(openBrowserAsync).toHaveBeenCalledWith(WEB_URL);
  });

  it("uses the https app link on Android", async () => {
    setOS("android");
    openURL.mockResolvedValue(true);
    await openDirections(target);
    expect(openURL).toHaveBeenCalledWith(WEB_URL);
  });

  it("opens a new tab on web and detaches it from this page", async () => {
    setOS("web");
    const tab = { opener: {} as unknown };
    const open = jest.fn().mockReturnValue(tab);
    // Jest's environment has no browser `window`; stub just what the web path uses.
    const hadWindow = "window" in globalThis;
    const previous = (globalThis as { window?: unknown }).window;
    Object.defineProperty(globalThis, "window", { value: { open }, configurable: true });
    try {
      await openDirections(target);
    } finally {
      if (hadWindow)
        Object.defineProperty(globalThis, "window", { value: previous, configurable: true });
      else delete (globalThis as { window?: unknown }).window;
    }
    expect(open).toHaveBeenCalledWith(WEB_URL, "_blank");
    expect(tab.opener).toBeNull();
    expect(openURL).not.toHaveBeenCalled();
  });
});
