import { useQuickActionRouting } from "expo-quick-actions/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { syncAppQuickActions } from "@/lib/appSurfaces/quickActions/syncQuickActions";

/** Home-screen app-icon quick actions (NF-1.30). */
export function useAppQuickActions(): void {
  const { t } = useTranslation();
  useQuickActionRouting();

  useEffect(() => {
    if (Platform.OS === "web") return;
    void syncAppQuickActions(t);
  }, [t]);
}
