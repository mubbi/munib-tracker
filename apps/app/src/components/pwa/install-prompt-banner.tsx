import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { getWebPwaInstallMethod } from "@/lib/notifications/browser-capabilities";
import { isWebPushStandalonePwa } from "@/lib/pwa/display-mode";
import {
  listenForInstallPrompt,
  promptInstall,
  useInstallPromptAvailable,
} from "./install-prompt-store";
import { PwaBannerCard } from "./pwa-banner-card";

export const INSTALL_PROMPT_DISMISS_KEY = "pwa_install_prompt_dismissed_v1";

/** Browsers with no install event: the steps the vendor documents instead. */
const MANUAL_STEPS_KEY = {
  // Safari 17+ on macOS Sonoma: File → Add to Dock (WebKit blog #14445).
  mac_add_to_dock: "pwa.installStepsMacSafari",
  // Firefox (and other non-Chromium browsers) on Android: browser menu.
  browser_menu: "pwa.installStepsBrowserMenu",
} as const;

/**
 * Install affordance outside iOS. Chromium (Android Chrome, desktop Chrome /
 * Edge / Brave, Samsung Internet): shown only after the browser fired
 * `beforeinstallprompt`; "Install" opens the browser's own install dialog.
 * Safari on macOS and Firefox on Android never fire that event, so they get the
 * documented manual steps instead. Never inside the installed app, and never
 * again once dismissed.
 */
export function InstallPromptBanner() {
  const { t } = useTranslation();
  const available = useInstallPromptAvailable();
  // null = dismissal flag not read yet (render nothing rather than flash).
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [installing, setInstalling] = useState(false);
  const [manualStepsKey] = useState(() => {
    const method = getWebPwaInstallMethod();
    return method === "mac_add_to_dock" || method === "browser_menu"
      ? MANUAL_STEPS_KEY[method]
      : null;
  });

  useEffect(() => {
    if (Platform.OS !== "web") return;
    // Idempotent — WebPwaBootstrap normally started this at launch.
    listenForInstallPrompt();
    let active = true;
    void AsyncStorage.getItem(INSTALL_PROMPT_DISMISS_KEY).then((value) => {
      if (active) setDismissed(value === "1");
    });
    return () => {
      active = false;
    };
  }, []);

  const dismiss = useCallback(() => {
    void AsyncStorage.setItem(INSTALL_PROMPT_DISMISS_KEY, "1");
    setDismissed(true);
  }, []);

  const install = useCallback(() => {
    setInstalling(true);
    void promptInstall().finally(() => setInstalling(false));
  }, []);

  if (Platform.OS !== "web" || dismissed !== false || isWebPushStandalonePwa()) return null;

  if (available) {
    return (
      <PwaBannerCard title={t("pwa.installPromptTitle")} onDismiss={dismiss}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("pwa.installPromptMessage")}
        </ThemedText>
        <Button
          label={t("pwa.installPromptAction")}
          icon={{ ios: "arrow.down.circle", android: "download", web: "download" }}
          onPress={install}
          loading={installing}
        />
      </PwaBannerCard>
    );
  }

  if (!manualStepsKey) return null;
  return (
    <PwaBannerCard title={t("pwa.installPromptTitle")} onDismiss={dismiss}>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("pwa.installPromptMessage")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t(manualStepsKey)}
      </ThemedText>
    </PwaBannerCard>
  );
}
