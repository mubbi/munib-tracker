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
      // Async: the dialog stays busy until the reset lands and shows an inline
      // error (and stays open for a retry) if it fails.
      onConfirm={async () => {
        await resetAllSettings();
        toast.success(t("settingsPanel.resetDone"));
      }}
      errorMessage={t("settings.resetSettingsFailed")}
    />
  );
}

/** Thrown when the cloud copy could not be erased — nothing on the device was touched. */
class CloudResetError extends Error {}

/**
 * "Reset app data" (D13: moved here from Profile, which keeps Delete account).
 * D-02: the confirm says what is erased where (device / cloud), needs an
 * "I understand" tick, and stays open and busy while the wipe runs. A failure
 * shows inline (with the dialog still open for a retry); Home is opened only
 * after every step succeeded. The sequence is unchanged: `resetAppData`
 * (cloud, signed in only) → `wipeLocalDeviceData` → `factoryResetPinLock` →
 * `clearAll`. Each step is idempotent, so a retry after a partial failure is safe.
 */
export function ResetAppDataRow() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, resetAppData } = useAuth();
  const { factoryResetPinLock } = usePinLock();
  const { clearAll } = useInAppNotifications();
  const [errorKey, setErrorKey] = useState<string>("settings.resetAppData.failedDevice");

  const run = async () => {
    try {
      if (isAuthenticated && (await resetAppData()) === "error") {
        throw new CloudResetError();
      }
      await wipeLocalDeviceData();
      await factoryResetPinLock();
      await clearAll();
    } catch (error) {
      setErrorKey(
        error instanceof CloudResetError
          ? "profile.resetDataFailed"
          : "settings.resetAppData.failedDevice",
      );
      throw error;
    }
    router.replace("/");
    toast.success(t("profile.resetDataSuccess"));
  };

  const message = [
    t("settings.resetAppData.deviceLine"),
    isAuthenticated ? t("settings.resetAppData.cloudLine") : t("settings.resetAppData.guestLine"),
    t("settings.resetAppData.cannotUndo"),
  ].join("\n\n");

  return (
    <DangerRow
      icon={RESET_ICON}
      title={t("profile.resetData")}
      subtitle={t("settingsPanel.resetAppDataSub")}
      confirmTitle={t("profile.resetDataTitle")}
      confirmMessage={message}
      confirmLabel={t("profile.resetDataConfirm")}
      acknowledgeLabel={t("settings.resetAppData.acknowledge")}
      errorMessage={t(errorKey)}
      onConfirm={run}
    />
  );
}
