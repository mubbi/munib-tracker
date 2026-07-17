import { createElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

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
 * Web: PDF.js in a sandboxed iframe (our zoom toolbar + scroll).
 * Avoids Chrome's embedded PDF UI, whose toolbar actions/zoom often fail in iframes.
 */
export function PdfPreview({ uri, fileName, headers, style, onOpenExternally }: PdfPreviewProps) {
  const { t } = useTranslation();
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setLoading(true);
    setFailed(false);
    setSrc(null);

    void (async () => {
      try {
        const base64 = await readAttachmentAsBase64({ uri, headers, fileName });
        if (cancelled) return;
        const html = buildPdfJsViewerHtml(base64);
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setSrc(url);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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

  if (loading || !src) {
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
      {createElement("iframe", {
        src,
        title: t("customAdhkar.attachments.pdfPreviewTitle"),
        // allow-scripts + allow-same-origin needed for PDF.js; sandbox keeps it contained.
        sandbox: "allow-scripts allow-same-origin",
        style: {
          width: "100%",
          height: "100%",
          border: "none",
          backgroundColor: "#111111",
          borderRadius: 12,
        },
      })}
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
