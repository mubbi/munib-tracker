import { Platform } from "react-native";

/**
 * User-agents that should see the requested URL's SEO tags without being
 * client-redirected into onboarding (`/intro` is `noindex`).
 *
 * Lighthouse / PageSpeed and major crawlers use a fresh profile, so without
 * this gate they always land on onboarding and fail "Indexing allowed?".
 */
const INDEXING_BOT_RE =
  /Googlebot|Google-InspectionTool|Chrome-Lighthouse|PageSpeed|bingbot|BingPreview|Slurp|DuckDuckBot|Baiduspider|Yandex(Bot|Images)|facebookexternalhit|Twitterbot|LinkedInBot|Applebot|GPTBot|ClaudeBot|PerplexityBot|Bytespider|Amazonbot|CCBot/i;

export function isIndexingBot(userAgent = getWebUserAgent()): boolean {
  if (Platform.OS !== "web" || !userAgent) return false;
  return INDEXING_BOT_RE.test(userAgent);
}

function getWebUserAgent(): string {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent ?? "";
}
