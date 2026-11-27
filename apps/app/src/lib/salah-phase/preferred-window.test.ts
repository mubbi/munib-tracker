import { describe, expect, it } from "@jest/globals";
import { MADHHAB_RULES } from "@munib-tracker/shared/fiqh";

import {
  ASR_YELLOWING_BEFORE_MAGHRIB_MIN,
  firstThirdOfNightEnd,
  ISFAR_REPEAT_BUFFER_MIN,
  type PreferredWindow,
  type PreferredWindowTimes,
  preferredWindowFor,
  preferredWindows,
} from "./preferred-window";

const at = (hhmm: string, day = 1) => new Date(`2026-03-0${day}T${hhmm}:00Z`);

/** Fajr 05:00, sunrise 06:30, Asr 15:30, Maghrib 18:00, Isha 19:30, next Fajr 05:00 (+1). */
const TIMES: PreferredWindowTimes = {
  fajr: at("05:00"),
  sunrise: at("06:30"),
  asr: at("15:30"),
  maghrib: at("18:00"),
  isha: at("19:30"),
  nextFajr: at("05:00", 2),
};

const hhmm = (d: Date) => d.toISOString().slice(11, 16);
const range = (w: PreferredWindow | null | undefined) =>
  w && w.kind === "band" ? `${w.mode} ${hhmm(w.start)}-${hhmm(w.end)}` : (w?.kind ?? null);

describe("preferredWindowFor", () => {
  it("Hanafi: Fajr isfar, Asr delayed before yellowing, Isha delayed to a third of the night", () => {
    const rules = MADHHAB_RULES.hanafi;
    expect(range(preferredWindowFor("fajr", TIMES, rules))).toBe("isfar 05:45-06:15");
    expect(range(preferredWindowFor("asr", TIMES, rules))).toBe(
      "delay_before_yellowing 16:25-17:20",
    );
    expect(range(preferredWindowFor("isha", TIMES, rules))).toBe("delay_third 20:35-21:40");
  });

  it("Shafi'i: Fajr taghlis, Asr early, Isha early", () => {
    const rules = MADHHAB_RULES.shafii;
    expect(range(preferredWindowFor("fajr", TIMES, rules))).toBe("taghlis 05:00-05:30");
    expect(range(preferredWindowFor("asr", TIMES, rules))).toBe("early 15:30-16:06");
    expect(range(preferredWindowFor("isha", TIMES, rules))).toBe("early 19:30-20:35");
  });

  it("Hanbali delays Isha but prays Fajr and Asr early; Maliki is early throughout", () => {
    expect(range(preferredWindowFor("isha", TIMES, MADHHAB_RULES.hanbali))).toMatch(/^delay_third/);
    expect(range(preferredWindowFor("fajr", TIMES, MADHHAB_RULES.hanbali))).toMatch(/^taghlis/);
    expect(range(preferredWindowFor("isha", TIMES, MADHHAB_RULES.maliki))).toMatch(/^early/);
  });

  it("all views returns a neutral marker, never a band", () => {
    for (const prayer of ["fajr", "asr", "isha"] as const) {
      expect(preferredWindowFor(prayer, TIMES, null)).toEqual({
        kind: "allViews",
        prayer,
        differenceId: `${prayer}.preferred`,
      });
    }
  });

  it("keeps the isfar band ending before sunrise and the Asr band before yellowing", () => {
    const fajr = preferredWindowFor("fajr", TIMES, MADHHAB_RULES.hanafi);
    const asr = preferredWindowFor("asr", TIMES, MADHHAB_RULES.hanafi);
    if (fajr?.kind !== "band" || asr?.kind !== "band") throw new Error("expected bands");
    expect(TIMES.sunrise.getTime() - fajr.end.getTime()).toBe(ISFAR_REPEAT_BUFFER_MIN * 60_000);
    expect(TIMES.maghrib.getTime() - asr.end.getTime()).toBe(
      ASR_YELLOWING_BEFORE_MAGHRIB_MIN * 60_000,
    );
  });

  it("drops a band it can't draw (Isha after a third of the night at high latitude)", () => {
    const late = { ...TIMES, isha: at("23:30") };
    expect(preferredWindowFor("isha", late, MADHHAB_RULES.hanafi)).toBeNull();
    expect(preferredWindows(late, MADHHAB_RULES.hanafi).isha).toBeUndefined();
  });
});

describe("firstThirdOfNightEnd", () => {
  it("is a third of the way from Maghrib to the next Fajr", () => {
    // 18:00 → 05:00 is 11 h; a third is 3 h 40 m.
    expect(hhmm(firstThirdOfNightEnd(TIMES))).toBe("21:40");
  });
});
