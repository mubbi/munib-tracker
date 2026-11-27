import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Callout, type CalloutTone } from "@/components/ui/callout";
import { Spacing } from "@/constants/theme";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { isWeb } from "@/lib/notifications/platform";
import {
  beginWebNotificationPermissionRequest,
  canRequestWebNotificationPermission,
} from "@/lib/notifications/web-environment";
import { enableNotifications } from "@/lib/settings/actions";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

type NotificationPermissionBannerProps = {
  showWhenGranted?: boolean;
};

export function NotificationPermissionBanner({
  showWhenGranted = false,
}: NotificationPermissionBannerProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { session } = useAuth();
  const {
    permission,
    granted,
    denied,
    requestPermission,
    openSettings,
    canEnableLocalReminders,
    isExpoGo,
    webGuidance,
  } = useNotificationPermissions();

  if (!showWhenGranted && granted) return null;
  if (!canEnableLocalReminders && !isWeb) return null;
  // F-06: the Expo Go notice is developer tooling — never shown in a release build.
  if (isExpoGo && !__DEV__) return null;

  // Permission already granted by this banner's own flow — the shared action sets
  // the master switch, reschedules and registers the push token.
  const onGranted = () =>
    enableNotifications({ permissionGranted: true, accessToken: session?.accessToken });

  const handleAllow = () => {
    if (isWeb) {
      const started = beginWebNotificationPermissionRequest();
      if (started == null && permission === "undetermined") {
        toast.info(t("notif.webUseAllowButton"));
        return;
      }
      void requestPermission({ webPermissionRequest: started }).then((result) => {
        if (!result.granted) {
          toast.warning(t("notif.permissionDenied"), t("notif.permissionDeniedSub"));
          return;
        }
        void onGranted();
      });
      return;
    }
    void requestPermission().then((result) => {
      if (!result.granted) {
        toast.warning(t("notif.permissionDenied"), t("notif.openSettingsHint"));
        return;
      }
      void onGranted();
    });
  };

  let title = t("notif.permissionBannerTitle");
  let message = t("notif.permissionBannerMessage");
  let steps: string | undefined;
  const canRequestPermission = isWeb
    ? canRequestWebNotificationPermission()
    : canEnableLocalReminders;
  let showAllow = !granted && !denied && canRequestPermission && !isExpoGo;
  const showOpenSettings = !isWeb && (denied || granted);

  let tone: CalloutTone = denied ? "warning" : "info";
  if (isExpoGo) {
    // Expo Go (dev only, see above) can't schedule OS notifications.
    title = t("notif.expoGoTitle");
    message = t("notif.expoGoMessage");
    showAllow = false;
  } else if (isWeb) {
    // Bowser-based tiering: never show iOS steps on desktop/Android Chrome.
    switch (webGuidance.tier) {
      case "ios_webkit_tab":
        title = t("notif.iosPwaTitle");
        message = t("notif.iosPwaMessage");
        // iOS 16.4+ Chrome / Edge / Firefox add to the Home Screen from their own
        // Share menu; other shells must hand off to Safari.
        steps = webGuidance.needsSafariForInstall
          ? t("notif.iosPwaStepsSafari")
          : webGuidance.installMethod === "ios_browser_share"
            ? t("notif.iosPwaStepsBrowser")
            : t("notif.iosPwaSteps");
        showAllow = false;
        break;
      case "ios_webkit_installed":
        // Installed PWA on iOS can prompt for notifications directly.
        if (granted) {
          title = t("notif.permissionGrantedTitle");
          message = t("notif.permissionGrantedMessage");
        } else if (denied) {
          title = t("notif.permissionDenied");
          message = t("notif.openSettingsHint");
        } else {
          message = t("notif.webAllowMessage");
        }
        break;
      case "chromium_full":
        if (granted) {
          title = t("notif.permissionGrantedTitle");
          message = t("notif.webGrantedMobileNote");
        } else if (denied) {
          title = t("notif.permissionDenied");
          message = t("notif.permissionDeniedSub");
        } else {
          message = t("notif.webAllowMessage");
        }
        break;
      default:
        // limited_web (Firefox/desktop Safari) and unknown: reminders are mobile-only.
        title = t("notif.webLimitedTitle");
        message = t("notifCenter.webNote");
        showAllow = false;
        break;
    }
  } else if (granted) {
    title = t("notif.permissionGrantedTitle");
    message = t("notif.permissionGrantedMessage");
  } else if (denied) {
    title = t("notif.permissionDenied");
    message = t("notif.openSettingsHint");
  }

  if (granted) tone = "success";

  // One banner, one action (they are mutually exclusive): Allow, or Open Settings.
  const action = showAllow
    ? { label: t("notifCenter.enable"), onPress: handleAllow }
    : showOpenSettings
      ? { label: t("notif.openSettings"), onPress: openSettings }
      : undefined;

  return (
    <Callout tone={tone} title={title} action={action}>
      <View style={styles.body}>
        <ThemedText type="small" themeColor="mutedForeground">
          {message}
        </ThemedText>
        {steps ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {steps}
          </ThemedText>
        ) : null}
      </View>
    </Callout>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.one },
});
