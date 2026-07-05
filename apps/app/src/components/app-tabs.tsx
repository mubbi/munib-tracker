import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

import { useThemeTokens } from "@/hooks/use-theme-tokens";

export default function AppTabs() {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <NativeTabs
      backgroundColor={colors.card}
      indicatorColor={tokens.accentSoft}
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
