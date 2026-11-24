import * as Linking from "expo-linking";
import { Platform } from "react-native";

import { mapsDirectionsUrl } from "@/lib/masjid/maps-link";

/** Opens the OS maps app with directions to a masjid (no in-app map in v1). */
export function openDirections(target: { lat: number; lon: number; name?: string }): void {
  void Linking.openURL(mapsDirectionsUrl(target, Platform.OS)).catch(() => {
    // Android without a `geo:` handler: fall back to the web link.
    void Linking.openURL(mapsDirectionsUrl(target, "web")).catch(() => undefined);
  });
}
