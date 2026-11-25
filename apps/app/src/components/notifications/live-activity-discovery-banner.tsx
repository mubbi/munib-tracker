import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { BorderWidth, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isLiveActivitySupported } from "@/lib/live-activity";
import { useSetting } from "@/lib/settings/use-setting";
import { useHasSeenTour, useToursActions } from "@/stores/tours-store";

/** Tours-store id for the one-shot Live Activity / countdown notification coach mark. */
export const LIVE_ACTIVITY_DISCOVERY_TOUR_ID = "liveActivityDiscovery";

/**
 * One-shot discovery banner shown above the Live Activity toggle (NF-1.18/1.19)
 * when the feature is available but still off. Dismisses itself permanently
 * once turned on or explicitly closed — deliberately lighter than the full
 * `/tour` carousel since this is a single-toggle nudge, not a multi-step tour.
 */
export function LiveActivityDiscoveryBanner() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  // Shortcut to Settings › Reminders & notifications › Live Activity (device pref).
  const liveActivity = useSetting<boolean>("notifications.salah.liveActivity");
  const { markSeen } = useToursActions();
  const seen = useHasSeenTour(LIVE_ACTIVITY_DISCOVERY_TOUR_ID);

  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  const supported = isAndroid || (isIOS && isLiveActivitySupported());
  const alreadyOn = liveActivity.value === true;

  if (!supported || alreadyOn || seen) return null;

  const dismiss = () => void markSeen(LIVE_ACTIVITY_DISCOVERY_TOUR_ID);
  const enable = () => {
    void liveActivity.setValue(true);
    dismiss();
  };

  return (
    <Card style={[styles.card, { backgroundColor: tokens.accentSoft, borderColor: colors.accent }]}>
      <View style={styles.header}>
        <IconWell
          icon={{
            ios: "platter.filled.top.iphone",
            android: "widgets",
            web: "widgets",
          }}
          tint={colors.accent}
          background={colors.background}
          well={40}
          size={18}
        />
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">{t("notif.liveActivityDiscoveryTitle")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {isAndroid
              ? t("notif.liveActivityDiscoveryBodyAndroid")
              : t("notif.liveActivityDiscoveryBodyIos")}
          </ThemedText>
        </View>
        <IconButton
          name={{ ios: "xmark", android: "close", web: "close" }}
          accessibilityLabel={t("notif.liveActivityDiscoveryDismissA11y")}
          onPress={dismiss}
          size={16}
          tintColor={colors.mutedForeground}
          haptic="light"
        />
      </View>
      <Button label={t("notif.liveActivityDiscoveryEnable")} onPress={enable} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    borderWidth: BorderWidth.thin,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  headerCopy: {
    flex: 1,
    gap: Spacing.half,
    paddingTop: Spacing.half,
  },
});
