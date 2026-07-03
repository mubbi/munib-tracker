import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWeb } from "@/lib/notifications/platform";
import { beginWebNotificationPermissionRequest } from "@/lib/notifications/web-environment";
import { useToast } from "@/providers/toast-provider";

type NotificationPermissionBannerProps = {
  showWhenGranted?: boolean;
};

export function NotificationPermissionBanner({
  showWhenGranted = false,
}: NotificationPermissionBannerProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { tokens } = useThemeTokens();
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
        }
      });
      return;
    }
    void requestPermission().then((result) => {
      if (!result.granted) {
        toast.warning(t("notif.permissionDenied"), t("notif.openSettingsHint"));
      }
    });
  };

  let title = t("notif.permissionBannerTitle");
  let message = t("notif.permissionBannerMessage");
  let steps: string | undefined;
  let showAllow = !granted && canEnableLocalReminders && !isExpoGo;
  const showOpenSettings = !isWeb && (denied || granted);

  if (isExpoGo) {
    // Expo Go can't schedule OS notifications — needs a dev/production build.
    title = t("notif.expoGoTitle");
    message = t("notif.expoGoMessage");
    showAllow = false;
  } else if (isWeb) {
    // Bowser-based tiering: never show iOS steps on desktop/Android Chrome.
    switch (webGuidance.tier) {
      case "ios_webkit_tab":
        title = t("notif.iosPwaTitle");
        message = t("notif.iosPwaMessage");
        steps = webGuidance.needsSafariForInstall
          ? t("notif.iosPwaStepsSafari")
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

  const hasAnyAction = showAllow || showOpenSettings;

  return (
    <Card
      padding="three"
      style={[styles.card, { borderColor: `${tokens.status.warning.color}55` }]}
    >
      <ThemedText type="smallBold">{title}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {message}
      </ThemedText>
      {steps ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {steps}
        </ThemedText>
      ) : null}
      {hasAnyAction ? (
        <View style={styles.actions}>
          {showAllow ? <Button label={t("notifCenter.enable")} onPress={handleAllow} /> : null}
          {showOpenSettings ? (
            <Button label={t("notif.openSettings")} variant="secondary" onPress={openSettings} />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    borderWidth: 1,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
});
