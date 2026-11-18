import { DEFAULT_LOCATION, type LocationSearchResult, type StoredLocation } from "@/lib/location";

/** A GPS-sourced location (London) on top of the app defaults. */
export function buildStoredLocation(overrides: Partial<StoredLocation> = {}): StoredLocation {
  return {
    ...DEFAULT_LOCATION,
    latitude: 51.5072,
    longitude: -0.1276,
    label: "London, United Kingdom",
    city: "London",
    country: "United Kingdom",
    source: "device",
    updatedAt: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}

/** A city-search hit (Karachi). */
export function buildLocationSearchResult(
  overrides: Partial<LocationSearchResult> = {},
): LocationSearchResult {
  return {
    id: "karachi",
    name: "Karachi",
    country: "Pakistan",
    latitude: 24.8607,
    longitude: 67.0011,
    label: "Karachi, Pakistan",
    timeZone: "Asia/Karachi",
    ...overrides,
  };
}
