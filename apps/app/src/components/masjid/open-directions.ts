import * as Linking from "expo-linking";
import { Platform } from "react-native";

import { googleMapsAppUrl, mapsDirectionsUrl } from "@/lib/masjid/maps-link";
import { openExternalLink, openInNewTab } from "@/lib/open-external-link";

type Target = { lat: number; lon: number; name?: string };

/**
 * Opens directions to a masjid in Google Maps. Routing happens there — no
 * directions API, no quota.
 *
 * - Web: a new tab, so the finder stays open (on a phone browser, Google Maps
 *   offers its app from there).
 * - iOS: the Google Maps app via its URL scheme when installed (the https link
 *   alone usually lands in Safari); otherwise Google Maps in the in-app browser.
 * - Android: the https link, which Google Maps claims as an app link — the app
 *   when installed, else the browser.
 */
export async function openDirections(target: Target): Promise<void> {
  const webUrl = mapsDirectionsUrl(target);

  if (Platform.OS === "web") {
    openInNewTab(webUrl);
    return;
  }

  if (Platform.OS === "ios") {
    try {
      // `openURL` rejects when no app handles the scheme — no Info.plist query entry needed.
      await Linking.openURL(googleMapsAppUrl(target));
    } catch {
      await openExternalLink(webUrl);
    }
    return;
  }

  await Linking.openURL(webUrl).catch(() => undefined);
}
