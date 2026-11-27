import { APP_NAME } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { AppUpdateSection } from "@/components/app-update/app-update-section";
import { HijriBasisMovedCard } from "@/components/hijri/hijri-basis-moved-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SearchField } from "@/components/ui/search-field";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { BorderWidth, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getHijriObserver } from "@/lib/hijri";
import { hijriBasisFingerprint, hijriBasisMismatch } from "@/lib/hijri-adjustment";
import {
  availableGroups,
  groupSummary,
  SETTINGS_CLUSTERS,
  type SettingsClusterMeta,
  type SettingsGroupMeta,
} from "@/lib/settings/groups";
import { getPlatformCtx } from "@/lib/settings/platform";
import type { SettingsGroupId } from "@/lib/settings/routes";
import type { SettingSearchEntry } from "@/lib/settings/search";
import {
  dismissLayoutTip,
  LAYOUT_TIP_ID,
  loadSetupDismissed,
  pendingSetupItems,
  type SetupItem,
  setupDismissStore,
  useDismissedSetupItems,
} from "@/lib/settings/setup-checklist";
import { ensureSettingsStoresLoaded } from "@/lib/settings/snapshot";
import { useSettingsSelector } from "@/lib/settings/use-setting";
import { useAppVersion } from "@/providers/app-version-provider";
import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/stores/create-store";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

import { SyncNowButton, useManualSync } from "./editors/sync-status-card";
import { SettingsRow } from "./settings-rows";
import { SettingsSearchResults, useSettingsSearch } from "./settings-search-results";
import { SetupChecklistCard } from "./setup-checklist-card";

/**
 * The settings hub's list (NF-3.0b §4.5.3): search, account, ONE notice, then
 * the five clusters of groups, each row summarising its current values.
 *
 * Phones show it as the whole hub. Wide windows (D-UX11) show it as the list
 * pane beside the selected group — on the hub and on every group route — with
 * `selected` marking the group the detail pane shows.
 */
export function SettingsHubList({
  selected,
  onOpenGroup,
}: {
  /** Group shown in the detail pane (wide windows); `null` on phones / TV. */
  selected: SettingsGroupId | null;
  /** Open a group, optionally focusing one of its settings. */
  onOpenGroup: (group: SettingsGroupId, focus?: string) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const ctx = useMemo(getPlatformCtx, []);
  const groups = useMemo(() => availableGroups(ctx), [ctx]);
  const [query, setQuery] = useState("");
  const results = useSettingsSearch(query);
  const searching = query.trim().length >= 2;

  useEffect(() => {
    ensureSettingsStoresLoaded();
    void loadSetupDismissed();
  }, []);

  const openResult = useCallback(
    (entry: SettingSearchEntry) => {
      const { control } = entry.def;
      // Options edited on their own rich screen open it directly.
      if (control.kind === "link" && entry.def.listed === false) {
        router.push(control.href);
        return;
      }
      onOpenGroup(entry.def.group, entry.def.id);
    },
    [onOpenGroup, router],
  );

  return (
    <View style={styles.stack}>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t("settingsPanel.searchPlaceholder")}
      />
      {searching ? (
        <SettingsSearchResults results={results} onOpen={openResult} />
      ) : (
        <>
          <AccountCard />
          {/* P5-44 (D-33): at most the account card plus ONE notice above the first
              cluster, by priority. TV shows the cluster lists only (the tiles
              duplicated them and only reached each cluster's first group). */}
          <HubNotice
            onOpenSetup={(item) =>
              onOpenGroup(item.settingId.split(".")[0] as SettingsGroupId, item.settingId)
            }
          />
          {SETTINGS_CLUSTERS.map((cluster) => {
            const members = groups.filter((g) => g.cluster === cluster.id);
            if (members.length === 0) return null;
            return (
              <ClusterSection
                key={cluster.id}
                cluster={cluster}
                groups={members}
                selected={selected}
                onOpen={(id) => onOpenGroup(id)}
              />
            );
          })}
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
            {t("settings.footer", { app: APP_NAME })}
          </ThemedText>
        </>
      )}
    </View>
  );
}

type HubNoticeId = "update" | "hijri" | "setup" | "layoutTip";

/** Which single notice the hub shows: app update > Hijri move > setup checklist > layout tip. */
function useHubNotice(): HubNoticeId | null {
  const ctx = useMemo(getPlatformCtx, []);
  const { versionMeta, hasPendingUpdate, updatePromptDismissed } = useAppVersion();
  const adjustment = useHijriAdjustment();
  // Subscribing to the location re-evaluates the Hijri basis when the observer changes.
  useLocation();
  const dismissed = useDismissedSetupItems();
  const tipReady = useStore(setupDismissStore, (s) => s.isReady);
  const pending = useSettingsSelector((s) => pendingSetupItems(s, ctx));

  if (
    hasPendingUpdate &&
    versionMeta &&
    !(versionMeta.updateRequired === "soft" && !updatePromptDismissed)
  ) {
    return "update";
  }
  if (!ctx.tv && hijriBasisMismatch(adjustment, hijriBasisFingerprint(getHijriObserver()))) {
    return "hijri";
  }
  if (pending.some((item) => !dismissed.includes(item.id))) return "setup";
  if (tipReady && !dismissed.includes(LAYOUT_TIP_ID)) return "layoutTip";
  return null;
}

