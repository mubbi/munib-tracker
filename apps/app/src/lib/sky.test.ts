import { computePrayerTimes, prayerSlots } from "@/lib/prayer-times";
import {
  celestialPosition,
  dayTimelinePosition,
  SKY_PALETTES,
  type SkyMarkers,
  skyPalette,
  skyPhaseForTime,
} from "@/lib/sky";

const MAKKAH = { latitude: 21.4225, longitude: 39.8262 };

/** Builds the sun markers for a day from real computed prayer times. */
function markersFor(day: Date): SkyMarkers {
  const slots = prayerSlots(computePrayerTimes(MAKKAH, day));
  const at = (id: string) => {
    const slot = slots.find((s) => s.id === id);
    if (!slot) throw new Error(`missing slot: ${id}`);
    return slot.date;
  };
  return {
    fajr: at("fajr"),
    sunrise: at("sunrise"),
    dhuhr: at("dhuhr"),
    asr: at("asr"),
    maghrib: at("maghrib"),
    isha: at("isha"),
  };
}

describe("skyPhaseForTime", () => {
  const markers = markersFor(new Date(2025, 5, 15));

  it("is night before fajr and after isha", () => {
    const preDawn = new Date(markers.fajr.getTime() - 60_000);
    const afterIsha = new Date(markers.isha.getTime() + 60_000);
    expect(skyPhaseForTime(preDawn, markers)).toBe("night");
    expect(skyPhaseForTime(afterIsha, markers)).toBe("night");
  });

  it("walks dawn → morning → noon → afternoon → dusk across the day", () => {
    const mid = (a: Date, b: Date) => new Date((a.getTime() + b.getTime()) / 2);
    expect(skyPhaseForTime(mid(markers.fajr, markers.sunrise), markers)).toBe("dawn");
    expect(skyPhaseForTime(mid(markers.sunrise, markers.dhuhr), markers)).toBe("morning");
    expect(skyPhaseForTime(mid(markers.dhuhr, markers.asr), markers)).toBe("noon");
    expect(skyPhaseForTime(mid(markers.asr, markers.maghrib), markers)).toBe("afternoon");
    expect(skyPhaseForTime(mid(markers.maghrib, markers.isha), markers)).toBe("dusk");
  });

  it("treats a marker instant as the start of its phase (inclusive)", () => {
    expect(skyPhaseForTime(markers.fajr, markers)).toBe("dawn");
    expect(skyPhaseForTime(markers.maghrib, markers)).toBe("dusk");
    expect(skyPhaseForTime(markers.isha, markers)).toBe("night");
  });
});

describe("skyPalette", () => {
  it("returns the palette for each phase", () => {
    for (const phase of Object.keys(SKY_PALETTES) as (keyof typeof SKY_PALETTES)[]) {
      expect(skyPalette(phase)).toBe(SKY_PALETTES[phase]);
    }
  });

  it("only enables stars at night", () => {
    expect(skyPalette("night").stars).toBe(true);
    expect(skyPalette("noon").stars).toBe(false);
    expect(skyPalette("dusk").stars).toBe(false);
  });
});

describe("celestialPosition", () => {
  const markers = markersFor(new Date(2025, 5, 15));
  const mid = (a: Date, b: Date) => new Date((a.getTime() + b.getTime()) / 2);

  it("moves the sun left → right across the day, highest at solar midday", () => {
    const early = celestialPosition(new Date(markers.sunrise.getTime() + 60_000), markers);
    const midday = celestialPosition(mid(markers.sunrise, markers.maghrib), markers);
    const late = celestialPosition(new Date(markers.maghrib.getTime() - 60_000), markers);
    expect(early.body).toBe("sun");
    expect(late.body).toBe("sun");
    expect(early.x).toBeLessThan(midday.x);
    expect(midday.x).toBeLessThan(late.x);
    expect(midday.x).toBeCloseTo(50, 5);
    expect(midday.y).toBeLessThan(early.y);
    expect(midday.y).toBeLessThan(late.y);
  });

  it("shows no body in twilight, with the glow on the matching horizon", () => {
    const dawn = celestialPosition(mid(markers.fajr, markers.sunrise), markers);
    const dusk = celestialPosition(mid(markers.maghrib, markers.isha), markers);
    expect(dawn.body).toBeNull();
    expect(dusk.body).toBeNull();
    expect(dawn.x).toBeLessThan(50);
    expect(dusk.x).toBeGreaterThan(50);
  });

  it("carries the moon continuously across midnight", () => {
    const evening = celestialPosition(new Date(markers.isha.getTime() + 60_000), markers);
    const preDawn = celestialPosition(new Date(markers.fajr.getTime() - 60_000), markers);
    expect(evening.body).toBe("moon");
    expect(preDawn.body).toBe("moon");
    expect(evening.x).toBeLessThan(preDawn.x);
  });
});

describe("dayTimelinePosition", () => {
  const markers = markersFor(new Date(2025, 5, 15));

  it("puts each marker instant at the centre of its column", () => {
    expect(dayTimelinePosition(markers.fajr, markers)).toBeCloseTo(0.5 / 6, 5);
    expect(dayTimelinePosition(markers.dhuhr, markers)).toBeCloseTo(2.5 / 6, 5);
    expect(dayTimelinePosition(markers.isha, markers)).toBeCloseTo(5.5 / 6, 5);
  });

  it("interpolates between neighbouring markers", () => {
    const halfway = new Date((markers.dhuhr.getTime() + markers.asr.getTime()) / 2);
    expect(dayTimelinePosition(halfway, markers)).toBeCloseTo(3 / 6, 5);
  });

  it("wraps the night around both ends and stays within 0..1", () => {
    const lateNight = dayTimelinePosition(new Date(markers.isha.getTime() + 3_600_000), markers);
    const preDawn = dayTimelinePosition(new Date(markers.fajr.getTime() - 60_000), markers);
    expect(lateNight).toBeGreaterThan(5.5 / 6);
    expect(lateNight).toBeLessThanOrEqual(1);
    expect(preDawn).toBeGreaterThanOrEqual(0);
    expect(preDawn).toBeLessThan(0.5 / 6);
  });
});
