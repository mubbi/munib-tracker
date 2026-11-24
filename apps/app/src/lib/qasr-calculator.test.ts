import { describe, expect, it } from "@jest/globals";
import { applyFiqhCustom, rulesForSchool } from "@munib-tracker/shared/fiqh";

import {
  computeQasr,
  computeQasrAllSchools,
  formatDistance,
  isResidentStay,
  KM_PER_MILE,
  toKm,
  travellerVerdict,
} from "./qasr-calculator";

const hanafi = rulesForSchool("hanafi");
const shafii = rulesForSchool("shafii");
const maliki = rulesForSchool("maliki");
const hanbali = rulesForSchool("hanbali");

describe("toKm / formatDistance", () => {
  it("converts miles and clamps bad input", () => {
    expect(toKm(48, "mi")).toBeCloseTo(48 * KM_PER_MILE);
    expect(toKm(-5, "km")).toBe(0);
    expect(toKm(Number.NaN, "km")).toBe(0);
    expect(formatDistance(77.25, "mi")).toBe(48);
    expect(formatDistance(81, "km")).toBe(81);
  });
});

describe("travellerVerdict", () => {
  it.each([
    [76.9, "no"],
    [77, "differ"],
    [77.9, "differ"],
    [78, "yes"],
    [300, "yes"],
  ] as const)("Hanafi %p km → %p", (km, verdict) => {
    expect(travellerVerdict(km, hanafi.travel.qasrDistanceKmRange)).toBe(verdict);
  });

  it("treats the four-burud conversion range as scholars differ", () => {
    expect(travellerVerdict(80, shafii.travel.qasrDistanceKmRange)).toBe("no");
    expect(travellerVerdict(85, shafii.travel.qasrDistanceKmRange)).toBe("differ");
    expect(travellerVerdict(89, shafii.travel.qasrDistanceKmRange)).toBe("yes");
  });
});

describe("isResidentStay", () => {
  it("Hanafi: 15 days or more", () => {
    expect(isResidentStay(14, hanafi.travel)).toBe(false);
    expect(isResidentStay(15, hanafi.travel)).toBe(true);
  });
  it("Shafi'i / Maliki: 4 full days or more", () => {
    expect(isResidentStay(3, shafii.travel)).toBe(false);
    expect(isResidentStay(4, shafii.travel)).toBe(true);
    expect(isResidentStay(4, maliki.travel)).toBe(true);
  });
  it("Hanbali: more than 4 days", () => {
    expect(isResidentStay(4, hanbali.travel)).toBe(false);
    expect(isResidentStay(5, hanbali.travel)).toBe(true);
  });
});

describe("computeQasr", () => {
  const trip = { distance: 100, unit: "km" as const, stayDays: 5 };

  it("Hanafi: traveller, qasr wajib, not resident at 5 days, no jam'", () => {
    const r = computeQasr(trip, hanafi);
    expect(r).toMatchObject({
      traveller: "yes",
      qasrStatus: "wajib",
      residentOnArrival: false,
      residencyDays: 15,
      jam: "not_allowed",
      rawatib: "optional_except_fajr",
    });
  });

  it("Hanafi: combining only on a Hajj trip (Arafah / Muzdalifah)", () => {
    expect(computeQasr({ ...trip, hajj: true }, hanafi).jam).toBe("hajj_only");
  });

  it("Shafi'i: concession, resident after 4 full days, jam' allowed", () => {
    const r = computeQasr(trip, shafii);
    expect(r).toMatchObject({
      traveller: "yes",
      qasrStatus: "concession",
      residentOnArrival: true,
      residencyExcludesTravelDays: true,
      jam: "allowed",
    });
  });

  it("Maliki: qasr is sunnah; Hanbali: rawatib left except Fajr sunnah and Witr", () => {
    expect(computeQasr(trip, maliki).qasrStatus).toBe("sunnah");
    expect(computeQasr(trip, hanbali)).toMatchObject({
      residentOnArrival: true,
      rawatib: "left_except_fajr_witr",
    });
  });

  it("48 miles is a Hanafi journey but below the four-burud range", () => {
    const input = { distance: 48.5, unit: "mi" as const, stayDays: 1 };
    expect(computeQasr(input, hanafi).traveller).toBe("yes");
    expect(computeQasr(input, shafii).traveller).toBe("no");
  });

  it("respects the user's custom qasr distance and residency days", () => {
    const custom = applyFiqhCustom(hanafi, { qasrDistanceKm: 60, residencyDays: 4 });
    const r = computeQasr({ distance: 65, unit: "km", stayDays: 4 }, custom);
    expect(r.traveller).toBe("yes");
    expect(r.thresholdKm).toEqual([60, 60]);
    expect(r.residentOnArrival).toBe(true);
  });
});

describe("computeQasrAllSchools", () => {
  it("returns one uncustomised row per school", () => {
    const rows = computeQasrAllSchools({ distance: 85, unit: "km", stayDays: 10 });
    expect(rows.map((r) => r.school)).toEqual(["hanafi", "shafii", "maliki", "hanbali"]);
    expect(rows.map((r) => r.result.traveller)).toEqual(["yes", "differ", "differ", "differ"]);
    expect(rows.map((r) => r.result.residentOnArrival)).toEqual([false, true, true, true]);
  });
});
