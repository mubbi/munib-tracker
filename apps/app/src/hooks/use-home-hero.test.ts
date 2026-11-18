import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { DEFAULT_LOCATION } from "@/lib/location";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useHomeHero } from "./use-home-hero";

jest.mock("@/hooks/use-now", () => ({ useNow: () => mockClock.now }));
jest.mock("@/stores/location-store", () => ({
  useLocation: () => mockClock.location,
  useLocationStatus: () => mockClock.status,
}));

const LONDON = buildStoredLocation({ timeZone: "Europe/London" });

const mockClock: {
  now: Date;
  location: typeof LONDON;
  status: string;
} = { now: new Date(), location: LONDON, status: "ready" };

async function hero(nowIso: string, overrides: Partial<typeof mockClock> = {}) {
  Object.assign(mockClock, { now: new Date(nowIso), location: LONDON, status: "ready" }, overrides);
  const { result } = await renderHook(() => useHomeHero());
  return result.current;
}

/** Epoch ms of Dhuhr in London on 2026-06-21. */
async function dhuhrAtMs(): Promise<number> {
  const h = await hero("2026-06-21T06:00:00Z");
  return h.schedule.find((item) => item.id === "dhuhr")?.atMs ?? 0;
}

beforeEach(() => setPreferences({ timeFormat: "24" }));
afterEach(resetPreferences);

describe("useHomeHero", () => {
  it("describes the day for the saved location", async () => {
    const h = await hero("2026-06-21T10:00:00Z");
    expect(h.location).toBe(LONDON.label);
    expect(h.prayers.length).toBeGreaterThan(0);
    expect(h.prayers[0].name).toBe(i18n.t("prayers.fajr"));
    expect(h.schedule.length).toBeGreaterThan(h.prayers.length);
    expect(h.southernHemisphere).toBe(false);
    expect(h.currentTime).toMatch(/\d{1,2}:\d{2}/);
    expect(h.dayProgress).toBeGreaterThanOrEqual(0);
    expect(h.dayProgress).toBeLessThanOrEqual(1);
    expect(h.nextScheduleId).not.toBeNull();
    expect(h.nextIn).toMatch(/\d/);
  });

  it("counts down in hours when the next Salah is an hour or more away", async () => {
    const h = await hero(new Date((await dhuhrAtMs()) - 90 * 60_000).toISOString());
    expect(h.countdown).toBe(
      i18n.t("hero.nextPrayerAwayHours", { prayer: i18n.t("prayers.dhuhr"), hours: 1, min: 30 }),
    );
  });

  it("counts down in minutes when the next Salah is close", async () => {
    const h = await hero(new Date((await dhuhrAtMs()) - 10 * 60_000).toISOString());
    expect(h.countdown).toBe(
      i18n.t("hero.nextPrayerAway", { prayer: i18n.t("prayers.dhuhr"), min: 10 }),
    );
  });

  it("shows a locating message while the first fix is pending", async () => {
    const h = await hero("2026-06-21T10:00:00Z", {
      location: { ...LONDON, updatedAt: undefined },
      status: "loading",
    });
    expect(h.countdown).toBe(i18n.t("hero.locating"));
  });

  it("keeps counting down while refreshing an existing fix", async () => {
    const h = await hero(new Date((await dhuhrAtMs()) - 10 * 60_000).toISOString(), {
      status: "loading",
    });
    expect(h.countdown).not.toBe(i18n.t("hero.locating"));
  });

  it("labels the default location and mirrors the moon south of the equator", async () => {
    const h = await hero("2026-06-21T10:00:00Z", {
      location: { ...DEFAULT_LOCATION, latitude: -33.87, longitude: 151.21, source: "default" },
    });
    expect(h.location).toBe(i18n.t("location.defaultLabel"));
    expect(h.southernHemisphere).toBe(true);
  });

  it("marks flexible schedule entries with the any-time label", async () => {
    const h = await hero("2026-06-21T10:00:00Z");
    const flexible = h.schedule.filter((item) => item.atMs == null);
    for (const item of flexible) expect(item.time).toBe(i18n.t("home.scheduleAnyTime"));
  });
});
