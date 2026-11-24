import { Linking, PermissionsAndroid } from "react-native";

import { type PlatformOverrides, setPlatform } from "@/test-support/platform";

jest.mock("./native", () => ({
  nearbyAuthorizationStatus: jest.fn(() => "notDetermined"),
  requestNearbyAuthorization: jest.fn(async () => "granted"),
}));

import { nearbyAuthorizationStatus, requestNearbyAuthorization } from "./native";
import {
  androidNearbyPermission,
  checkNearbyPermission,
  nearbyScanNeedsLocationServices,
  openBluetoothSettings,
  requestNearbyPermission,
} from "./permissions";

let restore: () => void = () => {};
afterEach(() => {
  restore();
  jest.restoreAllMocks();
});

function on(platform: PlatformOverrides & { Version?: number }) {
  const { Version, ...rest } = platform;
  const undo = setPlatform(rest);
  const { Platform } = require("react-native");
  const previous = Object.getOwnPropertyDescriptor(Platform, "Version");
  if (Version !== undefined) {
    Object.defineProperty(Platform, "Version", { configurable: true, get: () => Version });
  }
  restore = () => {
    if (previous) Object.defineProperty(Platform, "Version", previous);
    undo();
  };
}

describe("androidNearbyPermission", () => {
  it("uses the Android 12+ Bluetooth permissions per role", () => {
    expect(androidNearbyPermission("advertise", 31)).toBe(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    );
    expect(androidNearbyPermission("scan", 34)).toBe(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
  });

  it("needs fine location only to scan on Android ≤ 11, nothing to advertise", () => {
    expect(androidNearbyPermission("scan", 30)).toBe(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    expect(androidNearbyPermission("advertise", 29)).toBeNull();
  });
});

describe("Android", () => {
  it("asks for BLUETOOTH_SCAN and maps the answers", async () => {
    on({ OS: "android", Version: 33 });
    const request = jest.spyOn(PermissionsAndroid, "request");
    request.mockResolvedValueOnce(PermissionsAndroid.RESULTS.GRANTED);
    expect(await requestNearbyPermission("scan")).toBe("granted");
    expect(request).toHaveBeenLastCalledWith(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
    request.mockResolvedValueOnce(PermissionsAndroid.RESULTS.DENIED);
    expect(await requestNearbyPermission("scan")).toBe("denied");
    request.mockResolvedValueOnce(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);
    expect(await requestNearbyPermission("scan")).toBe("blocked");
  });

  it("treats an unchecked permission as askable and skips advertise on Android ≤ 11", async () => {
    on({ OS: "android", Version: 30 });
    jest.spyOn(PermissionsAndroid, "check").mockResolvedValue(false);
    expect(await checkNearbyPermission("scan")).toBe("notDetermined");
    expect(await checkNearbyPermission("advertise")).toBe("granted");
    expect(nearbyScanNeedsLocationServices(30)).toBe(true);
    expect(nearbyScanNeedsLocationServices(31)).toBe(false);
  });

  it("opens the system Bluetooth screen", async () => {
    on({ OS: "android", Version: 34 });
    const send = jest.spyOn(Linking, "sendIntent").mockResolvedValue(undefined);
    expect(await openBluetoothSettings()).toBe(true);
    expect(send).toHaveBeenCalledWith("android.settings.BLUETOOTH_SETTINGS");
  });
});

describe("iOS", () => {
  it("maps CoreBluetooth authorization; a denial can't be re-asked", async () => {
    on({ OS: "ios" });
    jest.mocked(nearbyAuthorizationStatus).mockReturnValueOnce("notDetermined");
    expect(await checkNearbyPermission("scan")).toBe("notDetermined");
    jest.mocked(nearbyAuthorizationStatus).mockReturnValueOnce("denied");
    expect(await checkNearbyPermission("advertise")).toBe("blocked");
    jest.mocked(requestNearbyAuthorization).mockResolvedValueOnce("denied");
    expect(await requestNearbyPermission("scan")).toBe("blocked");
    expect(await openBluetoothSettings()).toBe(false);
  });
});

it("is blocked on web", async () => {
  on({ OS: "web" });
  expect(await checkNearbyPermission("scan")).toBe("blocked");
  expect(await requestNearbyPermission("scan")).toBe("blocked");
});
