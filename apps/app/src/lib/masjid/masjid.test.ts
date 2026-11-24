import { masjidKey } from "@munib-tracker/shared/masjid";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { cellFor, fetchMasjidDetail, fetchMasjidList, MasjidApiError } from "@/lib/masjid/api";
import {
  getHomeMasjid,
  homeMasjidCacheStore,
  iqamahFor,
  resolveHomeIqamah,
  setHomeMasjid,
} from "@/lib/masjid/home-masjid";
import { distanceParts, formatDistance, mapsDirectionsUrl } from "@/lib/masjid/maps-link";
import { saveImportedTimetable } from "@/lib/masjid/timetable-import";
import { homeMasjidTimesActions, homeMasjidTimesStore } from "@/stores/home-masjid-times-store";
import { preferencesStore } from "@/stores/preferences-store";
import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { setPreferences } from "@/test-support/preferences";

const HOME = { osmType: "node" as const, osmId: "1", name: "East Masjid", lat: 51.5, lon: -0.12 };
const KEY = masjidKey(HOME);
const PUBLIC_DETAIL = {
  osmType: "node" as const,
  osmId: "1",
  lat: 51.5,
  lon: -0.12,
  attribution: ["osm"],
  stale: false,
  timetable: {
    daily: { fajr: "05:30", asr: "15:00" },
    source: { id: "feed", attribution: "Feed", fetchedAt: "2026-11-01T00:00:00Z" },
  },
};

describe("masjid api client (privacy)", () => {
  it("sends only the geohash-5 cell, without credentials or auth", async () => {
    const fetchMock = mockFetch(fakeResponse({ masjids: [], attribution: ["osm"], stale: false }));
    const cell = cellFor(51.50735, -0.12776);
    expect(cell).toBe("gcpvj");
    await fetchMasjidList(cell);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/masjids\?cell=gcpvj$/);
    expect(url).not.toMatch(/51\.5|0\.127/);
    expect(init.credentials).toBe("omit");
    expect(JSON.stringify(init.headers)).not.toMatch(/authorization/i);
  });

  it("falls back to the on-device list when offline", async () => {
    const list = {
      masjids: [{ osmType: "node", osmId: "9", lat: 1, lon: 1 }],
      attribution: [],
      stale: false,
    };
    mockFetch(fakeResponse(list));
    await fetchMasjidList("gcpvj");
    mockFetch(new Error("offline"));
    await expect(fetchMasjidList("gcpvj")).resolves.toMatchObject({
      offline: true,
      masjids: [{ osmId: "9" }],
    });
    await expect(fetchMasjidList("gcpvm")).rejects.toBeInstanceOf(MasjidApiError);
  });

  it("maps HTTP errors to kinds", async () => {
    mockFetch(fakeResponse({}, { status: 404 }));
    await expect(fetchMasjidDetail("node", "1")).rejects.toMatchObject({ kind: "not_found" });
    mockFetch(fakeResponse({}, { status: 429 }));
    await expect(fetchMasjidDetail("node", "1")).rejects.toMatchObject({ kind: "rate_limited" });
  });
});

describe("home masjid layer", () => {
  beforeEach(async () => {
    await writeJSON(DB_KEYS.homeMasjidTimes, {});
    await homeMasjidTimesStore.getState().load();
    await homeMasjidCacheStore.getState().set(null);
    await setPreferences({ homeMasjid: HOME });
  });

  it("resolves private > public > none", () => {
    const cache = { key: KEY, savedAt: "x", detail: PUBLIC_DETAIL };
    const own = { [KEY]: { daily: { fajr: "06:10" }, updatedAt: "x" } };
    expect(resolveHomeIqamah(HOME, own, cache)?.source).toEqual({ id: "private" });
    expect(resolveHomeIqamah(HOME, {}, cache)?.daily?.fajr).toBe("05:30");
    expect(resolveHomeIqamah(HOME, {}, { ...cache, key: "node/2" })).toBeNull();
    expect(resolveHomeIqamah(HOME, {}, null)).toBeNull();
    expect(resolveHomeIqamah(null, own, cache)).toBeNull();
  });

  it("iqamahFor reads the stores (hook for focus lock / tahiyyat hint)", async () => {
    expect(iqamahFor("2026-11-25", "fajr")).toBeNull();
    await homeMasjidTimesActions.save(KEY, { daily: { fajr: "06:10", dhuhr: "13:30" } });
    expect(iqamahFor("2026-11-25", "fajr")).toBe("06:10");
    expect(iqamahFor("2026-11-25", "asr")).toBeNull();
    // Friday without a Jumu'ah time → no Dhuhr iqamah.
    expect(iqamahFor("2026-11-27", "dhuhr")).toBeNull();
  });

  it("drops malformed private times and removes empty entries", async () => {
    await homeMasjidTimesActions.save(KEY, { daily: { fajr: "99:99" } });
    expect(homeMasjidTimesStore.getState().times[KEY]).toBeUndefined();
    await homeMasjidTimesActions.save(KEY, { daily: { isha: "20:00" } });
    expect(await readJSON(DB_KEYS.homeMasjidTimes, {})).toMatchObject({
      [KEY]: { daily: { isha: "20:00" } },
    });
    await homeMasjidTimesActions.remove(KEY);
    expect(homeMasjidTimesStore.getState().times).toEqual({});
  });

  it("OCR import slot saves to the same private blob", async () => {
    await expect(saveImportedTimetable(KEY, { daily: { maghrib: "17:05" } })).resolves.toBe(true);
    expect(homeMasjidTimesStore.getState().times[KEY]).toMatchObject({
      origin: "ocr",
      daily: { maghrib: "17:05" },
    });
    await expect(saveImportedTimetable(KEY, { daily: {} })).resolves.toBe(false);
  });

  it("setHomeMasjid stores only the user's choice in prefs", async () => {
    mockFetch(new Error("offline"));
    await setHomeMasjid(null);
    expect(getHomeMasjid()).toBeNull();
    await setHomeMasjid(HOME);
    expect(preferencesStore.getState().prefs.homeMasjid).toEqual(HOME);
  });
});

describe("maps deep links + distance", () => {
  it("builds OS-specific directions links with the masjid's coordinates only", () => {
    const target = { lat: 51.5, lon: -0.12, name: "East Masjid" };
    expect(mapsDirectionsUrl(target, "ios")).toBe(
      "https://maps.apple.com/?daddr=51.500000,-0.120000&q=East%20Masjid",
    );
    expect(mapsDirectionsUrl(target, "android")).toBe(
      "geo:51.500000,-0.120000?q=51.500000,-0.120000(East%20Masjid)",
    );
    expect(mapsDirectionsUrl({ lat: 1, lon: 2 }, "web")).toContain(
      "openstreetmap.org/directions?to=1.000000%2C2.000000",
    );
  });

  it("rounds distances", () => {
    expect(distanceParts(4)).toEqual({ unit: "m", value: 10 });
    expect(distanceParts(347)).toEqual({ unit: "m", value: 350 });
    expect(distanceParts(1234)).toEqual({ unit: "km", value: 1.2 });
    expect(distanceParts(12_600)).toEqual({ unit: "km", value: 13 });
    const t = (key: string, o: Record<string, unknown>) => `${key}:${String(o.value)}`;
    expect(formatDistance(1234, "en", t)).toBe("masjids.distanceKm:1.2");
  });
});
