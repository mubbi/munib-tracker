import { describe, expect, it } from "vitest";

import {
  attributionCreditsGeoapify,
  boundsOfCells,
  buildOverpassBboxQuery,
  buildOverpassElementQuery,
  clampWalkMinutes,
  decodeGeohashBounds,
  distanceMeters,
  encodeGeohash,
  GEOAPIFY_ATTRIBUTION_LINE,
  geohashWithNeighbours,
  iqamahTimeFor,
  isOpenAt,
  isValidGeohash,
  jumuahIqamahTimes,
  masjidDisplayName,
  OSM_ATTRIBUTION,
  parseOverpassDetail,
  parseOverpassSummaries,
  parseServiceTimes,
  resolveIqamahTimetable,
  sanitizePrivateMasjidTimes,
  sortByDistance,
} from "../index";

describe.concurrent("attributionCreditsGeoapify", () => {
  it("matches only the exact Geoapify attribution line", () => {
    expect(attributionCreditsGeoapify([OSM_ATTRIBUTION, GEOAPIFY_ATTRIBUTION_LINE])).toBe(true);
    expect(attributionCreditsGeoapify([OSM_ATTRIBUTION])).toBe(false);
    expect(attributionCreditsGeoapify(undefined)).toBe(false);
    // A line that merely contains the URL (e.g. on another host) is not a credit.
    expect(attributionCreditsGeoapify(["https://evil.example/?https://www.geoapify.com/"])).toBe(
      false,
    );
  });
});

describe.concurrent("geohash", () => {
  it("encodes known cells", () => {
    // Reference values from the geohash spec examples.
    expect(encodeGeohash(57.64911, 10.40744, 11)).toBe("u4pruydqqvj");
    expect(encodeGeohash(51.5074, -0.1278)).toBe("gcpvj");
  });

  it("decodes bounds containing the encoded point", () => {
    const b = decodeGeohashBounds(encodeGeohash(51.5074, -0.1278));
    expect(b.south).toBeLessThanOrEqual(51.5074);
    expect(b.north).toBeGreaterThanOrEqual(51.5074);
    expect(b.west).toBeLessThanOrEqual(-0.1278);
    expect(b.east).toBeGreaterThanOrEqual(-0.1278);
  });

  it("validates cells", () => {
    expect(isValidGeohash("gcpvj")).toBe(true);
    expect(isValidGeohash("gcpva")).toBe(false); // "a" is not base32
    expect(isValidGeohash("gcpv")).toBe(false);
    expect(isValidGeohash(42)).toBe(false);
  });

  it("returns the cell and 8 distinct neighbours", () => {
    const cells = geohashWithNeighbours("gcpvj");
    expect(cells).toHaveLength(9);
    expect(cells[0]).toBe("gcpvj");
    expect(new Set(cells).size).toBe(9);
    const bounds = boundsOfCells(cells);
    const centre = decodeGeohashBounds("gcpvj");
    expect(bounds.south).toBeLessThan(centre.south);
    expect(bounds.east).toBeGreaterThan(centre.east);
    // ≤ 10 km radius clamp: the 3×3 block stays under ~15 km per side.
    expect(
      distanceMeters(
        { lat: bounds.south, lon: bounds.west },
        { lat: bounds.south, lon: bounds.east },
      ),
    ).toBeLessThan(15_000);
  });

  it("drops neighbours past the poles", () => {
    expect(geohashWithNeighbours(encodeGeohash(89.99, 0)).length).toBeLessThan(9);
  });
});

describe.concurrent("parseServiceTimes", () => {
  it("detects a Friday Jumu'ah", () => {
    expect(parseServiceTimes("Fr 13:15")).toEqual({ jumuah: ["13:15"], other: [] });
  });

  it("detects multiple Jumu'ahs and pads hours", () => {
    expect(parseServiceTimes("Fr 12:30,13:30; Fr 14:30")?.jumuah).toEqual([
      "12:30",
      "13:30",
      "14:30",
    ]);
    expect(parseServiceTimes("Fr 9:00-10:00")?.jumuah).toEqual([]);
  });

  it("keeps non-Friday rules verbatim and never as iqamah", () => {
    expect(parseServiceTimes("Mo-Su 05:00,13:00; Fr 13:00")).toEqual({
      jumuah: ["13:00"],
      other: ["Mo-Su 05:00,13:00"],
    });
  });

  it("keeps out-of-window Friday times as service times", () => {
    expect(parseServiceTimes("Fr 06:00,13:00")).toEqual({
      jumuah: ["13:00"],
      other: ["Fr 06:00,13:00"],
    });
    expect(parseServiceTimes("Fr 16:00")).toEqual({ jumuah: [], other: ["Fr 16:00"] });
  });

  it("hides unparseable values", () => {
    expect(parseServiceTimes("after dhuhr")).toBeNull();
    expect(parseServiceTimes("Jan Fr 13:00")).toBeNull();
    expect(parseServiceTimes("PH off")).toBeNull();
    expect(parseServiceTimes("")).toBeNull();
    expect(parseServiceTimes(undefined)).toBeNull();
    expect(parseServiceTimes("Fr 13:00; sunset")).toEqual({ jumuah: ["13:00"], other: [] });
  });
});

