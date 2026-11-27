import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackCookieConsent } from "@/lib/analytics";
import { CONSENT_STORAGE_KEY } from "@/lib/consent-storage";
import { renderWithIntl } from "@/test-support/intl";
import { CONSENT_DELAY_MS, CookieConsentBanner } from "./cookie-consent-banner";

vi.mock("@/lib/analytics");
vi.mock("@/lib/gtag", async (original) => ({
  ...(await original<typeof import("@/lib/gtag")>()),
  getGaMeasurementId: () => "G-TEST123",
  applyAnalyticsFromCookiePreferences: vi.fn(),
  trackGtagPageView: vi.fn(),
}));

function stored() {
  const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
  return raw ? JSON.parse(raw).preferences : null;
}

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    vi.clearAllMocks();
  });
  afterEach(() => vi.useRealTimers());

  it("waits before asking, so the page is seen first", () => {
    renderWithIntl(<CookieConsentBanner />);
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => vi.advanceTimersByTime(CONSENT_DELAY_MS));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows on the first scroll without waiting", () => {
    renderWithIntl(<CookieConsentBanner />);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("is a non-modal card: the page behind stays usable", () => {
    renderWithIntl(<CookieConsentBanner />);
    act(() => vi.advanceTimersByTime(CONSENT_DELAY_MS));
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-modal");
  });

  it("makes allowing and declining equally easy (one click each)", () => {
    renderWithIntl(<CookieConsentBanner />);
    act(() => vi.advanceTimersByTime(CONSENT_DELAY_MS));
    fireEvent.click(screen.getByRole("button", { name: "Essential only" }));
    expect(stored()).toEqual({ essential: true, analytics: false });
    expect(trackCookieConsent).toHaveBeenCalledWith("essential_only", { analytics: false });
  });

  it("stores consent when analytics are allowed", () => {
    renderWithIntl(<CookieConsentBanner />);
    act(() => vi.advanceTimersByTime(CONSENT_DELAY_MS));
    fireEvent.click(screen.getByRole("button", { name: "Allow analytics" }));
    expect(stored()).toEqual({ essential: true, analytics: true });
  });

  it("keeps analytics off by default in the settings view", () => {
    renderWithIntl(<CookieConsentBanner />);
    act(() => vi.advanceTimersByTime(CONSENT_DELAY_MS));
    fireEvent.click(screen.getByRole("button", { name: "Choose what to allow" }));
    const analytics = screen.getByRole("switch", { name: /Analytics/ });
    expect(analytics).toHaveAttribute("aria-checked", "false");
    fireEvent.click(screen.getByRole("button", { name: "Save choices" }));
    expect(stored()).toEqual({ essential: true, analytics: false });
  });

  it("does not ask again once the visitor has chosen", () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ preferences: { essential: true, analytics: false }, version: "1.0" }),
    );
    renderWithIntl(<CookieConsentBanner />);
    act(() => vi.advanceTimersByTime(CONSENT_DELAY_MS * 2));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
