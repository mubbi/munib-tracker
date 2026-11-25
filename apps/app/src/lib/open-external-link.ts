import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

/**
 * Opens an outside web page (credits, a masjid's website, OpenStreetMap) without
 * taking the user out of the app:
 *
 * - Web: a new tab, detached from this page (`noopener`), so the app tab stays put.
 * - iOS / Android: the in-app browser (SFSafariViewController / Custom Tabs) —
 *   the user closes it and is back where they were. On TV, `expo-web-browser`
 *   resolves to `lib/tv-stubs`, which hands the link to the system.
 *
 * Only http(s) links are opened; anything else is ignored.
 */
export async function openExternalLink(url: string): Promise<void> {
  if (!/^https?:\/\//i.test(url)) return;
  if (Platform.OS === "web") {
    openInNewTab(url);
    return;
  }
  await WebBrowser.openBrowserAsync(url).catch(() => undefined);
}

/**
 * Web only: opens `url` in a new tab with no handle back to this page. Call it
 * straight from the click handler (before any `await`) so it isn't blocked as
 * a popup; if the browser blocks it anyway, this tab navigates instead.
 * (`expo-web-browser` on web opens a sized popup window, not a tab.)
 */
export function openInNewTab(url: string): void {
  if (typeof window === "undefined") return;
  const tab = window.open(url, "_blank");
  if (tab) tab.opener = null;
  else window.location.assign(url);
}
