import {
  getHijriObserver,
  gregorianToHijri,
  hijriMonthLength,
  hijriToGregorian,
  setHijriObserver,
} from "@/lib/hijri";
import { resetSightingCacheForTests, sightingAvailable } from "@/lib/hijri-sighting";

/**
 * Location-aware Hijri dates from crescent visibility. Fixtures are official
 * regional announcements:
 * - Pakistan (Central Ruet-e-Hilal Committee): 1 Safar 1448 = July 16, 2026;
 *   1 Ramadan 1444 = March 23, 2023; Eid al-Fitr 1444 = April 22, 2023.
 * - USA (most communities): 1 Ramadan 1446 = March 1, 2025.
 */

const KARACHI = { latitude: 24.8607, longitude: 67.0011 };
const NEW_YORK = { latitude: 40.7128, longitude: -74.006 };

afterEach(() => {
  setHijriObserver(null);
  resetSightingCacheForTests();
});

describe("sightingAvailable", () => {
  it("rejects polar latitudes and accepts inhabited ones", () => {
    expect(sightingAvailable(24.86)).toBe(true);
    expect(sightingAvailable(-33.9)).toBe(true);
    expect(sightingAvailable(71.0)).toBe(false);
  });

  it("setHijriObserver ignores polar observers", () => {
    setHijriObserver({ latitude: 78.2, longitude: 15.6 });
    expect(getHijriObserver()).toBeNull();
  });
});

describe("gregorianToHijri with a location observer", () => {
  it("matches Pakistan's announced Safar 1448 start in Karachi", () => {
    setHijriObserver(KARACHI);
    expect(gregorianToHijri(new Date(2026, 6, 16))).toEqual({ year: 1448, month: 2, day: 1 });
    expect(gregorianToHijri(new Date(2026, 6, 18))).toEqual({ year: 1448, month: 2, day: 3 });
    // Pakistan's Muharram 1448 began June 17 and ran 29 days.
    expect(gregorianToHijri(new Date(2026, 6, 15))).toEqual({ year: 1448, month: 1, day: 29 });
  });

  it("matches Pakistan's announced Ramadan and Eid al-Fitr 1444 in Karachi", () => {
    setHijriObserver(KARACHI);
    expect(gregorianToHijri(new Date(2023, 2, 23))).toEqual({ year: 1444, month: 9, day: 1 });
    expect(gregorianToHijri(new Date(2023, 3, 22))).toEqual({ year: 1444, month: 10, day: 1 });
  });

  it("matches the US Ramadan 1446 start in New York", () => {
    setHijriObserver(NEW_YORK);
    expect(gregorianToHijri(new Date(2025, 2, 1))).toEqual({ year: 1446, month: 9, day: 1 });
  });

  it("does not throw for the Punjab GPS fix that crashed production web", () => {
    // Sentry: TypeError reading 'M_ID' after /location → / at 30.91514, 71.05094.
    setHijriObserver({ latitude: 30.91514, longitude: 71.05094 });
    expect(() => gregorianToHijri(new Date(2026, 8, 11))).not.toThrow();
    const hijri = gregorianToHijri(new Date(2026, 8, 11));
    expect(hijri.year).toBeGreaterThan(1400);
    expect(hijri.month).toBeGreaterThanOrEqual(1);
    expect(hijri.month).toBeLessThanOrEqual(12);
    expect(hijri.day).toBeGreaterThanOrEqual(1);
    expect(hijri.day).toBeLessThanOrEqual(30);
  });

  it("differs from Umm al-Qura only in the day, never the month numbering", () => {
    setHijriObserver(KARACHI);
    const sighted = gregorianToHijri(new Date(2026, 6, 20));
    setHijriObserver(null);
    const umalqura = gregorianToHijri(new Date(2026, 6, 20));
    expect(sighted.year).toBe(umalqura.year);
    expect(sighted.month).toBe(umalqura.month);
    expect(Math.abs(sighted.day - umalqura.day)).toBeLessThanOrEqual(2);
  });
});

