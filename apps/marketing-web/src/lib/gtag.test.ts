import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyAnalyticsFromCookiePreferences,
  ensureGtag,
  getGaMeasurementId,
  isGoogleAnalyticsConfigured,
  trackGtagEvent,
  trackGtagPageView,
} from "./gtag";

type BrowserGtagGlobal = typeof globalThis & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function resetGtagGlobal(): void {
  const g = globalThis as BrowserGtagGlobal;
  delete g.gtag;
  delete g.dataLayer;
}

describe("gtag", () => {
  const originalGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  beforeEach(() => {
    resetGtagGlobal();
  });

  afterEach(() => {
    resetGtagGlobal();
    if (originalGaId === undefined) {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalGaId;
    }
  });

  describe("getGaMeasurementId", () => {
    it("returns null when env is an empty string", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
      expect(getGaMeasurementId()).toBeNull();
    });

    it("returns null when env is unset or whitespace only", () => {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      expect(getGaMeasurementId()).toBeNull();

      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "   ";
      expect(getGaMeasurementId()).toBeNull();
    });

    it("returns a trimmed measurement id", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "  G-ABC123  ";
      expect(getGaMeasurementId()).toBe("G-ABC123");
    });
  });

  describe("isGoogleAnalyticsConfigured", () => {
    it("is false without a measurement id", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
      expect(isGoogleAnalyticsConfigured()).toBe(false);
    });

    it("is true when a measurement id is set", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST";
      expect(isGoogleAnalyticsConfigured()).toBe(true);
    });
  });

  describe("ensureGtag", () => {
    it("creates dataLayer and a gtag shim", () => {
      const gtag = ensureGtag();
      expect(gtag).toBeTypeOf("function");

      const g = globalThis as BrowserGtagGlobal;
      expect(g.dataLayer).toEqual([]);

      expect(gtag).toBeDefined();
      gtag?.("event", "test");
      expect(g.dataLayer?.length).toBeGreaterThan(0);
    });
  });

  describe("applyAnalyticsFromCookiePreferences", () => {
    it("pushes consent update to gtag", () => {
      const gtagSpy = vi.fn();
      (globalThis as BrowserGtagGlobal).gtag = gtagSpy;

      applyAnalyticsFromCookiePreferences({ essential: true, analytics: true });
      expect(gtagSpy).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });

      gtagSpy.mockClear();
      applyAnalyticsFromCookiePreferences({ essential: true, analytics: false });
      expect(gtagSpy).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    });
  });

  describe("trackGtagEvent", () => {
    it("no-ops when measurement id is empty", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
      const gtagSpy = vi.fn();
      (globalThis as BrowserGtagGlobal).gtag = gtagSpy;

      trackGtagEvent("download_click", { platform: "ios" });
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it("calls gtag with cleaned params when measurement id is set", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST";
      const gtagSpy = vi.fn();
      (globalThis as BrowserGtagGlobal).gtag = gtagSpy;

      trackGtagEvent("cta_click", { cta: "get_app", placement: undefined, page: "home" });
      expect(gtagSpy).toHaveBeenCalledWith("event", "cta_click", {
        cta: "get_app",
        page: "home",
      });
    });
  });

  describe("trackGtagPageView", () => {
    it("no-ops when measurement id is empty", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
      const gtagSpy = vi.fn();
      (globalThis as BrowserGtagGlobal).gtag = gtagSpy;

      trackGtagPageView("/features");
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it("calls gtag page_view and config when measurement id is set", () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST";
      const gtagSpy = vi.fn();
      (globalThis as BrowserGtagGlobal).gtag = gtagSpy;

      trackGtagPageView("/download", "Download");
      expect(gtagSpy).toHaveBeenCalledWith("event", "page_view", {
        page_path: "/download",
        page_title: "Download",
        page_location: expect.any(String),
      });
      expect(gtagSpy).toHaveBeenCalledWith("config", "G-TEST", { page_path: "/download" });
    });
  });
});