describe.concurrent("isOpenAt", () => {
  it("handles 24/7 and simple ranges", () => {
    expect(isOpenAt("24/7", 3, 100)).toBe(true);
    expect(isOpenAt("Mo-Su 05:00-22:00", 5, 12 * 60)).toBe(true);
    expect(isOpenAt("Mo-Su 05:00-22:00", 5, 23 * 60)).toBe(false);
    expect(isOpenAt("Fr 11:00-15:00", 1, 12 * 60)).toBe(false);
  });

  it("returns null for unsupported syntax", () => {
    expect(isOpenAt("sunrise-sunset", 1, 600)).toBeNull();
    expect(isOpenAt(undefined, 1, 600)).toBeNull();
  });
});

const FIXTURE = {
  version: 0.6,
  elements: [
    {
      type: "node",
      id: 101,
      lat: 51.5,
      lon: -0.12,
      tags: {
        amenity: "place_of_worship",
        religion: "muslim",
        name: "East Masjid",
        "name:ar": "المسجد الشرقي",
        service_times: "Fr 13:00",
        wheelchair: "yes",
        toilets: "no",
        "addr:street": "High Street",
        "addr:city": "London",
        website: "example.org/masjid",
        phone: "+44 20 1234 5678; +44 20 0000 0000",
        denomination: "sunni",
        opening_hours: "Mo-Su 05:00-22:00",
      },
    },
    // Way with only a centre and no name — still listed, unnamed.
    {
      type: "way",
      id: 202,
      center: { lat: 51.51, lon: -0.11 },
      tags: { building: "mosque" },
    },
    // Duplicate element from the second union branch.
    {
      type: "node",
      id: 101,
      lat: 51.5,
      lon: -0.12,
      tags: { amenity: "place_of_worship", religion: "muslim" },
    },
    // Not a masjid.
    {
      type: "node",
      id: 303,
      lat: 51.5,
      lon: -0.1,
      tags: { amenity: "place_of_worship", religion: "christian" },
    },
    // Missing coordinates.
    { type: "relation", id: 404, tags: { building: "mosque" } },
    // Garbage.
    null,
    { type: "area", id: 5 },
    { type: "node", id: -1, lat: 0, lon: 0, tags: { building: "mosque" } },
    { type: "node", id: 606, lat: 51.5, lon: -0.1, tags: { building: "mosque", name: "  " } },
  ],
};

describe.concurrent("Overpass parsing", () => {
  it("builds bbox and element queries", () => {
    const q = buildOverpassBboxQuery({ south: 1, west: 2, north: 3, east: 4 });
    expect(q).toContain(
      'nwr["amenity"="place_of_worship"]["religion"="muslim"](1.000000,2.000000,3.000000,4.000000);',
    );
    expect(q).toContain('nwr["building"="mosque"]');
    expect(q).toContain("out center tags;");
    expect(buildOverpassElementQuery("way", "202")).toBe(
      "[out:json][timeout:20];way(202);out center tags;",
    );
  });

  it("parses summaries tolerating missing fields", () => {
    const list = parseOverpassSummaries(FIXTURE);
    expect(list.map((m) => `${m.osmType}/${m.osmId}`)).toEqual(["node/101", "way/202", "node/606"]);
    expect(list[0]).toEqual({
      osmType: "node",
      osmId: "101",
      lat: 51.5,
      lon: -0.12,
      name: "East Masjid",
      names: { ar: "المسجد الشرقي" },
      jumuah: ["13:00"],
      badges: ["wheelchair"],
    });
    // No name/jumuah/badges keys at all when absent.
    expect(Object.keys(list[1] ?? {}).sort()).toEqual(["lat", "lon", "osmId", "osmType"]);
    expect(list[2]?.name).toBeUndefined();
    expect(parseOverpassSummaries(null)).toEqual([]);
    expect(parseOverpassSummaries({ elements: "x" })).toEqual([]);
  });

  it("parses a detail with sanitised links", () => {
    const detail = parseOverpassDetail({ elements: [FIXTURE.elements[0]] });
    expect(detail).toMatchObject({
      address: { street: "High Street", city: "London" },
      website: "https://example.org/masjid",
      phone: "+44 20 1234 5678",
      denomination: "sunni",
      openingHours: "Mo-Su 05:00-22:00",
    });
    expect(detail?.serviceTimes).toBeUndefined();
    const bare = parseOverpassDetail({ elements: [FIXTURE.elements[1]] });
    expect(Object.keys(bare ?? {}).sort()).toEqual(["lat", "lon", "osmId", "osmType"]);
    expect(
      parseOverpassDetail({
        elements: [
          {
            type: "node",
            id: 9,
            lat: 1,
            lon: 1,
            tags: { building: "mosque", website: "javascript:alert(1)", phone: "call us" },
          },
        ],
      }),
    ).toEqual({ osmType: "node", osmId: "9", lat: 1, lon: 1 });
  });
});

