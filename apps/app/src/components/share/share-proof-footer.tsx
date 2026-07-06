import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { useLocalizedSiteUrls } from "@/hooks/use-localized-site-urls";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { BRAND_QR_SHARE_PADDING } from "@/lib/share/brandQrConfig";
import { SHARE_PROOF_QR_GAP } from "@/lib/share/shareProofLayout";

type Props = {
  contentLabel?: string;
  exportedAtLabel: string;
  qrSize: number;
  onQrReady: () => void;
};

type DownloadQrItem = {
  key: "ios" | "android" | "web";
  url: string;
  label: string;
  a11y: string;
};

export function ShareProofFooter({ contentLabel, exportedAtLabel, qrSize, onQrReady }: Props) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { marketingHomeUrl, webAppUrl, iosAppStoreUrl, androidPlayStoreUrl } =
    useLocalizedSiteUrls();
  const alertColor = tokens.status.warning.color;

  const downloadItems = useMemo((): DownloadQrItem[] => {
    return [
      {
        key: "ios",
        url: iosAppStoreUrl,
        label: t("share.proofIosLabel", { defaultValue: "App Store" }),
        a11y: t("share.proofQrIosA11y", { defaultValue: "QR code — download on the App Store" }),
      },
      {
        key: "android",
        url: androidPlayStoreUrl,
        label: t("share.proofAndroidLabel", { defaultValue: "Google Play" }),
        a11y: t("share.proofQrAndroidA11y", { defaultValue: "QR code — get it on Google Play" }),
      },
      {
        key: "web",
        url: webAppUrl,
        label: t("share.proofWebLabel", { defaultValue: "Web app" }),
        a11y: t("share.proofQrWebA11y", { defaultValue: "QR code — open the web app" }),
      },
    ];
  }, [androidPlayStoreUrl, iosAppStoreUrl, t, webAppUrl]);

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.metaBlock}>
        {contentLabel ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {contentLabel}
          </ThemedText>
        ) : null}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("share.proofExportedAt", {
            exportedAt: exportedAtLabel,
            defaultValue: "Shared · {{exportedAt}}",
          })}
        </ThemedText>
      </View>

      <ThemedText type="smallBold" style={styles.getAppLabel}>
        {t("share.proofGetApp", { defaultValue: "Get Munib Tracker free" })}
      </ThemedText>

      <View style={[styles.qrRow, { gap: SHARE_PROOF_QR_GAP }]}>
        {downloadItems.map((item) => (
          <View key={item.key} style={[styles.qrCell, { width: qrSize }]}>
            <BrandQrCode
              data={item.url}
              size={qrSize}
              padding={BRAND_QR_SHARE_PADDING}
              accentColor={Brand.heroGlow}
              includeLogo={false}
              accessibilityLabel={item.a11y}
              onReady={onQrReady}
            />
            <ThemedText
              type="caption"
              themeColor="mutedForeground"
              style={styles.qrLabel}
              numberOfLines={2}
            >
              {item.label}
            </ThemedText>
          </View>
        ))}
      </View>

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.visitLink}>
        {t("share.proofOrVisit", {
          url: marketingHomeUrl,
          defaultValue: "OR visit: {{url}}",
        })}
      </ThemedText>

      <View
        style={[
          styles.confidentialAlert,
          {
            backgroundColor: `${alertColor}14`,
            borderColor: `${alertColor}45`,
          },
        ]}
        accessibilityRole="alert"
      >
        <SymbolView
          name={{ ios: "exclamationmark.circle", android: "error_outline", web: "error_outline" }}
          size={18}
          tintColor={alertColor}
          style={styles.confidentialIcon}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.confidentialNotice}>
          {t(
            "share.proofNotice",
            "Shared for benefit — please verify religious content with a trusted scholar.",
          )}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  metaBlock: {
    gap: 2,
  },
  getAppLabel: {
    textAlign: "center",
  },
  qrRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  qrCell: {
    alignItems: "center",
    gap: Spacing.one,
  },
  qrLabel: {
    textAlign: "center",
    fontWeight: "600",
  },
  visitLink: {
    textAlign: "center",
    lineHeight: 18,
  },
  confidentialAlert: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  confidentialIcon: {
    marginTop: 1,
  },
  confidentialNotice: {
    flex: 1,
    lineHeight: 18,
    fontStyle: "italic",
  },
});
