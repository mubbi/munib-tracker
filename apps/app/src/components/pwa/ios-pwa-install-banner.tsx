import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getIosPwaInstallNeedsSafari, shouldShowIosPwaInstallBanner } from "@/lib/pwa/ios-install";
import { useToast } from "@/providers/toast-provider";

const DISMISS_KEY = "pwa_ios_install_banner_dismissed_v1";

async function copyPageUrl(): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}

/**
 * iOS WebKit: all browsers share the same PWA limits — install via Safari Share → Add to Home Screen.
 */
export function IosPwaInstallBanner() {
  const { t } = useTranslation();
  const toast = useToast();
  const { colors, tokens } = useThemeTokens();
  const [visible, setVisible] = useState(false);
  const showBanner = shouldShowIosPwaInstallBanner();
  const needsSafari = getIosPwaInstallNeedsSafari();

  useEffect(() => {
    if (Platform.OS !== "web" || !showBanner) {
      setVisible(false);
      return;
    }
    void AsyncStorage.getItem(DISMISS_KEY).then((v) => {
      setVisible(v !== "1");
    });
  }, [showBanner]);

  const dismiss = useCallback(() => {
    void AsyncStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }, []);

  const handleCopyLink = useCallback(() => {
    void copyPageUrl().then((ok) => {
      if (ok) toast.info(t("pwa.installCopyLink"), t("pwa.installLinkCopied"));
      else toast.error(t("pwa.installCopyLink"), t("pwa.installLinkCopyFailed"));
    });
  }, [t, toast]);

  if (Platform.OS !== "web" || !showBanner || !visible) return null;

  const stepsKey = needsSafari ? "pwa.installStepsViaSafari" : "notif.iosPwaSteps";

  return (
    <Card
      padding="three"
      style={[
        styles.card,
        {
          borderColor: tokens.accentBorder,
          backgroundColor: colors.card,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" style={styles.title}>
          {t("notif.iosPwaTitle")}
        </ThemedText>
        <PressableScale
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel={t("pwa.installDismiss")}
          hitSlop={12}
          style={styles.dismissBtn}
        >
          <ThemedText type="caption" themeColor="mutedForeground">
            ✕
          </ThemedText>
        </PressableScale>
      </View>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("pwa.installBannerMessage")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t(stepsKey)}
      </ThemedText>
      {needsSafari ? (
        <Button
          label={t("pwa.installCopyLink")}
          variant="secondary"
          onPress={handleCopyLink}
          style={{ borderColor: tokens.accentBorder }}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  dismissBtn: {
    padding: Spacing.one,
  },
});
