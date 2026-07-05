import * as QuickActions from "expo-quick-actions";
import { useQuickActionRouting } from "expo-quick-actions/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import AppTabs from "@/components/app-tabs";

/**
 * Home-screen app-icon quick actions (NF-1.30). `useQuickActionRouting` handles a
 * launched shortcut by navigating to its `params.href` (must live in a sub-layout,
 * not the root layout). Items are registered at runtime with localized titles.
 */
export default function TabsLayout() {
  const { t } = useTranslation();
  useQuickActionRouting();

  useEffect(() => {
    void QuickActions.setItems([
      {
        id: "tracker",
        title: t("actions.checklist"),
        icon: "symbol:checklist",
        params: { href: "/tracker" },
      },
      {
        id: "qibla",
        title: t("actions.qibla"),
        icon: "symbol:location.north.line",
        params: { href: "/qibla" },
      },
      {
        id: "tasbeeh",
        title: t("actions.tasbeeh"),
        icon: "symbol:hand.tap",
        params: { href: "/tasbeeh/free" },
      },
      {
        id: "qaza",
        title: t("actions.qaza"),
        icon: "symbol:clock.arrow.circlepath",
        params: { href: "/qaza" },
      },
    ]);
  }, [t]);

  return <AppTabs />;
}
