import * as Location from "expo-location";
import { Platform } from "react-native";

import {
  type CalculationMethodKey,
  DEFAULT_CALCULATION_METHOD,
  DEFAULT_MADHAB,
  type MadhabKey,
} from "@/lib/prayer-times";

/**
 * Location acquisition + reverse geocoding for prayer-time calculation.
 *
 * Coordinates come from `expo-location` (GPS/network). The human-readable place
 * label uses the OS geocoder on native and falls back to BigDataCloud's free,
 * key-less, open reverse-geocode endpoint (also the web path, where the OS
 * geocoder is unavailable).
 */

/**
 * Where the stored coordinates came from:
 * - `default` — the seeded fallback (Makkah), no fix yet.
 * - `device`  — an `expo-location` GPS/network fix.
 * - `manual`  — a city the user picked from search; GPS must not overwrite it.
 */
export type LocationSource = "default" | "device" | "manual";

export interface StoredLocation {
  latitude: number;
  longitude: number;
  /** Display label, e.g. "Sylhet, Bangladesh". */
  label: string;
  city?: string;
  country?: string;
  method: CalculationMethodKey;
  madhab: MadhabKey;
  /** How these coordinates were obtained; drives whether GPS may replace them. */
  source: LocationSource;
  /** ISO timestamp of the last successful device fix, or null if defaulted. */
  updatedAt: string | null;
}

/** Sensible default until a real fix is available: the Kaaba, Makkah. */
export const DEFAULT_LOCATION: StoredLocation = {
  latitude: 21.4225,
  longitude: 39.8262,
  label: "Makkah, Saudi Arabia",
  city: "Makkah",
  country: "Saudi Arabia",
  method: DEFAULT_CALCULATION_METHOD,
  madhab: DEFAULT_MADHAB,
  source: "default",
  updatedAt: null,
};

interface Place {
  city?: string;
  country?: string;
}

function buildLabel(place: Place, latitude: number, longitude: number): string {
  const parts = [place.city, place.country].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}

/** Reverse-geocodes coordinates to a { city, country }, best-effort. */
async function reverseGeocode(latitude: number, longitude: number): Promise<Place> {
  // Native OS geocoder first (offline-capable, no network on most devices).
  if (Platform.OS !== "web") {
    try {
      const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result) {
        return {
          city: result.city ?? result.subregion ?? result.district ?? undefined,
          country: result.country ?? undefined,
        };
      }
    } catch {
      // Fall through to the network geocoder.
    }
  }

  // BigDataCloud client endpoint — free, no API key, CORS-enabled, open data.
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );
    if (res.ok) {
      const data = (await res.json()) as {
        city?: string;
        locality?: string;
        countryName?: string;
      };
      return {
        city: data.city || data.locality || undefined,
        country: data.countryName || undefined,
      };
    }
  } catch {
    // Ignore — caller falls back to a coordinate label.
  }
  return {};
}

export type LocationResult =
  | { status: "granted"; location: Omit<StoredLocation, "method" | "madhab"> }
  | { status: "denied" }
  | { status: "error" };

/**
 * Requests foreground permission, gets a fix, and resolves a place label.
 * Never throws — returns a discriminated result the store can act on.
 */
export async function getDeviceLocation(): Promise<LocationResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return { status: "denied" };

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });
    const { latitude, longitude } = position.coords;
    const place = await reverseGeocode(latitude, longitude);

    return {
      status: "granted",
      location: {
        latitude,
        longitude,
        city: place.city,
        country: place.country,
        label: buildLabel(place, latitude, longitude),
        source: "device",
        updatedAt: new Date().toISOString(),
      },
    };
  } catch {
    return { status: "error" };
  }
}

/** One place returned from a forward-geocode search, ready to select and store. */
export interface LocationSearchResult {
  /** Stable id from the geocoder, used as a list key. */
  id: string;
  /** Primary place name, e.g. "Karachi". */
  name: string;
  /** Region/state for disambiguation, e.g. "Sindh" (omitted if same as name). */
  admin?: string;
  country?: string;
  latitude: number;
  longitude: number;
  /** Compact display label persisted as the location, e.g. "Karachi, Pakistan". */
  label: string;
}

/** Shape of a result row from the Open-Meteo geocoding endpoint. */
interface OpenMeteoPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
}

function toSearchResult(place: OpenMeteoPlace): LocationSearchResult {
  // Prefer the state/province for disambiguation, but skip it when it just
  // repeats the city name (common for city-states / capital districts).
  const admin =
    place.admin1 && place.admin1 !== place.name
      ? place.admin1
      : place.admin2 && place.admin2 !== place.name
        ? place.admin2
        : undefined;
  return {
    id: String(place.id),
    name: place.name,
    admin,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    label: [place.name, place.country].filter(Boolean).join(", "),
  };
}

/**
 * Forward-geocodes a free-text query to a list of cities via the Open-Meteo
 * geocoding API — free, key-less, CORS-enabled, GeoNames-derived open data, so
 * it works identically on iOS/Android/Web with no native dependency.
 *
 * Never throws: returns `[]` for short queries, aborts, or any network/parse
 * error, so callers can treat "no results" and "failed" the same way.
 */
export async function searchLocations(
  query: string,
  language = "en",
  signal?: AbortSignal,
): Promise<LocationSearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const url =
      "https://geocoding-api.open-meteo.com/v1/search" +
      `?name=${encodeURIComponent(q)}&count=10&language=${encodeURIComponent(language)}&format=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: OpenMeteoPlace[] };
    return (data.results ?? []).map(toSearchResult);
  } catch {
    // Network failure, JSON parse error, or an aborted request — all "no results".
    return [];
  }
}