describe.concurrent("iqamah precedence", () => {
  const publicTimetable = {
    daily: { fajr: "05:30" },
    source: { id: "feed", attribution: "Feed", fetchedAt: "2026-11-01T00:00:00Z" },
  };

  it("private > public > none", () => {
    const own = { daily: { fajr: "06:00", isha: "20:00" }, updatedAt: "2026-11-23T00:00:00Z" };
    expect(resolveIqamahTimetable({ privateTimes: own, publicTimetable })).toEqual({
      daily: { fajr: "06:00", isha: "20:00" },
      source: { id: "private" },
    });
    expect(resolveIqamahTimetable({ privateTimes: null, publicTimetable })).toBe(publicTimetable);
    expect(resolveIqamahTimetable({})).toBeNull();
    expect(
      resolveIqamahTimetable({ privateTimes: { daily: { fajr: "bad" }, updatedAt: "x" } }),
    ).toBeNull();
    expect(
      resolveIqamahTimetable({
        publicTimetable: { source: { id: "feed", attribution: "", fetchedAt: "" } },
      }),
    ).toBeNull();
  });

  it("looks up dated rows before the daily row", () => {
    const timetable = {
      daily: { dhuhr: "13:30" },
      monthly: { "2026-11-23": { dhuhr: "13:15" } },
      jumuah: [{ khutbahAt: "13:00", iqamahAt: "13:30" }, { khutbahAt: "12:00" }],
      source: { id: "private" as const },
    };
    expect(iqamahTimeFor(timetable, "2026-11-23", "dhuhr")).toBe("13:15");
    expect(iqamahTimeFor(timetable, "2026-11-24", "dhuhr")).toBe("13:30");
    expect(iqamahTimeFor(timetable, "2026-11-24", "asr")).toBeNull();
    expect(iqamahTimeFor(null, "2026-11-24", "asr")).toBeNull();
    expect(jumuahIqamahTimes(timetable)).toEqual(["12:00", "13:30"]);
  });

  it("sanitises private times", () => {
    expect(
      sanitizePrivateMasjidTimes({
        daily: { fajr: "05:45", dhuhr: "25:00", tahajjud: "03:00" },
        monthly: { "2026-11-01": { asr: "15:00" }, nope: { asr: "15:00" } },
        jumuah: [{ iqamahAt: "13:30" }, { khutbahAt: "x" }],
        origin: "ocr",
        updatedAt: "2026-11-23T00:00:00Z",
      }),
    ).toEqual({
      daily: { fajr: "05:45" },
      monthly: { "2026-11-01": { asr: "15:00" } },
      jumuah: [{ iqamahAt: "13:30" }],
      origin: "ocr",
      updatedAt: "2026-11-23T00:00:00Z",
    });
    expect(sanitizePrivateMasjidTimes({})).toBeNull();
    expect(sanitizePrivateMasjidTimes("x")).toBeNull();
  });

  it("clamps walk minutes", () => {
    expect(clampWalkMinutes(undefined)).toBe(10);
    expect(clampWalkMinutes(-5)).toBe(0);
    expect(clampWalkMinutes(500)).toBe(90);
    expect(clampWalkMinutes(12.4)).toBe(12);
  });
});

describe.concurrent("distance + names", () => {
  it("sorts by exact distance", () => {
    const sorted = sortByDistance(
      [
        { id: "far", lat: 51.6, lon: -0.12 },
        { id: "near", lat: 51.501, lon: -0.12 },
      ],
      { lat: 51.5, lon: -0.12 },
    );
    expect(sorted.map((s) => s.id)).toEqual(["near", "far"]);
    expect(sorted[0]?.distanceMeters).toBeGreaterThan(100);
    expect(sorted[0]?.distanceMeters).toBeLessThan(120);
  });

  it("prefers the app locale name", () => {
    const m = { name: "East Masjid", names: { ar: "المسجد الشرقي" } };
    expect(masjidDisplayName(m, "ar")).toBe("المسجد الشرقي");
    expect(masjidDisplayName(m, "en-GB")).toBe("East Masjid");
    expect(masjidDisplayName({}, "en")).toBeUndefined();
  });
});
