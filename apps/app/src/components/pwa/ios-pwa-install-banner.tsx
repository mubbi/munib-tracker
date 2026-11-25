import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  getIosPwaInstallNeedsSafari,
  getIosPwaInstallViaBrowserShare,
  shouldShowIosPwaInstallBanner,
} from "@/lib/pwa/ios-install";
import { useToast } from "@/providers/toast-provider";
import { InstallPromptBanner } from "./install-prompt-banner";
import { PwaBannerCard } from "./pwa-banner-card";

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
 * The home screen's install banner. iPhone / iPad (WebKit has no install
 * prompt): Share → Add to Home Screen steps for Safari / Chrome / Edge / Firefox
 * (iOS 16.4+), or "open in Safari" for other shells. Everywhere else:
 * `InstallPromptBanner` — the Chromium `beforeinstallprompt` button, or the
 * manual steps for Safari on macOS / Firefox on Android.
 */
export function IosPwaInstallBanner() {
  return shouldShowIosPwaInstallBanner() ? <IosSafariInstallSteps /> : <InstallPromptBanner />;
}

/** iOS WebKit: every browser shares the same PWA limits — install via Share → Add to Home Screen. */
function IosSafariInstallSteps() {
  const { t } = useTranslation();
  const toast = useToast();
  const { tokens } = useThemeTokens();
  const [visible, setVisible] = useState(false);
  const needsSafari = getIosPwaInstallNeedsSafari();
  const viaBrowserShare = !needsSafari && getIosPwaInstallViaBrowserShare();

  useEffect(() => {
    if (Platform.OS !== "web") return;
    let active = true;
    void AsyncStorage.getItem(DISMISS_KEY).then((v) => {
      if (active) setVisible(v !== "1");
    });
    return () => {
      active = false;
    };
  }, []);

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

  if (Platform.OS !== "web" || !visible) return null;

  const stepsKey = needsSafari
    ? "pwa.installStepsViaSafari"
    : viaBrowserShare
      ? "notif.iosPwaStepsBrowser"
      : "notif.iosPwaSteps";

  return (
    <PwaBannerCard title={t("notif.iosPwaTitle")} onDismiss={dismiss}>
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
    </PwaBannerCard>
  );
}
