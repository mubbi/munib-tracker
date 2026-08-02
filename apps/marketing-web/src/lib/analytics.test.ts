import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/gtag", () => ({
  trackGtagEvent: vi.fn(),
}));

import { trackGtagEvent } from "@/lib/gtag";
import {
  trackContactError,
  trackContactSubmit,
  trackCookieConsent,
  trackCtaClick,
  trackDownloadClick,
  trackFaqToggle,
  trackFileDownload,
  trackMarketingEvent,
  trackNavClick,
  trackOutboundClick,
  trackSelectContent,
  trackWebDemoLaunch,
} from "./analytics";

describe("analytics", () => {
  beforeEach(() => {
    vi.mocked(trackGtagEvent).mockClear();
  });

  it("trackDownloadClick forwards platform and placement", () => {
    trackDownloadClick("ios", "hero");
    expect(trackGtagEvent).toHaveBeenCalledWith("download_click", {
      platform: "ios",
      placement: "hero",
    });
  });

  it("trackCtaClick forwards cta and placement", () => {
    trackCtaClick("get_app", "hero");
    expect(trackGtagEvent).toHaveBeenCalledWith("cta_click", {
      cta: "get_app",
      placement: "hero",
    });
  });

  it("trackSelectContent forwards content fields and optional params", () => {
    trackSelectContent({
      content_type: "feature",
      item_id: "quran",
      link_url: "/features",
      placement: "home_bento",
    });
    expect(trackGtagEvent).toHaveBeenCalledWith("select_content", {
      content_type: "feature",
      item_id: "quran",
      link_url: "/features",
      placement: "home_bento",
    });

    trackSelectContent({ content_type: "faq", item_id: "offline" });
    expect(trackGtagEvent).toHaveBeenLastCalledWith("select_content", {
      content_type: "faq",
      item_id: "offline",
    });
  });

  it("trackFileDownload forwards file metadata", () => {
    trackFileDownload({
      file_name: "munib-tracker.apk",
      link_url: "https://example.com/app.apk",
      placement: "download",
    });
    expect(trackGtagEvent).toHaveBeenCalledWith("file_download", {
      file_name: "munib-tracker.apk",
      link_url: "https://example.com/app.apk",
      placement: "download",
    });
  });

  it("trackContactSubmit fires contact_form_submit", () => {
    trackContactSubmit();
    expect(trackGtagEvent).toHaveBeenCalledWith("contact_form_submit");
  });

  it("trackContactError forwards error_type", () => {
    trackContactError("validation");
    expect(trackGtagEvent).toHaveBeenCalledWith("contact_form_error", {
      error_type: "validation",
    });
  });

  it("trackFaqToggle forwards question index and expanded state", () => {
    trackFaqToggle(2, true);
    expect(trackGtagEvent).toHaveBeenCalledWith("faq_toggle", {
      question_index: 2,
      expanded: true,
    });
  });

  it("trackNavClick forwards section and page", () => {
    trackNavClick("features", "/");
    expect(trackGtagEvent).toHaveBeenCalledWith("section_nav", {
      section: "features",
      page: "/",
    });
  });

  it("trackOutboundClick forwards link metadata and optional placement", () => {
    trackOutboundClick("https://github.com/example", "GitHub", "footer");
    expect(trackGtagEvent).toHaveBeenCalledWith("outbound_click", {
      link_url: "https://github.com/example",
      link_text: "GitHub",
      placement: "footer",
    });

    trackOutboundClick("https://example.com", "Example");
    expect(trackGtagEvent).toHaveBeenLastCalledWith("outbound_click", {
      link_url: "https://example.com",
      link_text: "Example",
    });
  });

  it("trackWebDemoLaunch delegates to web download_click", () => {
    trackWebDemoLaunch("cta");
    expect(trackGtagEvent).toHaveBeenCalledWith("download_click", {
      platform: "web",
      placement: "cta",
    });
  });

  it("trackMarketingEvent forwards arbitrary events", () => {
    trackMarketingEvent("custom_event", { foo: "bar" });
    expect(trackGtagEvent).toHaveBeenCalledWith("custom_event", { foo: "bar" });
  });

  it("trackCookieConsent forwards action and analytics preference", () => {
    trackCookieConsent("accept_all", { analytics: true });
    expect(trackGtagEvent).toHaveBeenCalledWith("cookie_consent", {
      action: "accept_all",
      analytics: true,
    });
  });
});
