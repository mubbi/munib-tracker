import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { usePinLock } from "@/features/pin-lock";
import { getPlatformCtx } from "@/lib/settings/platform";
import { isSettingAvailable, SETTINGS_REGISTRY } from "@/lib/settings/registry";
import { changedSettings, resetAllSettings } from "@/lib/settings/reset";
import { wipeLocalDeviceData } from "@/lib/wipe-local-data";
import { useAuth } from "@/providers/auth-provider";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";

import { DangerRow } from "../action-row";

const RESET_ICON = {
  ios: "arrow.counterclockwise",
  android: "restart_alt",
  web: "restart_alt",
} as const;

/**
 * "Reset settings to defaults" (§4.5.7): every registered setting goes back to
 * its default; logs, bookmarks, notes and progress are kept. The confirm lists
 * what will change.
 */
export function ResetSettingsRow() {
  const { t } = useTranslation();
  const toast = useToast();

  const describe = () => {
    const ctx = getPlatformCtx();
    const changed = changedSettings(SETTINGS_REGISTRY.filter((d) => isSettingAvailable(d, ctx)));
    if (changed.length === 0) return t("settingsPanel.resetSettingsNothing");
    const names = changed.slice(0, 8).map((d) => t(d.titleKey));
    const more = changed.length - names.length;
    return t("settingsPanel.resetSettingsList", {
      list: more > 0 ? `${names.join(", ")} (+${more})` : names.join(", "),
    });
  };

  return (
    <DangerRow
      icon={RESET_ICON}
      title={t("settingsPanel.resetSettings")}
      subtitle={t("settingsPanel.resetSettingsSub")}
      confirmMessage={describe()}
      confirmLabel={t("common.reset")}
      destructive={false}
      onConfirm={() => {
        void resetAllSettings().then(
          () => toast.success(t("settingsPanel.resetDone")),
          () => toast.error(t("settingsPanel.failed")),
        );
      }}
    />
  );
}

/**
 * "Reset app data" (D13: moved here from Profile, which keeps Delete account).
 * Wipes the server copy when signed in, then this device.
 */
export function ResetAppDataRow() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, resetAppData } = useAuth();
  const { factoryResetPinLock } = usePinLock();
  const { clearAll } = useInAppNotifications();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (isAuthenticated && (await resetAppData()) === "error") {
        toast.error(t("profile.resetDataFailed"));
        return;
      }
      await wipeLocalDeviceData();
      await factoryResetPinLock();
      await clearAll();
      router.replace("/");
      toast.success(t("profile.resetDataSuccess"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <DangerRow
      icon={RESET_ICON}
      title={t("profile.resetData")}
      subtitle={t("settingsPanel.resetAppDataSub")}
      confirmTitle={t("profile.resetDataTitle")}
      confirmMessage={t(isAuthenticated ? "profile.resetDataMsgAccount" : "profile.resetDataMsg")}
      confirmLabel={t("profile.resetDataConfirm")}
      disabled={busy}
      onConfirm={() => void run()}
    />
  );
}
