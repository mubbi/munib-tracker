import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  getStoredConsent,
  hasValidStoredConsent,
  setStoredConsent,
  toConsentItemId,
} from "./consent-storage";

describe("consent-storage", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("round-trips preferences in localStorage", () => {
    setStoredConsent({ essential: true, analytics: true });
    expect(getStoredConsent()).toEqual({
      preferences: { essential: true, analytics: true },
      version: CONSENT_VERSION,
    });
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toContain("analytics");
  });

  it("treats mismatched versions as invalid", () => {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ preferences: { essential: true, analytics: false }, version: "0.9" }),
    );
    const stored = getStoredConsent();
    expect(stored?.version).toBe("0.9");
    expect(hasValidStoredConsent(stored)).toBe(false);
  });

  it("returns null for corrupt storage", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "{not-json");
    expect(getStoredConsent()).toBeNull();
  });

  it("maps known consent item ids", () => {
    expect(toConsentItemId("analytics")).toBe("analytics");
    expect(toConsentItemId("ads")).toBeNull();
  });

  it("swallows localStorage write failures", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => setStoredConsent({ essential: true, analytics: false })).not.toThrow();
    spy.mockRestore();
  });
});
