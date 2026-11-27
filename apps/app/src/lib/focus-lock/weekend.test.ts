import {
  effectiveWeekendDays,
  regionWeekendDays,
  SAT_SUN,
  sanitizeWeekendDays,
  WEEKEND_BY_COUNTRY,
  weekendRegionFor,
} from "./weekend";

describe("regionWeekendDays (D37)", () => {
  it.each([
    ["SA", [5, 6]],
    ["QA", [5, 6]],
    ["KW", [5, 6]],
    ["BH", [5, 6]],
    ["OM", [5, 6]],
    ["EG", [5, 6]],
    ["JO", [5, 6]],
    ["IQ", [5, 6]],
    ["BD", [5, 6]],
    ["AF", [5, 6]],
    ["IR", [5]],
    ["SO", [5]],
    ["BN", [0, 5]],
    // Moved to Saturday + Sunday in 2022.
    ["AE", [0, 6]],
    ["PK", [0, 6]],
    ["GB", [0, 6]],
  ])("country code %s → %j", (country, days) => {
    expect(regionWeekendDays({ country })).toEqual(days);
  });

  it("reads English country names case-insensitively", () => {
    expect(regionWeekendDays({ country: "Saudi Arabia" })).toEqual([5, 6]);
    expect(regionWeekendDays({ country: " iran " })).toEqual([5]);
    expect(regionWeekendDays({ country: "Brunei Darussalam" })).toEqual([0, 5]);
  });

  it("a recognised country wins over the timezone", () => {
    expect(regionWeekendDays({ country: "GB", deviceTimeZone: "Asia/Riyadh" })).toEqual([0, 6]);
    expect(regionWeekendDays({ country: "Qatar", deviceTimeZone: "Europe/London" })).toEqual([
      5, 6,
    ]);
  });

  it("falls back to the location's timezone, then the device's", () => {
    // A localised (non-English) country name isn't in the table.
    expect(
      regionWeekendDays({ country: "المملكة العربية السعودية", deviceTimeZone: "Asia/Riyadh" }),
    ).toEqual([5, 6]);
    expect(regionWeekendDays({ timeZone: "Asia/Tehran", deviceTimeZone: "Asia/Riyadh" })).toEqual([
      5,
    ]);
    // A manual city's own timezone decides even when it is a Saturday + Sunday zone.
    expect(regionWeekendDays({ timeZone: "Europe/London", deviceTimeZone: "Asia/Riyadh" })).toEqual(
      [0, 6],
    );
    expect(regionWeekendDays({ deviceTimeZone: "Asia/Dhaka" })).toEqual([5, 6]);
  });

  it("defaults to Saturday + Sunday when nothing is known", () => {
    expect(regionWeekendDays({})).toEqual([0, 6]);
    expect(regionWeekendDays({ country: "Atlantis", deviceTimeZone: "Mars/Base" })).toEqual([0, 6]);
  });

  it("returns fresh arrays (callers may mutate)", () => {
    const a = regionWeekendDays({ country: "SA" });
    a.push(1);
    expect(WEEKEND_BY_COUNTRY.SA).toEqual([5, 6]);
    expect(SAT_SUN).toEqual([0, 6]);
  });
});

describe("weekendRegionFor", () => {
  it("ignores the placeholder (Makkah) location and uses the device timezone only", () => {
    const region = weekendRegionFor({ country: "Saudi Arabia", source: "default" });
    expect(region.country).toBeUndefined();
    expect(region.timeZone).toBeUndefined();
  });

  it("passes a real location's country and timezone through", () => {
    expect(
      weekendRegionFor({ country: "Egypt", timeZone: "Africa/Cairo", source: "manual" }),
    ).toMatchObject({ country: "Egypt", timeZone: "Africa/Cairo" });
  });
});

describe("sanitizeWeekendDays / effectiveWeekendDays", () => {
  it("keeps unique, sorted 0–6 integers and rejects a 7-day weekend", () => {
    expect(sanitizeWeekendDays([6, 5, 6, 7, -1, 1.5, "0"])).toEqual([5, 6]);
    expect(sanitizeWeekendDays([0, 1, 2, 3, 4, 5, 6])).toBeUndefined();
    expect(sanitizeWeekendDays(undefined)).toBeUndefined();
    expect(sanitizeWeekendDays([])).toEqual([]);
  });

  it("prefers the user's choice over the region", () => {
    expect(effectiveWeekendDays({ weekendDays: [0] }, { country: "SA" })).toEqual([0]);
    expect(effectiveWeekendDays({ weekendDays: [] }, { country: "SA" })).toEqual([]);
    expect(effectiveWeekendDays({}, { country: "SA" })).toEqual([5, 6]);
  });
});
