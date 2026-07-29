import { hijriObserverFor } from "@/lib/hijri-authority";
import type { StoredLocation } from "@/lib/location";

function locationOf(overrides: Partial<StoredLocation>): StoredLocation {
  return {
    latitude: 0,
    longitude: 0,
    label: "",
    method: "MuslimWorldLeague",
    madhab: "hanafi",
    source: "manual",
    updatedAt: null,
    ...overrides,
  };
}

describe("hijriObserverFor", () => {
  it("returns null for the seeded default location (no fix yet)", () => {
    expect(
      hijriObserverFor(
        locationOf({ source: "default", country: "Saudi Arabia", latitude: 21.4, longitude: 39.8 }),
      ),
    ).toBeNull();
  });

  it("keeps Umm al-Qura regions on the official calendar", () => {
    expect(
      hijriObserverFor(
        locationOf({
          latitude: 21.42,
          longitude: 39.83,
          country: "Saudi Arabia",
          timeZone: "Asia/Riyadh",
        }),
      ),
    ).toBeNull();
    expect(
      hijriObserverFor(
        locationOf({
          latitude: 25.2,
          longitude: 55.27,
          country: "United Arab Emirates",
          timeZone: "Asia/Dubai",
        }),
      ),
    ).toBeNull();
    expect(
      hijriObserverFor(
        locationOf({ latitude: 41.0, longitude: 28.98, timeZone: "Europe/Istanbul" }),
      ),
    ).toBeNull();
    // Country match alone (no stored timezone, e.g. from reverse geocode).
    expect(hijriObserverFor(locationOf({ country: "Egypt" }))).toBeNull();
  });

  it("returns sighting coordinates for moonsighting regions", () => {
    expect(
      hijriObserverFor(
        locationOf({
          latitude: 24.86,
          longitude: 67.0,
          country: "Pakistan",
          timeZone: "Asia/Karachi",
        }),
      ),
    ).toEqual({ latitude: 24.86, longitude: 67.0 });
    expect(
      hijriObserverFor(
        locationOf({
          latitude: 40.71,
          longitude: -74.01,
          country: "United States",
          timeZone: "America/New_York",
        }),
      ),
    ).toEqual({ latitude: 40.71, longitude: -74.01 });
    expect(
      hijriObserverFor(
        locationOf({ latitude: 23.6, longitude: 58.5, country: "Oman", timeZone: "Asia/Muscat" }),
      ),
    ).toEqual({ latitude: 23.6, longitude: 58.5 });
  });
});
