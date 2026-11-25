import { createElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { type MasjidMapProps, useMasjidMapHtml } from "@/components/masjid/masjid-map-shared";
import { ThemedText } from "@/components/themed-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Radius, Spacing } from "@/constants/theme";
import { parseMasjidMapMessage } from "@/lib/masjid/map-html";

/**
 * Web masjid map: the same MapLibre document in a `srcdoc` iframe sandboxed to
 * `allow-scripts` (opaque origin — it can't touch the app's storage, cookies or
 * session). Attribution links may open a new tab; nothing can navigate the app.
 */
export function MasjidMap({ me, masjids, onSelect, height }: MasjidMapProps) {
  const { t } = useTranslation();
  const html = useMasjidMapHtml(me, masjids);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const frame = useRef<HTMLIFrameElement | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new document (html) restarts the load state.
  useEffect(() => {
    setStatus("loading");
    const onMessage = (event: MessageEvent) => {
      // Only our own iframe (its origin is opaque, so match the window instead).
      if (!frame.current || event.source !== frame.current.contentWindow) return;
      const message = parseMasjidMapMessage(event.data);
      if (!message) return;
      if (message.type === "select") onSelectRef.current(message.key);
      else setStatus(message.type);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [html]);

  return (
    <View style={[styles.frame, { height }]} testID="masjid-map">
      {status === "error" ? (
        <View style={styles.center}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("masjids.mapUnavailable")}
          </ThemedText>
        </View>
      ) : (
        createElement("iframe", {
          ref: frame,
          srcDoc: html,
          title: t("masjids.mapA11y"),
          sandbox: "allow-scripts allow-popups allow-popups-to-escape-sandbox",
          referrerPolicy: "no-referrer",
          style: { border: 0, width: "100%", height: "100%", display: "block" },
        })
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
  overlay: StyleSheet.absoluteFill,
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: Spacing.three },
});
