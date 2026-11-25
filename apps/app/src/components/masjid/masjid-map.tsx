import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { type MasjidMapProps, useMasjidMapHtml } from "@/components/masjid/masjid-map-shared";
import { ThemedText } from "@/components/themed-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Radius, Spacing } from "@/constants/theme";
import { parseMasjidMapMessage } from "@/lib/masjid/map-html";
import { openExternalLink } from "@/lib/open-external-link";

/** The map document is inline; only the CDN script, styles and tiles load over the network. */
const MAP_BASE_URL = "https://masjid-map.local/";

/** Inline map only: every link (e.g. the OSM/OpenFreeMap attribution) opens in the in-app browser. */
function shouldLoad(url: string): boolean {
  if (url === "about:blank" || url.startsWith(MAP_BASE_URL)) return true;
  if (/^https:\/\//i.test(url)) void openExternalLink(url);
  return false;
}

/**
 * Native masjid map: MapLibre + OpenFreeMap tiles in a WebView (no native map
 * SDK, no API key). Pins report taps back to the screen, which shows that
 * masjid's card under the map.
 */
export function MasjidMap({ me, masjids, onSelect, height }: MasjidMapProps) {
  const { t } = useTranslation();
  const html = useMasjidMapHtml(me, masjids);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const onMessage = (event: WebViewMessageEvent) => {
    const message = parseMasjidMapMessage(event.nativeEvent.data);
    if (!message) return;
    if (message.type === "select") onSelect(message.key);
    else setStatus(message.type);
  };

  return (
    <View
      style={[styles.frame, { height }]}
      testID="masjid-map"
      accessibilityLabel={t("masjids.mapA11y")}
    >
      {status === "error" ? (
        <View style={styles.center}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("masjids.mapUnavailable")}
          </ThemedText>
        </View>
      ) : (
        <WebView
          source={{ html, baseUrl: MAP_BASE_URL }}
          style={styles.webview}
          originWhitelist={["*"]}
          onShouldStartLoadWithRequest={(request) => shouldLoad(request.url)}
          onMessage={onMessage}
          onError={() => setStatus("error")}
          mixedContentMode="never"
          setSupportMultipleWindows={false}
          javaScriptEnabled
          domStorageEnabled={false}
          cacheEnabled
        />
      )}
      {status === "loading" ? (
        <View style={styles.overlay} pointerEvents="none">
          <Skeleton height={height} radius={Radius.lg} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: "100%", borderRadius: Radius.lg, overflow: "hidden" },
  webview: { flex: 1, backgroundColor: "transparent" },
  overlay: StyleSheet.absoluteFill,
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.three },
});
