import { type GtagEventParams, trackGtagEvent } from "@/lib/gtag";

export type DownloadPlatform = "ios" | "android" | "web";
export type DownloadPlacement =
  | "hero"
  | "cta"
  | "download"
  | "download_watch"
  | "download_tv"
  | "features"
  | "header"
  | "footer"
  | "learn"
  | "not_found"
  | "feature_page"
  | "feature_hero"
  | "article_tie_in"
  | "audience_page"
  | "compare_page"
  | "article"
  | "hub_page"
  | "how_it_works_page"
  | "why_page"
  | "home_privacy";

export type CtaName =
  | "get_app"
  | "explore_features"
  | "explore_library"
  | "try_quran_practice"
  | "view_all_faq"
  | "return_home"
  | "how_it_works"
  | "compare_apps"
  | "read_guides"
  | "our_principles";

export type CtaPlacement =
  | DownloadPlacement
  | "home_learn"
  | "home_faq"
  | "home_ai_practice"
  | "home_tour"
  | "home_features"
  | "home_how_it_works"
  | "home_compare";

/**
 * A store badge or web-app link was clicked. `feature` is the feature page
 * (slug) the click came from, so installs and web trials can be attributed to
 * the feature that convinced the visitor.
 */
export function trackDownloadClick(
  platform: DownloadPlatform,
  placement: DownloadPlacement,
  feature?: string,
): void {
  trackGtagEvent("download_click", { platform, placement, feature });
}

export function trackCtaClick(cta: CtaName, placement: CtaPlacement): void {
  trackGtagEvent("cta_click", { cta, placement });
}

export function trackSelectContent(params: {
  content_type: string;
  item_id: string;
  link_url?: string;
  placement?: string;
}): void {
  trackGtagEvent("select_content", {
    content_type: params.content_type,
    item_id: params.item_id,
    ...(params.link_url ? { link_url: params.link_url } : {}),
    ...(params.placement ? { placement: params.placement } : {}),
  });
}

export function trackFileDownload(params: {
  file_name: string;
  link_url: string;
  placement: string;
}): void {
  trackGtagEvent("file_download", {
    file_name: params.file_name,
    link_url: params.link_url,
    placement: params.placement,
  });
}

export function trackContactSubmit(): void {
  trackGtagEvent("contact_form_submit");
}

export function trackContactError(errorType: "validation" | "server"): void {
  trackGtagEvent("contact_form_error", { error_type: errorType });
}

export function trackFaqToggle(questionIndex: number, expanded: boolean): void {
  trackGtagEvent("faq_toggle", { question_index: questionIndex, expanded });
}

export function trackNavClick(section: string, pathname: string): void {
  trackGtagEvent("section_nav", { section, page: pathname });
}

export function trackOutboundClick(url: string, linkText: string, placement?: string): void {
  trackGtagEvent("outbound_click", {
    link_url: url,
    link_text: linkText,
    ...(placement ? { placement } : {}),
  });
}

export function trackWebDemoLaunch(placement: DownloadPlacement, feature?: string): void {
  trackDownloadClick("web", placement, feature);
}

/** A header menu was opened (desktop mega-menu or the mobile drawer). */
export function trackMenuOpen(menu: string, device: "desktop" | "mobile"): void {
  trackGtagEvent("menu_open", { menu, device });
}

/** The visitor picked another site language. */
export function trackLanguageSwitch(from: string, to: string): void {
  trackGtagEvent("language_switch", { from_language: from, to_language: to });
}

/** How far down a page the visitor read (25 / 50 / 75 / 90 %, once each per page view). */
export function trackScrollDepth(percent: number): void {
  trackGtagEvent("scroll_depth", { percent });
}

export function trackMarketingEvent(eventName: string, params?: GtagEventParams): void {
  trackGtagEvent(eventName, params);
}

export function trackCookieConsent(
  action: "accept_all" | "essential_only" | "save_choices",
  prefs: { analytics: boolean },
): void {
  trackGtagEvent("cookie_consent", { action, analytics: prefs.analytics });
}
