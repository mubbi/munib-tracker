import { useTranslation } from "react-i18next";
import { isWeb } from "@/lib/notifications/platform";
import { beginWebNotificationPermissionRequest } from "@/lib/notifications/web-environment";
import { enableNotifications } from "@/lib/settings/actions";
import { useSetting } from "@/lib/settings/use-setting";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

import { ToggleRow } from "../settings-rows";

/**
 * Master switch. Turning it on goes through `enableNotifications()` (permission,
 * master, reschedule, push token) — the same path as the inbox, the permission
 * banner and onboarding; this row only owns the toast copy.
 */
export function NotificationsMasterControl({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const toast = useToast();
  const { session } = useAuth();
  const { value, setValue, def } = useSetting<boolean>(settingId);

  const onChange = async (next: boolean) => {
    if (!next) {
      await setValue(false);
      return;
    }
    // Web: the permission prompt must start inside the user gesture.
    const webPermissionRequest = isWeb ? beginWebNotificationPermissionRequest() : null;
    const result = await enableNotifications({
      webPermissionRequest,
      accessToken: session?.accessToken,
    });
    if (result.granted) return;
    if (result.reason === "permission_denied") {
      toast.warning(t("notif.permissionDenied"), t("notif.openSettingsHint"));
    } else if (result.reason === "unsupported") {
      toast.info(t("notif.unsupportedTitle"), t("notifCenter.webNote"));
    } else {
      toast.info(t("notif.permissionDismissed"));
    }
  };

  return (
    <ToggleRow
      icon={def.icon}
      title={t(def.titleKey)}
      subtitle={def.subtitleKey ? t(def.subtitleKey) : undefined}
      value={value}
      onValueChange={(next) => void onChange(next)}
    />
  );
}
