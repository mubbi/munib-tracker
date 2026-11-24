import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { LocationRepository } from "@/db/repositories/location-repository";
import {
  DEFAULT_LOCATION,
  getDeviceLocation,
  getLocationPermissionGranted,
  resolvePlaceFromCoordinates,
} from "@/lib/location";
import { buildLocationSearchResult, buildStoredLocation } from "@/test-support/fixtures/location";

import {
  locationStore,
  useLocation,
  useLocationActions,
  useLocationStatus,
} from "./location-store";

jest.mock("@/lib/location", () => ({
  ...jest.requireActual("@/lib/location"),
  getDeviceLocation: jest.fn(),
  getLocationPermissionGranted: jest.fn(),
  resolvePlaceFromCoordinates: jest.fn(),
}));

const mockDevice = getDeviceLocation as jest.Mock;
const mockPermission = getLocationPermissionGranted as jest.Mock;
const mockResolve = resolvePlaceFromCoordinates as jest.Mock;

const GPS_FIX = buildStoredLocation({ latitude: 40, longitude: 29, city: "Bursa" });

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  mockPermission.mockResolvedValue(false);
  mockDevice.mockResolvedValue({ status: "granted", location: GPS_FIX });
  locationStore.setState({ location: DEFAULT_LOCATION, status: "idle", isReady: false });
});

const state = () => locationStore.getState();

describe("load", () => {
  it("reads the cached location and stays put without permission", async () => {
    await LocationRepository.update(buildStoredLocation());
    await state().load();
    await waitFor(() => expect(mockPermission).toHaveBeenCalled());
    expect(state()).toMatchObject({ isReady: true, status: "ready", location: { city: "London" } });
    expect(mockDevice).not.toHaveBeenCalled();
  });
});

describe("refresh", () => {
  it("never replaces a manually chosen city", async () => {
    locationStore.setState({ location: buildStoredLocation({ source: "manual" }) });
    await state().refresh();
    expect(state().status).toBe("ready");
    expect(mockPermission).not.toHaveBeenCalled();
  });

  it("leaves a ready manual location untouched", async () => {
    locationStore.setState({
      location: buildStoredLocation({ source: "manual" }),
      status: "ready",
    });
    const before = state();
    await state().refresh();
    expect(state()).toBe(before);
  });

  it("does not prompt when permission was not granted", async () => {
    locationStore.setState({ status: "ready" });
    await state().refresh();
    expect(state().status).toBe("ready");
    expect(mockDevice).not.toHaveBeenCalled();
  });

  it("settles an idle store as ready when permission is missing", async () => {
    await state().refresh();
    expect(state().status).toBe("ready");
  });

  it("re-fetches a device fix when permission is granted", async () => {
    mockPermission.mockResolvedValue(true);
    await state().refresh();
    expect(state().location).toMatchObject({ city: "Bursa", latitude: 40 });
  });
  it("keeps a saved device fix when a silent refresh times out", async () => {
    mockPermission.mockResolvedValue(true);
    mockDevice.mockResolvedValue({ status: "error", reason: "timeout" });
    locationStore.setState({ location: GPS_FIX, status: "ready" });
    await state().refresh();
    expect(state()).toMatchObject({ status: "ready", location: { city: "Bursa" } });
  });

  it("still reports a timeout when there is no saved device fix", async () => {
    mockPermission.mockResolvedValue(true);
    mockDevice.mockResolvedValue({ status: "error", reason: "timeout" });
    await state().refresh();
    expect(state().status).toBe("error");
  });
});

describe("requestDeviceLocation", () => {
  it("stores the fix and marks ready", async () => {
    await state().requestDeviceLocation();
    expect(state()).toMatchObject({ status: "ready", location: { city: "Bursa" } });
    expect((await LocationRepository.get()).city).toBe("Bursa");
  });

  it.each(["denied", "error"] as const)("surfaces a %s result", async (status) => {
    mockDevice.mockResolvedValue({ status });
    await state().requestDeviceLocation();
    expect(state().status).toBe(status);
  });

  it("surfaces a timeout on an explicit request even with a saved fix", async () => {
    mockDevice.mockResolvedValue({ status: "error", reason: "timeout" });
    locationStore.setState({ location: GPS_FIX, status: "ready" });
    await state().requestDeviceLocation();
    expect(state().status).toBe("error");
  });

  it("ignores a second request while one is loading", async () => {
    locationStore.setState({ status: "loading" });
    await state().requestDeviceLocation();
    expect(mockDevice).not.toHaveBeenCalled();
  });
});