function HubNotice({ onOpenSetup }: { onOpenSetup: (item: SetupItem) => void }) {
  const notice = useHubNotice();
  switch (notice) {
    case "update":
      return <AppUpdateSection />;
    case "hijri":
      return <HijriBasisMovedCard />;
    case "setup":
      return <SetupChecklistCard onOpen={onOpenSetup} />;
    case "layoutTip":
      return <LayoutTipCard />;
    default:
      return null;
  }
}

function AccountCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const prefs = usePreferences();
  const { user } = useAuth();
  const sync = useManualSync();
  const name = prefs.displayName ?? user?.displayName ?? user?.email;
  const title = name ?? t("settings.account");
  return (
    <Card style={styles.account}>
      <SettingsRow
        leading={<AccountAvatar uri={prefs.avatarUri} label={title} />}
        title={title}
        subtitle={
          sync.isAuthenticated
            ? t("settingsGaps.account.lastSynced", { when: sync.lastSynced })
            : t("settings.accountGuest")
        }
        preferredFocus
        onPress={() => router.push("/profile")}
      />
      {sync.isAuthenticated ? (
        <View style={styles.syncNow}>
          <SyncNowButton sync={sync} fullWidth={false} />
        </View>
      ) : null}
    </Card>
  );
}

/** Account photo (or the name's initial) — same source as the Account screen. */
function AccountAvatar({ uri, label }: { uri: string | undefined; label: string }) {
  const { tokens } = useThemeTokens();
  const size = tvDp(AVATAR_SIZE);
  const shape = { width: size, height: size, borderRadius: size / 2 };
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[shape, { borderColor: tokens.hairline }, styles.avatarBorder]}
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View
      style={[shape, styles.avatarFallback, { backgroundColor: tokens.accentSoft }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <ThemedText type="smallBold" style={{ color: tokens.accentOnSoft }}>
        {label.slice(0, 1).toUpperCase()}
      </ThemedText>
    </View>
  );
}

/** One-time "Settings has a new layout — search for anything" tip (§4.5.10 risks). */
function LayoutTipCard() {
  const { t } = useTranslation();
  const dismissed = useDismissedSetupItems();
  const ready = useStore(setupDismissStore, (s) => s.isReady);
  if (!ready || dismissed.includes(LAYOUT_TIP_ID)) return null;
  return (
    <Card style={styles.setup}>
      <ThemedText type="smallBold">{t("settingsStep4.layoutTip.title")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("settingsStep4.layoutTip.body")}
      </ThemedText>
      <Button
        label={t("settingsStep4.layoutTip.dismiss")}
        variant="ghost"
        size="sm"
        onPress={() => void dismissLayoutTip()}
      />
    </Card>
  );
}

function ClusterSection({
  cluster,
  groups,
  selected,
  onOpen,
}: {
  cluster: SettingsClusterMeta;
  groups: SettingsGroupMeta[];
  selected: SettingsGroupId | null;
  onOpen: (id: SettingsGroupId) => void;
}) {
  const { t } = useTranslation();
  const hue = useCategoryHue(cluster.hue);
  return (
    <View style={styles.cluster}>
      <View style={styles.clusterHeader}>
        <IconWell icon={cluster.icon} tint={hue.icon} background={hue.soft} size={14} well={28} />
        <ThemedText type="label" themeColor="mutedForeground" accessibilityRole="header">
          {t(cluster.titleKey)}
        </ThemedText>
      </View>
      <Card>
        <View style={styles.rows}>
          {groups.map((group) => (
            <GroupRow key={group.id} group={group} active={selected === group.id} onOpen={onOpen} />
          ))}
        </View>
      </Card>
    </View>
  );
}

function GroupRow({
  group,
  active,
  onOpen,
}: {
  group: SettingsGroupMeta;
  active: boolean;
  onOpen: (id: SettingsGroupId) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const ctx = useMemo(getPlatformCtx, []);
  const summary = useSettingsSelector((s) => groupSummary(group, s, t, ctx));
  return (
    <SettingsRow
      icon={group.icon}
      title={t(group.titleKey)}
      subtitle={summary}
      selected={active}
      accessory={
        active ? <View style={[styles.activeDot, { backgroundColor: colors.accent }]} /> : undefined
      }
      onPress={() => onOpen(group.id)}
    />
  );
}

const AVATAR_SIZE = 36;
const ACTIVE_DOT = 8;

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
  account: { gap: Spacing.two },
  syncNow: { alignSelf: "flex-start" },
  avatarBorder: { borderWidth: BorderWidth.hairline },
  avatarFallback: { alignItems: "center", justifyContent: "center" },
  setup: { gap: Spacing.two },
  cluster: { gap: Spacing.two },
  clusterHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  rows: { gap: Spacing.two },
  activeDot: { width: ACTIVE_DOT, height: ACTIVE_DOT, borderRadius: ACTIVE_DOT / 2 },
  footer: { textAlign: "center", marginTop: Spacing.two },
});
