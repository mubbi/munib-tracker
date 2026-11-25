/**
 * Directions hand-off (NF-3.11): Google Maps links — free, no API key, no
 * quota; routing happens in Google Maps, so the app never calls a directions
 * API. Only the masjid's public coordinates are in the link — the user's own
 * location is never added; Google Maps starts from the device's location.
 * `openDirections` (components/masjid) picks which link to open per platform.
 */

type MapsTarget = { lat: number; lon: number; name?: string };

const destinationOf = (target: MapsTarget): string =>
  encodeURIComponent(`${target.lat.toFixed(6)},${target.lon.toFixed(6)}`);

/**
 * "Maps URLs" link (https://developers.google.com/maps/documentation/urls/get-started):
 * the browser everywhere, and the Google Maps app on Android (app link).
 */
export function mapsDirectionsUrl(target: MapsTarget): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${destinationOf(target)}`;
}

/**
 * Google Maps for iOS URL scheme
 * (https://developers.google.com/maps/documentation/urls/ios-urlscheme):
 * opens the installed app straight to directions.
 */
export function googleMapsAppUrl(target: MapsTarget): string {
  return `comgooglemaps://?daddr=${destinationOf(target)}`;
}

/** Distance label parts: metres (rounded to 10) under 1 km, else km (1 decimal under 10 km). */
export function distanceParts(meters: number): { unit: "m" | "km"; value: number } {
  if (meters < 1000) return { unit: "m", value: Math.max(10, Math.round(meters / 10) * 10) };
  const km = meters / 1000;
  return { unit: "km", value: km < 10 ? Math.round(km * 10) / 10 : Math.round(km) };
}

/** Localised distance string, e.g. "350 m" / "1.2 km" (unit via i18n). */
export function formatDistance(
  meters: number,
  locale: string,
  t: (key: string, options: Record<string, unknown>) => string,
): string {
  const { unit, value } = distanceParts(meters);
  let formatted: string;
  try {
    formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  } catch {
    formatted = String(value);
  }
  return t(unit === "m" ? "masjids.distanceM" : "masjids.distanceKm", { value: formatted });
}
