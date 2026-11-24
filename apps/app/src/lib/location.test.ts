import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { DB_KEYS } from "@/db/keys";
import {
  clearReverseGeocodeMemoryCache,
  coordsMatchCache,
  DEFAULT_LOCATION,
  getDeviceLocation,
  getLocationPermissionGranted,
  locationCalcExtras,
  normalizeCountryCode,
  resolvePlaceFromCoordinates,
  reverseGeocodeCacheKey,
  searchLocations,
} from "@/lib/location";
import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { usePlatformSwitch } from "@/test-support/platform";

const mockRequestPermissions = Location.requestForegroundPermissionsAsync as jest.MockedFunction<
  typeof Location.requestForegroundPermissionsAsync
>;
const mockGetCurrentPosition = Location.getCurrentPositionAsync as jest.MockedFunction<
  typeof Location.getCurrentPositionAsync
>;
const mockGetLastKnown = Location.getLastKnownPositionAsync as jest.MockedFunction<
  typeof Location.getLastKnownPositionAsync
>;

const KARACHI = {
  id: 1174872,
  name: "Karachi",
  latitude: 24.8608,
  longitude: 67.0011,
  country: "Pakistan",
  country_code: "PK",
  admin1: "Sindh",
};

beforeEach(() => {
  // The OS geocoder finds nothing, so `lib/location` falls through to the
  // (mocked) BigDataCloud fetch — the path these suites exercise. The global
  // jest.setup mock returns an empty hit instead, to keep other suites offline.
  jest.mocked(Location.reverseGeocodeAsync).mockResolvedValue([]);
});

afterEach(() => {
  jest.clearAllMocks();
  clearReverseGeocodeMemoryCache();
});

describe("reverseGeocodeCacheKey", () => {
  it("buckets nearby coordinates to the same key", () => {
    const keyA = reverseGeocodeCacheKey(24.8608, 67.0011);
    const keyB = reverseGeocodeCacheKey(24.8612, 67.0014);
    expect(keyA).toBe(keyB);
  });
});

describe("coordsMatchCache", () => {
  it("matches coordinates in the same cache bucket", () => {
    expect(coordsMatchCache({ latitude: 24.8608, longitude: 67.0011 }, 24.8612, 67.0014)).toBe(
      true,
    );
    expect(coordsMatchCache({ latitude: 24.8608, longitude: 67.0011 }, 25.12, 67.0011)).toBe(false);
  });
});

