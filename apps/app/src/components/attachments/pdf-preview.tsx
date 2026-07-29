import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { buildPdfJsViewerHtml, readAttachmentAsBase64 } from "@/lib/attachments/pdf-preview-source";

type PdfPreviewProps = {
  uri: string;
  fileName: string;
  headers?: Record<string, string>;
  style?: StyleProp<ViewStyle>;
  onOpenExternally?: () => void;
};

/**
 * Native PDF preview via PDF.js (scroll + pinch/toolbar zoom).
 * Avoids system PDF chrome so zoom/read controls stay reliable in-app.
 */
export function PdfPreview({ uri, fileName, headers, style, onOpenExternally }: PdfPreviewProps) {
  const { t } = useTranslation();
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setHtml(null);

    void (async () => {
      try {
        const base64 = await readAttachmentAsBase64({ uri, headers, fileName });
        if (cancelled) return;
        setHtml(buildPdfJsViewerHtml(base64));
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uri, headers, fileName]);

  if (failed) {
    return (
      <View style={[styles.center, style]}>
        <ThemedText type="caption" style={styles.message}>
          {t("customAdhkar.attachments.openFailed")}
        </ThemedText>
        {onOpenExternally ? (
          <Button label={t("customAdhkar.attachments.openPdf")} onPress={onOpenExternally} />
        ) : null}
      </View>
    );
  }

  if (loading || !html) {
    return (
      <View style={[styles.center, style]}>
        <ActivityIndicator color="#FFFFFF" />
        <ThemedText type="caption" style={styles.message}>
          {t("customAdhkar.attachments.loadingPdf")}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.frame, style]}>
      <WebView
        source={{ html, baseUrl: "https://localhost/" }}
        style={styles.webview}
        originWhitelist={["*"]}
        mixedContentMode="always"
        allowsInlineMediaPlayback
        setSupportMultipleWindows={false}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit={false}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        )}
        onError={() => setFailed(true)}
        onHttpError={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    borderRadius: 12,
  },
  webview: {
    flex: 1,
    backgroundColor: "#111111",
  },
  webviewLoading: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
  },
  center: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  message: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
});