describe("setManualLocation", () => {
  it("applies the place optimistically, then the reverse-geocoded names", async () => {
    mockResolve.mockResolvedValue({
      city: "Karachi City",
      country: "PK",
      label: "Karachi City, PK",
    });
    await state().setManualLocation(buildLocationSearchResult());
    expect(state()).toMatchObject({
      status: "ready",
      location: {
        source: "manual",
        timeZone: "Asia/Karachi",
        city: "Karachi City",
        country: "PK",
        label: "Karachi City, PK",
      },
    });
  });

  it("keeps the search names when the geocoder finds nothing", async () => {
    mockResolve.mockResolvedValue({ label: "24.86, 67.00" });
    await state().setManualLocation(buildLocationSearchResult());
    expect(state().location).toMatchObject({
      city: "Karachi",
      country: "Pakistan",
      label: "Karachi, Pakistan",
    });
  });

  it("skips the second write when the geocoder agrees", async () => {
    mockResolve.mockResolvedValue({
      city: "Karachi",
      country: "Pakistan",
      label: "Karachi, Pakistan",
    });
    const update = jest.spyOn(LocationRepository, "update");
    await state().setManualLocation(buildLocationSearchResult());
    expect(update).toHaveBeenCalledTimes(1);
    update.mockRestore();
  });
  it("stores the ISO country code from search, else from the geocoder", async () => {
    mockResolve.mockResolvedValue({
      city: "Karachi",
      country: "Pakistan",
      countryCode: "PK",
      label: "Karachi, Pakistan",
    });
    await state().setManualLocation(buildLocationSearchResult({ countryCode: undefined }));
    expect(state().location.countryCode).toBe("PK");
    await state().setManualLocation(
      buildLocationSearchResult({ countryCode: "IN", name: "Delhi" }),
    );
    expect(state().location.countryCode).toBe("IN");
  });
});

describe("backfillCountryCode", () => {
  it("adds the code to an older saved place without touching its label", async () => {
    const saved = await LocationRepository.update(
      buildStoredLocation({ source: "manual", label: "My city", countryCode: undefined }),
    );
    locationStore.setState({ location: saved });
    mockResolve.mockResolvedValue({
      city: "London",
      country: "UK",
      countryCode: "GB",
      label: "London, UK",
    });
    await state().backfillCountryCode();
    expect(state().location).toMatchObject({ countryCode: "GB", label: "My city" });
  });

  it("does nothing for the Makkah default or when the geocoder has no code", async () => {
    await state().backfillCountryCode();
    expect(mockResolve).not.toHaveBeenCalled();
    locationStore.setState({ location: buildStoredLocation({ source: "device" }) });
    mockResolve.mockRejectedValue(new Error("offline"));
    await expect(state().backfillCountryCode()).resolves.toBeUndefined();
    expect(state().location.countryCode).toBeUndefined();
  });
});

describe("calculation settings", () => {
  it.each([
    ["setMethod", "method", "Karachi"],
    ["setMadhab", "madhab", "hanafi"],
    ["setHighLatitudeRule", "highLatitudeRule", "SeventhOfTheNight"],
  ] as const)("%s persists %s", async (action, field, value) => {
    await (state()[action] as (v: string) => Promise<void>)(value);
    expect(state().location[field]).toBe(value);
    expect((await LocationRepository.get())[field]).toBe(value);
  });

  it("setPrayerAdjustment sets and clears a per-salah offset", async () => {
    await state().setPrayerAdjustment("fajr", 5);
    await state().setPrayerAdjustment("isha", -3);
    await state().setPrayerAdjustment("fajr", 0);
    expect(state().location.prayerAdjustments).toEqual({ isha: -3 });
  });
});

describe("hooks", () => {
  it("expose location and status and route every action", async () => {
    mockResolve.mockResolvedValue({ label: "x" });
    const { result } = await renderHook(() => ({
      location: useLocation(),
      status: useLocationStatus(),
      actions: useLocationActions(),
    }));

    await act(async () => {
      await result.current.actions.load();
      await result.current.actions.refresh();
      await result.current.actions.requestDeviceLocation();
      await result.current.actions.setMethod("Karachi");
      await result.current.actions.setMadhab("hanafi");
      await result.current.actions.setHighLatitudeRule("TwilightAngle");
      await result.current.actions.setPrayerAdjustment("dhuhr", 2);
      await result.current.actions.setManualLocation(buildLocationSearchResult());
    });

    expect(result.current.status).toBe("ready");
    expect(result.current.location).toMatchObject({
      source: "manual",
      method: "Karachi",
      madhab: "hanafi",
      highLatitudeRule: "TwilightAngle",
      prayerAdjustments: { dhuhr: 2 },
    });
  });
});
