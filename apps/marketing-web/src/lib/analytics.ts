import { type GtagEventParams, trackGtagEvent } from "@/lib/gtag";

export type DownloadPlatform = "ios" | "android" | "web";
export type DownloadPlacement =
  | "hero"
  | "cta"
  | "download"
  | "features"
  | "header"
  | "footer"
  | "learn"
  | "not_found";

export type CtaName =
  | "get_app"
  | "explore_features"
  | "explore_library"
  | "view_all_faq"
  | "return_home";

export type CtaPlacement =
  | DownloadPlacement
  | "home_learn"
  | "home_pillars"
  | "home_faq"
  | "home_bento";

export function trackDownloadClick(platform: DownloadPlatform, placement: DownloadPlacement): void {
  trackGtagEvent("download_click", { platform, placement });
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

export function trackDemoEngage(params: {
  demo: "audio_recitation" | "prayer_progress";
  action: "play" | "pause" | "complete" | "toggle_prayer";
  prayer?: string;
  completed_count?: number;
}): void {
  trackGtagEvent("demo_engage", {
    demo: params.demo,
    action: params.action,
    ...(params.prayer ? { prayer: params.prayer } : {}),
    ...(params.completed_count !== undefined ? { completed_count: params.completed_count } : {}),
    placement: "features",
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

export function trackWebDemoLaunch(placement: DownloadPlacement): void {
  trackDownloadClick("web", placement);
}

export function trackMarketingEvent(eventName: string, params?: GtagEventParams): void {
  trackGtagEvent(eventName, params);
}
