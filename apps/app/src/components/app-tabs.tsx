import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export default function AppTabs() {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <NativeTabs
      // Android keeps its themed Material 3 surface; on iOS we omit the opaque
      // background so the bar adopts the system material — Liquid Glass on
      // iOS 26+, the translucent system blur on earlier versions.
      backgroundColor={Platform.OS === "android" ? colors.card : undefined}
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
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tracker">
        <NativeTabs.Trigger.Label>{t("tabs.tracker")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "list.bullet.clipboard", selected: "list.bullet.clipboard.fill" }}
          md="checklist"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>{t("tabs.library")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "books.vertical", selected: "books.vertical.fill" }}
          md="local_library"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>{t("tabs.settings")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
