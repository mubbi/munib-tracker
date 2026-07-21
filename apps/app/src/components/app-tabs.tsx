import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";
import { Platform, useWindowDimensions } from "react-native";

import { WideAppTabs } from "@/components/app-tabs-wide";
import { withAlpha } from "@/constants/theme";
import { SIDE_RAIL_BREAKPOINT } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export default function AppTabs() {
  const { width } = useWindowDimensions();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  // Wide windows (iPad / Android tablet / foldable): side rail — same adaptive
  // breakpoint as web. Driven by window width, not device type.
  if (width >= SIDE_RAIL_BREAKPOINT) {
    return <WideAppTabs />;
  }

  return (
    <NativeTabs
      // Android keeps its themed Material 3 surface; on iOS we omit the opaque
      // background so the bar adopts the system material — Liquid Glass on
      // iOS 26+, the translucent system blur on earlier versions.
      backgroundColor={Platform.OS === "android" ? colors.card : undefined}
      // iOS 26+: shrink the liquid-glass tab bar while scrolling down (Instagram-
      // style), then restore full size on scroll up. No-op on Android / older iOS.
      minimizeBehavior="onScrollDown"
      tintColor={colors.accent}
      indicatorColor={tokens.accentSoft}
      rippleColor={withAlpha(colors.accent, tokens.isDark ? 0.22 : 0.14)}
      labelVisibilityMode="labeled"
      iconColor={{ default: colors.mutedForeground, selected: colors.accent }}
      labelStyle={{
        default: { color: colors.mutedForeground, fontWeight: "500" },
        selected: { color: colors.accent, fontWeight: "600" },
      }}
    >
      {/* disableAutomaticContentInsets: every tab screen already pads for the
          tab bar via useContentBottomInset(). Without this, once RNS can reach
          the ScrollView (required for minimizeBehavior) it would flip
          contentInsetAdjustmentBehavior "never" → "automatic" and double-pad. */}
      <NativeTabs.Trigger name="index" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tracker" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>{t("tabs.tracker")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "list.bullet.clipboard", selected: "list.bullet.clipboard.fill" }}
          md="checklist"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="library" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>{t("tabs.library")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "books.vertical", selected: "books.vertical.fill" }}
          md="local_library"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>{t("tabs.settings")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
