/**
 * "Open in Maps" OS deep links (NF-3.11 v1 is list-first; no map SDK — D-lock).
 * iOS → Apple Maps, Android → `geo:` intent (any installed maps app), web →
 * OpenStreetMap directions in a new tab. Only the masjid's public coordinates
 * are in the link; the user's own location is never added.
 */

export type MapsPlatform = "ios" | "android" | "web" | string;

export function mapsDirectionsUrl(
  target: { lat: number; lon: number; name?: string },
  platform: MapsPlatform,
): string {
  const lat = target.lat.toFixed(6);
  const lon = target.lon.toFixed(6);
  const label = target.name ? encodeURIComponent(target.name) : "";
  if (platform === "ios") {
    return `https://maps.apple.com/?daddr=${lat},${lon}${label ? `&q=${label}` : ""}`;
  }
  if (platform === "android") {
    return `geo:${lat},${lon}?q=${lat},${lon}${label ? `(${label})` : ""}`;
  }
  return `https://www.openstreetmap.org/directions?to=${lat}%2C${lon}#map=17/${lat}/${lon}`;
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