describe("getDeviceLocation", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    mockRequestPermissions.mockResolvedValue({ status: "granted" } as Awaited<
      ReturnType<typeof Location.requestForegroundPermissionsAsync>
    >);
    mockGetCurrentPosition.mockResolvedValue({
      coords: {
        latitude: 24.8608,
        longitude: 67.0011,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });
    mockGetLastKnown.mockResolvedValue(null);
  });

  it("reuses stored place data when the fix is in the same cache bucket", async () => {
    const fetchMock = mockFetch();

    const result = await getDeviceLocation({
      latitude: 24.8608,
      longitude: 67.0011,
      city: "Karachi",
      country: "Pakistan",
      countryCode: "PK",
    });

    expect(result.status).toBe("granted");
    if (result.status === "granted") {
      expect(result.location.countryCode).toBe("PK");
      expect(result.location.city).toBe("Karachi");
      expect(result.location.country).toBe("Pakistan");
      expect(result.location.label).toBe("Karachi, Pakistan");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reads reverse-geocode results from AsyncStorage on cache hit", async () => {
    const key = reverseGeocodeCacheKey(24.8608, 67.0011);
    await AsyncStorage.setItem(
      DB_KEYS.reverseGeocodeCache,
      JSON.stringify({ [key]: { city: "Karachi", country: "Pakistan", countryCode: "PK" } }),
    );
    const fetchMock = mockFetch();

    const result = await getDeviceLocation();

    expect(result.status).toBe("granted");
    if (result.status === "granted") {
      expect(result.location.label).toBe("Karachi, Pakistan");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("dedupes concurrent reverse-geocode requests for the same coordinates", async () => {
    const fetchMock = mockFetch(fakeResponse({ city: "Karachi", countryName: "Pakistan" }));

    const [a, b, c] = await Promise.all([
      getDeviceLocation(),
      getDeviceLocation(),
      getDeviceLocation(),
    ]);

    expect(a.status).toBe("granted");
    expect(b.status).toBe("granted");
    expect(c.status).toBe("granted");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("resolvePlaceFromCoordinates", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("returns a cached label without hitting the network", async () => {
    const key = reverseGeocodeCacheKey(24.8608, 67.0011);
    await AsyncStorage.setItem(
      DB_KEYS.reverseGeocodeCache,
      JSON.stringify({ [key]: { city: "Karachi", country: "Pakistan", countryCode: "PK" } }),
    );
    const fetchMock = mockFetch();

    const place = await resolvePlaceFromCoordinates(24.8608, 67.0011);

    expect(place).toEqual({
      city: "Karachi",
      country: "Pakistan",
      countryCode: "PK",
      label: "Karachi, Pakistan",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-geocodes a cached place saved before country codes, once", async () => {
    const key = reverseGeocodeCacheKey(24.8608, 67.0011);
    await AsyncStorage.setItem(
      DB_KEYS.reverseGeocodeCache,
      JSON.stringify({ [key]: { city: "Karachi", country: "Pakistan" } }),
    );
    const fetchMock = mockFetch(
      fakeResponse({ city: "Karachi", countryName: "Pakistan", countryCode: "pk" }),
    );

    expect((await resolvePlaceFromCoordinates(24.8608, 67.0011)).countryCode).toBe("PK");
    expect((await resolvePlaceFromCoordinates(24.8608, 67.0011)).countryCode).toBe("PK");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps the old cached name when the refresh fails (never blocks)", async () => {
    const key = reverseGeocodeCacheKey(24.8608, 67.0011);
    await AsyncStorage.setItem(
      DB_KEYS.reverseGeocodeCache,
      JSON.stringify({ [key]: { city: "Karachi", country: "Pakistan" } }),
    );
    mockFetch(new Error("offline"));
    const place = await resolvePlaceFromCoordinates(24.8608, 67.0011);
    expect(place.label).toBe("Karachi, Pakistan");
    expect(place.countryCode).toBeUndefined();
  });

  it("falls back to coordinates when reverse geocoding fails", async () => {
    mockFetch(new Error("offline"));

    const place = await resolvePlaceFromCoordinates(12.34, 56.78);

    expect(place.label).toBe("12.34, 56.78");
  });
});

describe("reverse geocode timeout", () => {
  afterEach(() => {
    jest.useRealTimers();
    jest.mocked(globalThis.fetch).mockRestore?.();
  });

  it("gives up on an unanswered geocoder request and falls back to coordinates", async () => {
    jest.useFakeTimers();
    const fetchMock = jest.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
        }),
    );
    jest.spyOn(globalThis, "fetch").mockImplementation(fetchMock as unknown as typeof fetch);

    const pending = resolvePlaceFromCoordinates(-33.91, 18.42);
    await jest.advanceTimersByTimeAsync(8_000);

    await expect(pending).resolves.toMatchObject({ label: "-33.91, 18.42" });
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeDefined();
  });
});

describe("searchLocations", () => {
  it("skips the network for queries shorter than two characters", async () => {
    const fetchMock = mockFetch(fakeResponse({ results: [] }));
    expect(await searchLocations("k")).toEqual([]);
    expect(await searchLocations("  ")).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps geocoder rows into display-ready results", async () => {
    mockFetch(fakeResponse({ results: [KARACHI] }));
    const [result] = await searchLocations("karachi");
    expect(result).toEqual({
      id: "1174872",
      name: "Karachi",
      admin: "Sindh",
      country: "Pakistan",
      countryCode: "PK",
      latitude: 24.8608,
      longitude: 67.0011,
      label: "Karachi, Pakistan",
    });
  });

  it("drops the region when it merely repeats the city name", async () => {
    mockFetch(fakeResponse({ results: [{ ...KARACHI, name: "Sindh", admin1: "Sindh" }] }));
    const [result] = await searchLocations("sindh");
    expect(result.admin).toBeUndefined();
  });

  it("encodes the query and requests up to ten results", async () => {
    const fetchMock = mockFetch(fakeResponse({ results: [] }));
    await searchLocations("São Paulo");
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("name=S%C3%A3o%20Paulo");
    expect(url).toContain("count=10");
  });

  it("returns [] on a non-ok response", async () => {
    mockFetch(fakeResponse({}, { status: 500 }));
    expect(await searchLocations("karachi")).toEqual([]);
  });

  it("returns [] when the request throws (offline / aborted)", async () => {
    mockFetch(new Error("network"));
    expect(await searchLocations("karachi")).toEqual([]);
  });

  it("tolerates a payload with no results array", async () => {
    mockFetch(fakeResponse({}));
    expect(await searchLocations("zzzzzz")).toEqual([]);
  });
});

describe("location extras", () => {
  const mockReverseGeocode = Location.reverseGeocodeAsync as jest.MockedFunction<
    typeof Location.reverseGeocodeAsync
  >;
  const mockGetPermissions = Location.getForegroundPermissionsAsync as jest.MockedFunction<
    typeof Location.getForegroundPermissionsAsync
  >;
  const onPlatform = usePlatformSwitch();
  const position = (latitude: number, longitude: number) =>
    ({
      coords: {
        latitude,
        longitude,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: 0,
    }) as Location.LocationObject;

  beforeEach(async () => {
    await AsyncStorage.clear();
    mockRequestPermissions.mockResolvedValue({ status: "granted" } as never);
    mockGetCurrentPosition.mockResolvedValue(position(10.5, 20.5));
    mockGetLastKnown.mockResolvedValue(null);
    mockReverseGeocode.mockResolvedValue([]);
  });

  afterEach(() => jest.useRealTimers());

  it("locationCalcExtras bundles the high-latitude rule and offsets", () => {
    expect(
      locationCalcExtras({
        ...DEFAULT_LOCATION,
        highLatitudeRule: "seventhofthenight" as never,
        prayerAdjustments: { fajr: 2 } as never,
      }),
    ).toEqual({ highLatitudeRule: "seventhofthenight", adjustments: { fajr: 2 } });
    expect(locationCalcExtras(DEFAULT_LOCATION)).toEqual({
      highLatitudeRule: undefined,
      adjustments: undefined,
    });
  });

  describe("getLocationPermissionGranted", () => {
    it("reflects the current permission without prompting", async () => {
      mockGetPermissions.mockResolvedValueOnce({ status: "granted" } as never);
      await expect(getLocationPermissionGranted()).resolves.toBe(true);
      mockGetPermissions.mockResolvedValueOnce({ status: "denied" } as never);
      await expect(getLocationPermissionGranted()).resolves.toBe(false);
      expect(mockRequestPermissions).not.toHaveBeenCalled();
    });

    it("is false when the check throws or on TV", async () => {
      mockGetPermissions.mockRejectedValueOnce(new Error("no module"));
      await expect(getLocationPermissionGranted()).resolves.toBe(false);
      onPlatform({ isTV: true });
      await expect(getLocationPermissionGranted()).resolves.toBe(false);
    });
  });

  describe("getDeviceLocation", () => {
    it("never uses GPS on TV", async () => {
      onPlatform({ isTV: true });
      await expect(getDeviceLocation()).resolves.toEqual({ status: "denied" });
      expect(mockRequestPermissions).not.toHaveBeenCalled();
    });

    it("returns denied when permission is refused", async () => {
      mockRequestPermissions.mockResolvedValueOnce({ status: "denied" } as never);
      await expect(getDeviceLocation()).resolves.toEqual({ status: "denied" });
    });

    it("uses the OS geocoder on native with city fallbacks", async () => {
      const fetchMock = mockFetch();
      mockReverseGeocode.mockResolvedValueOnce([
        { city: null, subregion: null, district: "Saddar", country: "Pakistan" } as never,
      ]);
      const result = await getDeviceLocation();
      expect(result).toEqual({
        status: "granted",
        location: expect.objectContaining({
          city: "Saddar",
          country: "Pakistan",
          label: "Saddar, Pakistan",
          source: "device",
          timeZone: undefined,
        }),
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("ignores a stored place without a name even in the same bucket", async () => {
      mockReverseGeocode.mockResolvedValueOnce([
        { city: null, subregion: "Sub", district: null, country: null } as never,
      ]);
      const result = await getDeviceLocation({ latitude: 10.5, longitude: 20.5 });
      expect(result.status === "granted" && result.location.label).toBe("Sub");
    });

    it("falls back to the network when the OS geocoder throws", async () => {
      mockReverseGeocode.mockRejectedValueOnce(new Error("geocoder unavailable"));
      mockFetch(fakeResponse({ locality: "Town", countryName: "" }));
      const result = await getDeviceLocation();
      expect(result.status === "granted" && result.location).toEqual(
        expect.objectContaining({ city: "Town", country: undefined, label: "Town" }),
      );
    });

    it("labels by coordinates when the network geocoder is not ok or empty", async () => {
      mockFetch(fakeResponse({}, { status: 500 }));
      const a = await getDeviceLocation();
      expect(a.status === "granted" && a.location.label).toBe("10.50, 20.50");
      mockFetch(fakeResponse({}));
      clearReverseGeocodeMemoryCache();
      const b = await getDeviceLocation();
      expect(b.status === "granted" && b.location.city).toBeUndefined();
    });

    it("skips the OS geocoder on web", async () => {
      onPlatform({ OS: "web" });
      const fetchMock = mockFetch(fakeResponse({ city: "Web City", countryName: "Webland" }));
      const result = await getDeviceLocation();
      expect(mockReverseGeocode).not.toHaveBeenCalled();
      expect(result.status === "granted" && result.location.label).toBe("Web City, Webland");
      // Memory cache hit on the next lookup.
      await resolvePlaceFromCoordinates(10.5, 20.5);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("falls back to the last known fix when GPS times out", async () => {
      jest.useFakeTimers();
      mockGetCurrentPosition.mockReturnValue(new Promise(() => {}));
      mockGetLastKnown.mockResolvedValueOnce(position(30, 40));
      mockReverseGeocode.mockResolvedValueOnce([{ city: "Last", country: "Known" } as never]);
      const pending = getDeviceLocation();
      await jest.advanceTimersByTimeAsync(10_000);
      const result = await pending;
      expect(result.status === "granted" && result.location).toEqual(
        expect.objectContaining({ latitude: 30, longitude: 40, label: "Last, Known" }),
      );
    });

    it("reports a quiet timeout when GPS times out with no last known fix", async () => {
      jest.useFakeTimers();
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      mockGetCurrentPosition.mockReturnValue(new Promise(() => {}));
      const pending = getDeviceLocation();
      await jest.advanceTimersByTimeAsync(10_000);
      await expect(pending).resolves.toEqual({ status: "error", reason: "timeout" });
      // An expected "no fix" is not a bug — no dev warning.
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });

    it("treats a browser position-unavailable error as a quiet timeout", async () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      mockGetCurrentPosition.mockRejectedValueOnce(
        Object.assign(new Error("unavailable"), { code: 2 }),
      );
      await expect(getDeviceLocation()).resolves.toEqual({ status: "error", reason: "timeout" });
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });

    it("still warns on unexpected failures", async () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
      mockGetCurrentPosition.mockRejectedValueOnce(new Error("boom"));
      await expect(getDeviceLocation()).resolves.toEqual({ status: "error" });
      expect(warn).toHaveBeenCalledWith(
        "[location] device location failed:",
        expect.objectContaining({ message: "boom" }),
      );
      warn.mockRestore();
    });
  });

  it("uses admin2 when admin1 is missing or repeats the city", async () => {
    mockFetch(
      fakeResponse({
        results: [
          { id: 1, name: "Alpha", latitude: 1, longitude: 2, admin1: "Alpha", admin2: "District" },
          { id: 2, name: "Beta", latitude: 1, longitude: 2, admin2: "Beta" },
          { id: 3, name: "Gamma", latitude: 1, longitude: 2, timezone: "Asia/Karachi" },
        ],
      }),
    );
    const results = await searchLocations("al", "ur");
    expect(results.map((r) => r.admin)).toEqual(["District", undefined, undefined]);
    expect(results[2]).toEqual(
      expect.objectContaining({ label: "Gamma", timeZone: "Asia/Karachi", country: undefined }),
    );
  });
});

describe("normalizeCountryCode", () => {
  it("keeps two-letter ISO codes, uppercased", () => {
    expect(normalizeCountryCode("pk")).toBe("PK");
    expect(normalizeCountryCode(" GB ")).toBe("GB");
    expect(normalizeCountryCode("PAK")).toBeUndefined();
    expect(normalizeCountryCode(null)).toBeUndefined();
  });
});
