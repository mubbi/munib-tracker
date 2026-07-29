import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { DB_KEYS } from "@/db/keys";
import {
  clearReverseGeocodeMemoryCache,
  coordsMatchCache,
  getDeviceLocation,
  resolvePlaceFromCoordinates,
  reverseGeocodeCacheKey,
  searchLocations,
} from "@/lib/location";

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

function mockFetchOnce(value: unknown, ok = true) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok,
    json: async () => value,
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

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
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await getDeviceLocation({
      latitude: 24.8608,
      longitude: 67.0011,
      city: "Karachi",
      country: "Pakistan",
    });

    expect(result.status).toBe("granted");
    if (result.status === "granted") {
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
      JSON.stringify({ [key]: { city: "Karachi", country: "Pakistan" } }),
    );
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await getDeviceLocation();

    expect(result.status).toBe("granted");
    if (result.status === "granted") {
      expect(result.location.label).toBe("Karachi, Pakistan");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("dedupes concurrent reverse-geocode requests for the same coordinates", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ city: "Karachi", countryName: "Pakistan" }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

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
      JSON.stringify({ [key]: { city: "Karachi", country: "Pakistan" } }),
    );
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const place = await resolvePlaceFromCoordinates(24.8608, 67.0011);

    expect(place).toEqual({
      city: "Karachi",
      country: "Pakistan",
      label: "Karachi, Pakistan",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falls back to coordinates when reverse geocoding fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("offline")) as unknown as typeof fetch;

    const place = await resolvePlaceFromCoordinates(12.34, 56.78);

    expect(place.label).toBe("12.34, 56.78");
  });
});

describe("searchLocations", () => {
  it("skips the network for queries shorter than two characters", async () => {
    const fetchMock = mockFetchOnce({ results: [] });
    expect(await searchLocations("k")).toEqual([]);
    expect(await searchLocations("  ")).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps geocoder rows into display-ready results", async () => {
    mockFetchOnce({ results: [KARACHI] });
    const [result] = await searchLocations("karachi");
    expect(result).toEqual({
      id: "1174872",
      name: "Karachi",
      admin: "Sindh",
      country: "Pakistan",
      latitude: 24.8608,
      longitude: 67.0011,
      label: "Karachi, Pakistan",
    });
  });

  it("drops the region when it merely repeats the city name", async () => {
    mockFetchOnce({ results: [{ ...KARACHI, name: "Sindh", admin1: "Sindh" }] });
    const [result] = await searchLocations("sindh");
    expect(result.admin).toBeUndefined();
  });

  it("encodes the query and requests up to ten results", async () => {
    const fetchMock = mockFetchOnce({ results: [] });
    await searchLocations("São Paulo");
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("name=S%C3%A3o%20Paulo");
    expect(url).toContain("count=10");
  });

  it("returns [] on a non-ok response", async () => {
    mockFetchOnce({}, false);
    expect(await searchLocations("karachi")).toEqual([]);
  });

  it("returns [] when the request throws (offline / aborted)", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network")) as unknown as typeof fetch;
    expect(await searchLocations("karachi")).toEqual([]);
  });

  it("tolerates a payload with no results array", async () => {
    mockFetchOnce({});
    expect(await searchLocations("zzzzzz")).toEqual([]);
  });
});
