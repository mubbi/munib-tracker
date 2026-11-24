import { CALCULATION_METHOD_KEYS } from "@/lib/prayer-times";

import {
  methodSuggestionFor,
  methodSuggestionKey,
  SUGGESTED_METHOD_BY_COUNTRY,
  suggestedMethodForCountry,
} from "./prayer-method-suggestion";

describe("suggestedMethodForCountry", () => {
  it.each([
    ["SA", "UmmAlQura"],
    ["EG", "Egyptian"],
    ["PK", "Karachi"],
    ["IN", "Karachi"],
    ["BD", "Karachi"],
    ["US", "NorthAmerica"],
    ["CA", "NorthAmerica"],
    ["TR", "Turkey"],
    ["MY", "Singapore"],
    ["ID", "Singapore"],
    ["SG", "Singapore"],
    ["AE", "Dubai"],
    ["QA", "Qatar"],
    ["KW", "Kuwait"],
    ["IR", "Tehran"],
    ["GB", "MoonsightingCommittee"],
  ])("%s → %s", (code, method) => {
    expect(suggestedMethodForCountry(code)).toBe(method);
  });

  it("is case-insensitive and has no opinion on other countries", () => {
    expect(suggestedMethodForCountry("pk")).toBe("Karachi");
    expect(suggestedMethodForCountry("DE")).toBeNull();
    expect(suggestedMethodForCountry(undefined)).toBeNull();
    expect(suggestedMethodForCountry("")).toBeNull();
  });

  it("only suggests methods the adhan library implements", () => {
    for (const method of Object.values(SUGGESTED_METHOD_BY_COUNTRY)) {
      expect(CALCULATION_METHOD_KEYS).toContain(method);
      expect(method).not.toBe("Other");
    }
  });
});

describe("methodSuggestionFor", () => {
  const lahore = { source: "manual", countryCode: "PK", method: "MuslimWorldLeague" as const };

  it("offers the country's method when the current one differs", () => {
    expect(methodSuggestionFor(lahore)).toBe("Karachi");
  });

  it("stays quiet when it already matches, for the Makkah default, or without a country", () => {
    expect(methodSuggestionFor({ ...lahore, method: "Karachi" })).toBeNull();
    expect(methodSuggestionFor({ ...lahore, source: "default" })).toBeNull();
    expect(methodSuggestionFor({ ...lahore, countryCode: undefined })).toBeNull();
    expect(methodSuggestionFor({ ...lahore, countryCode: "DE" })).toBeNull();
  });

  it('respects "Keep current" for that country + suggestion only', () => {
    expect(methodSuggestionFor(lahore, methodSuggestionKey("PK", "Karachi"))).toBeNull();
    expect(methodSuggestionFor({ ...lahore, countryCode: "EG" }, "PK:Karachi")).toBe("Egyptian");
  });
});
