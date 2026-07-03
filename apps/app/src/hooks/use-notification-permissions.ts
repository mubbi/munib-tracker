import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

import {
  canEnableLocalReminders,
  type NotificationPermissionUiState,
  openNotificationSettings,
  type RequestPermissionResult,
  readNotificationPermissionUiState,
  requestNotificationPermission,
  type WebPermissionRequest,
} from "@/lib/notifications/permissions";
import { isExpoGo, isLocalNotificationSupported, isWeb } from "@/lib/notifications/platform";
import {
  getWebNotificationGuidance,
  type WebNotificationGuidance,
} from "@/lib/notifications/web-environment";

const EMPTY_WEB_GUIDANCE: WebNotificationGuidance = {
  tier: null,
  isIos: false,
  isInstalledPwa: false,
  needsSafariForInstall: false,
  blockingReason: null,
};

export function useNotificationPermissions() {
  const [permission, setPermission] = useState<NotificationPermissionUiState>("undetermined");

  const refresh = useCallback(async () => {
    setPermission(await readNotificationPermissionUiState());
  }, []);

  useEffect(() => {
    void refresh();
    const sub = AppState.addEventListener("change", (status) => {
      if (status === "active") void refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const requestPermission = useCallback(
    async (options?: { webPermissionRequest?: WebPermissionRequest | null }) => {
      const result = await requestNotificationPermission(options);
      await refresh();
      return result;
    },
    [refresh],
  );

  const webGuidance = isWeb ? getWebNotificationGuidance() : EMPTY_WEB_GUIDANCE;

  return {
    permission,
    refresh,
    requestPermission,
    openSettings: openNotificationSettings,
    canEnableLocalReminders: canEnableLocalReminders(),
    isExpoGo: isExpoGo(),
    isLocalSupported: isLocalNotificationSupported(),
    webGuidance,
    webBlockingReason: webGuidance.blockingReason,
    webTier: webGuidance.tier,
    granted: permission === "granted",
    denied: permission === "denied",
    undetermined: permission === "undetermined",
  };
}

export type { RequestPermissionResult };
