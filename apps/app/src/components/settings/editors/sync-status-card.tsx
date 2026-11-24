import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { formatRelativeWhen } from "@/lib/relative-time";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";
import { readSyncMetadata, type SyncMetadata } from "@/sync/sync-engine";

import { SettingsRow } from "../settings-rows";

/**
 * Last-synced label + a "Sync now" runner with toast feedback — shared by the
 * Data & storage card and the hub's account card (§4.5.3), so both read the
 * same sync metadata and call the same `syncNow()`.
 */
export function useManualSync() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const prefs = usePreferences();
  const { isAuthenticated, syncNow } = useAuth();
  const [meta, setMeta] = useState<SyncMetadata | null>(null);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => setMeta(await readSyncMetadata()), []);
  useEffect(() => {
    if (isAuthenticated) void refresh();
  }, [isAuthenticated, refresh]);

  const lastSynced = meta?.lastSyncedAt
    ? formatRelativeWhen(meta.lastSyncedAt, i18n.language?.split("-")[0], t, prefs.defaultCalendar)
    : t("sync.never");

  const runSync = useCallback(() => {
    setSyncing(true);
    void syncNow()
      .then(async (outcome) => {
        if (outcome === "error") toast.error(t("sync.failed"));
        else if (outcome === "ok") toast.success(t("sync.done"));
        await refresh();
      })
      .finally(() => setSyncing(false));
  }, [refresh, syncNow, t, toast]);

  return { isAuthenticated, lastSynced, syncing, runSync };
}

/** "Sync now" button bound to `useManualSync()`. */
export function SyncNowButton({
  sync,
  fullWidth = true,
}: {
  sync: ReturnType<typeof useManualSync>;
  fullWidth?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Button
      label={sync.syncing ? t("sync.syncing") : t("sync.now")}
      icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
      variant="secondary"
      size={fullWidth ? "md" : "sm"}
      fullWidth={fullWidth}
      disabled={sync.syncing}
      onPress={sync.runSync}
    />
  );
}

/**
 * Cloud sync status + "Sync now" (Data & storage). Guests get a row to the
 * account screen to sign in; the detailed merge report stays in Account.
 */
export function SyncStatusCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const sync = useManualSync();

  if (!sync.isAuthenticated) {
    return (
      <SettingsRow
        icon={{ ios: "icloud.fill", android: "cloud", web: "cloud" }}
        title={t("profile.signInToSync")}
        subtitle={t("settings.accountGuest")}
        onPress={() => router.push("/profile" as Href)}
      />
    );
  }

  return (
    <View style={styles.block}>
      <SettingsRow
        icon={{ ios: "icloud.fill", android: "cloud_done", web: "cloud_done" }}
        title={t("sync.lastSynced")}
        value={sync.lastSynced}
        onPress={() => router.push("/profile" as Href)}
      />
      <SyncNowButton sync={sync} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
});