describe("hijriToGregorian with a location observer", () => {
  it("is the exact inverse of gregorianToHijri across a full year", () => {
    setHijriObserver(KARACHI);
    const cursor = new Date(2026, 0, 1);
    for (let i = 0; i < 366; i += 1) {
      const h = gregorianToHijri(cursor);
      expect(h.day).toBeGreaterThanOrEqual(1);
      expect(h.day).toBeLessThanOrEqual(30);
      const back = hijriToGregorian(h.year, h.month, h.day);
      expect([back.getFullYear(), back.getMonth(), back.getDate()]).toEqual([
        cursor.getFullYear(),
        cursor.getMonth(),
        cursor.getDate(),
      ]);
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  it("resolves the announced Gregorian day for a sighted Hijri date", () => {
    setHijriObserver(KARACHI);
    const safar1 = hijriToGregorian(1448, 2, 1);
    expect([safar1.getFullYear(), safar1.getMonth() + 1, safar1.getDate()]).toEqual([2026, 7, 16]);
  });
});

describe("hijriMonthLength with a location observer", () => {
  it("returns only 29- or 30-day months across 1448 AH", () => {
    setHijriObserver(KARACHI);
    for (let month = 1; month <= 12; month += 1) {
      const length = hijriMonthLength(1448, month);
      expect(length === 29 || length === 30).toBe(true);
    }
  });

  it("agrees with the gap between consecutive sighted month starts", () => {
    setHijriObserver(KARACHI);
    const start = hijriToGregorian(1448, 2, 1);
    const next = hijriToGregorian(1448, 3, 1);
    const days = Math.round((next.getTime() - start.getTime()) / 86_400_000);
    expect(hijriMonthLength(1448, 2)).toBe(days);
  });
});

describe("hijri-sighting failure paths (mocked ephemeris)", () => {
  type Sighting = typeof import("@/lib/hijri-sighting");
  type Astro = typeof import("astronomy-engine");
  const { gregorianToJDN } = jest.requireActual(
    "@/lib/hijri-core",
  ) as typeof import("@/lib/hijri-core");

  const overrides: Partial<Record<keyof Astro, unknown>> = {};
  type Fn = (...args: unknown[]) => unknown;
  // The astronomy-engine instance loaded inside the isolated registry; overrides
  // must call through to it (its Observer instances are not interchangeable).
  let real: Record<string, unknown> = {};
  const callReal = (name: string, ...args: unknown[]) => (real[name] as Fn)(...args);
  const JDN = gregorianToJDN(2026, 7, 20);

  function loadSighting(): Sighting {
    let mod!: Sighting;
    jest.isolateModules(() => {
      jest.doMock("astronomy-engine", () => {
        real = jest.requireActual("astronomy-engine") as Record<string, unknown>;
        // Plain object of live getters (a Proxy would violate the module's
        // non-configurable export invariants).
        const facade: Record<string, unknown> = {};
        for (const key of Object.keys(real)) {
          Object.defineProperty(facade, key, {
            enumerable: true,
            get: () => (key in overrides ? overrides[key as keyof Astro] : real[key]),
          });
        }
        return facade;
      });
      mod = require("@/lib/hijri-sighting") as Sighting;
    });
    return mod;
  }

  afterEach(() => {
    for (const key of Object.keys(overrides)) delete overrides[key as keyof Astro];
    jest.dontMock("astronomy-engine");
  });

  const actual = { Body: { Sun: "Sun", Moon: "Moon" } };

  it("returns null for polar observers and out-of-table days", () => {
    const s = loadSighting();
    expect(s.sightingHijriFromJDN({ latitude: 80, longitude: 0 }, JDN)).toBeNull();
    expect(s.sightingHijriFromJDN(KARACHI, gregorianToJDN(1800, 1, 1))).toBeNull();
    expect(s.sightingJDNFromHijri(KARACHI, 1100, 1, 1)).toBeNull();
    expect(s.sightingMonthLength(KARACHI, 1100, 1)).toBeNull();
  });

  it("returns null when no matching month label exists", () => {
    const s = loadSighting();
    expect(s.sightingJDNFromHijri(KARACHI, 1448, 13, 1)).toBeNull();
    expect(s.sightingMonthLength(KARACHI, 1448, 13)).toBeNull();
  });

  it("extends the cached table backwards for earlier dates", () => {
    const s = loadSighting();
    const later = s.sightingHijriFromJDN(KARACHI, JDN);
    const earlier = s.sightingHijriFromJDN(KARACHI, JDN - 120);
    expect(later).not.toBeNull();
    expect(earlier).not.toBeNull();
    expect(earlier?.day).toBeGreaterThanOrEqual(1);
    expect(earlier?.day).toBeLessThanOrEqual(30);
  });

  it.each([
    [
      "sunset cannot be found",
      () => {
        overrides.SearchRiseSet = () => null;
      },
    ],
    [
      "moonset cannot be found",
      () => {
        overrides.SearchRiseSet = (body: unknown, ...rest: unknown[]) =>
          body === actual.Body.Moon ? null : callReal("SearchRiseSet", body, ...rest);
      },
    ],
    [
      "GeoMoon returns no vector",
      () => {
        overrides.GeoMoon = () => undefined;
      },
    ],
    [
      "the moon distance is not finite",
      () => {
        // Vector whose magnitude is NaN (an astronomy-engine `Vector` with bad axes).
        const nanLength = () => Number.NaN;
        overrides.GeoMoon = () => ({ Length: nanLength });
      },
    ],
    [
      "rise/set search throws",
      () => {
        overrides.SearchRiseSet = () => {
          throw new TypeError("Cannot read properties of undefined (reading 'M_ID')");
        };
      },
    ],
    [
      "the conjunction search throws",
      () => {
        overrides.SearchMoonPhase = () => {
          throw new Error("no phase");
        };
      },
    ],
    [
      "the observer cannot be constructed",
      () => {
        overrides.Observer = function Broken() {
          throw new Error("bad observer");
        };
      },
    ],
  ])("falls back to null when %s", (_label, arrange) => {
    arrange();
    const s = loadSighting();
    expect(s.sightingHijriFromJDN(KARACHI, JDN)).toBeNull();
  });

  it("caps the month at conjunction + 3 when the moon always sets first", () => {
    overrides.SearchRiseSet = (body: unknown, ...rest: unknown[]) => {
      if (body === actual.Body.Moon) {
        // Moonset one minute before the sunset the search was seeded with.
        const sunset = rest[2] as Date;
        return { date: new Date(sunset.getTime() - 60_000) };
      }
      return callReal("SearchRiseSet", body, ...rest);
    };
    const s = loadSighting();
    const hijri = s.sightingHijriFromJDN(KARACHI, JDN);
    expect(hijri).not.toBeNull();
    expect(hijri?.day).toBeGreaterThanOrEqual(1);
    expect(hijri?.day).toBeLessThanOrEqual(30);
  });

  it("drops the table when a forward extension cannot find the next conjunction", () => {
    let calls = 0;
    overrides.SearchMoonPhase = (...args: unknown[]) => {
      calls += 1;
      return calls === 1 ? callReal("SearchMoonPhase", ...args) : null;
    };
    const s = loadSighting();
    expect(s.sightingHijriFromJDN(KARACHI, JDN)).toBeNull();
  });

  it("drops the table when a forward extension cannot evaluate visibility", () => {
    let conjunctions = 0;
    overrides.SearchMoonPhase = (...args: unknown[]) => {
      conjunctions += 1;
      return callReal("SearchMoonPhase", ...args);
    };
    overrides.SearchRiseSet = (...args: unknown[]) =>
      conjunctions > 1 ? null : callReal("SearchRiseSet", ...args);
    const s = loadSighting();
    expect(s.sightingHijriFromJDN(KARACHI, JDN)).toBeNull();
  });

  it("returns null when a backward extension fails", () => {
    const s = loadSighting();
    expect(s.sightingHijriFromJDN(KARACHI, JDN)).not.toBeNull();
    overrides.SearchMoonPhase = () => null;
    expect(s.sightingHijriFromJDN(KARACHI, JDN - 200)).toBeNull();

    delete overrides.SearchMoonPhase;
    const s2 = loadSighting();
    expect(s2.sightingHijriFromJDN(KARACHI, JDN)).not.toBeNull();
    overrides.SearchRiseSet = () => null;
    expect(s2.sightingHijriFromJDN(KARACHI, JDN - 200)).toBeNull();
  });
});
