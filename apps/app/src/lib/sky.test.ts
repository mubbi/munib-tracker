import { computePrayerTimes, prayerSlots } from "@/lib/prayer-times";
import { SKY_PALETTES, type SkyMarkers, skyPalette, skyPhaseForTime } from "@/lib/sky";

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
