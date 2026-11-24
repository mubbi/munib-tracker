import { APP_NAME } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";
import { AppUpdateSection } from "@/components/app-update/app-update-section";
import { HijriBasisMovedCard } from "@/components/hijri/hijri-basis-moved-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SyncNowButton, useManualSync } from "@/components/settings/editors/sync-status-card";
import { SettingsGroupBody } from "@/components/settings/settings-group-body";
import { useSettingsMasterDetail } from "@/components/settings/settings-layout";
import { SettingsRow } from "@/components/settings/settings-rows";
import {
  SettingsSearchResults,
  useSettingsSearch,
} from "@/components/settings/settings-search-results";
import { SetupChecklistCard } from "@/components/settings/setup-checklist-card";
import { ThemedText } from "@/components/themed-text";
import { BrowseTile } from "@/components/ui/browse-tile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SearchField } from "@/components/ui/search-field";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { useChevronBack } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  availableGroups,
  getSettingsSubgroup,
  groupSummary,
  SETTINGS_CLUSTERS,
  type SettingsClusterMeta,
  type SettingsGroupMeta,
  subgroupOfSetting,
} from "@/lib/settings/groups";
import { getPlatformCtx } from "@/lib/settings/platform";
import {
  type SettingsGroupId,
  type SettingsSubgroupId,
  settingHref,
  settingsGroupPath,
} from "@/lib/settings/routes";
import type { SettingSearchEntry } from "@/lib/settings/search";
import {
  dismissLayoutTip,
  LAYOUT_TIP_ID,
  loadSetupDismissed,
  setupDismissStore,
  useDismissedSetupItems,
} from "@/lib/settings/setup-checklist";
import { ensureSettingsStoresLoaded } from "@/lib/settings/snapshot";
import { useSettingsSelector } from "@/lib/settings/use-setting";
import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/stores/create-store";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Settings hub (NF-3.0b §4.5.3): search, account, "Finish setting up", then the
 * five clusters of groups, each row summarising its current values. Wide web and
 * tablets get master–detail (groups left, the selected group right).
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const ctx = useMemo(getPlatformCtx, []);
  const groups = useMemo(() => availableGroups(ctx), [ctx]);
  const masterDetail = useSettingsMasterDetail();
  const tv = ctx.tv;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SettingsGroupId>(groups[0]?.id ?? "about");
  const [focusId, setFocusId] = useState<string | null>(null);
  // Master–detail: the open sub-screen of a split group (Reminders & notifications).
  const [selectedSub, setSelectedSub] = useState<SettingsSubgroupId | null>(null);
  const results = useSettingsSearch(query);
  const searching = query.trim().length >= 2;
  // Master–detail: a search result / checklist item scrolls the page to its row.
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const { register, onScroll } = useScrollToActive(scrollRef, masterDetail ? focusId : null);
  const selectedGroup = groups.find((g) => g.id === selected);
  const selectedSubMeta = selectedSub ? getSettingsSubgroup(selected, selectedSub) : null;
  const chevronBack = useChevronBack();

  useEffect(() => {
    ensureSettingsStoresLoaded();
    void loadSetupDismissed();
  }, []);

  const openGroup = useCallback(
    (group: SettingsGroupId, focus?: string) => {
      if (masterDetail) {
        setSelected(group);
        setFocusId(focus ?? null);
        setSelectedSub(focus ? (subgroupOfSetting(focus)?.id ?? null) : null);
        return;
      }
      router.push((focus ? settingHref(focus) : settingsGroupPath(group)) as Href);
    },
    [masterDetail, router],
  );

  const openResult = useCallback(
    (entry: SettingSearchEntry) => {
      const { control } = entry.def;
      // Options edited on their own rich screen open it directly.
      if (control.kind === "link" && entry.def.listed === false) {
        router.push(control.href);
        return;
      }
      openGroup(entry.def.group, entry.def.id);
    },
    [openGroup, router],
  );

  const master = (
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
          <AppUpdateSection />
          <AccountCard />
          <LayoutTipCard />
          <SetupChecklistCard
            onOpen={(item) =>
              openGroup(item.settingId.split(".")[0] as SettingsGroupId, item.settingId)
            }
          />
          <HijriBasisMovedCard />
          {/* TV: big cluster tiles for the D-pad. Master–detail skips them — the
              group list beside the detail pane already is the navigation. */}
          {tv ? (
            <ClusterTiles
              groups={groups}
              onOpen={(id) => openGroup(id)}
              columns={SETTINGS_CLUSTERS.length}
            />
          ) : null}
          {SETTINGS_CLUSTERS.map((cluster) => {
            const members = groups.filter((g) => g.cluster === cluster.id);
            if (members.length === 0) return null;
            return (
              <ClusterSection
                key={cluster.id}
                cluster={cluster}
                groups={members}
                selected={masterDetail ? selected : null}
                onOpen={(id) => openGroup(id)}
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

  return (
    <ScreenLayout
      eyebrow={t("settings.eyebrow")}
      title={t("settings.title")}
      subtitle={tTv(t, "settings.subtitle", "settings.tvSubtitle")}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/settings" />
      {masterDetail ? (
        <View style={styles.columns}>
          <View style={styles.masterColumn}>{master}</View>
          <View style={styles.detailColumn}>
            <View style={styles.detailHeader}>
              {selectedSubMeta ? (
                <Button
                  label={t(selectedGroup?.titleKey ?? "settings.title")}
                  icon={chevronBack}
                  variant="ghost"
                  size="sm"
                  onPress={() => setSelectedSub(null)}
                  style={styles.detailBack}
                />
              ) : null}
              <ThemedText type="subtitle" accessibilityRole="header">
                {t(selectedSubMeta?.titleKey ?? selectedGroup?.titleKey ?? "settings.title")}
              </ThemedText>
              {selectedGroup ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t(selectedSubMeta?.subtitleKey ?? selectedGroup.subtitleKey)}
                </ThemedText>
              ) : null}
            </View>
            <SettingsGroupBody
              key={`${selected}:${selectedSub ?? ""}`}
              group={selected}
              subgroup={selectedSub}
              focusId={focusId}
              register={register}
              onOpenSubgroup={(sub) => {
                setFocusId(null);
                setSelectedSub(sub);
              }}
            />
          </View>
        </View>
      ) : (
        master
      )}
    </ScreenLayout>
  );
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
    <Card padding="three" style={styles.account}>
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
  const { colors, tokens } = useThemeTokens();
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
      <ThemedText type="smallBold" style={{ color: colors.accent }}>
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
    <Card padding="three" style={styles.setup}>
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

/**
 * TV: the five clusters as `BrowseTile`s (same look as
 * the Duas and Zikr hubs). A tile opens the cluster's first group.
 */
function ClusterTiles({
  groups,
  onOpen,
  columns,
}: {
  groups: SettingsGroupMeta[];
  onOpen: (id: SettingsGroupId) => void;
  columns: number;
}) {
  const { t } = useTranslation();
  const width = `${Math.floor(100 / columns) - 2}%` as const;
  return (
    <View style={styles.tiles}>
      {SETTINGS_CLUSTERS.map((cluster) => {
        const members = groups.filter((g) => g.cluster === cluster.id);
        const first = members[0];
        if (!first) return null;
        return (
          <View key={cluster.id} style={{ width }}>
            <ClusterTile
              cluster={cluster}
              countLabel={members.map((g) => t(g.titleKey)).join(" · ")}
              onPress={() => onOpen(first.id)}
            />
          </View>
        );
      })}
    </View>
  );
}

function ClusterTile({
  cluster,
  countLabel,
  onPress,
}: {
  cluster: SettingsClusterMeta;
  countLabel: string;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const hue = useCategoryHue(cluster.hue);
  return (
    <BrowseTile
      icon={cluster.icon}
      label={t(cluster.titleKey)}
      countLabel={countLabel}
      hue={hue}
      onPress={onPress}
    />
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
      <Card padding="three">
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
      accessory={
        active ? <View style={[styles.activeDot, { backgroundColor: colors.accent }]} /> : undefined
      }
      onPress={() => onOpen(group.id)}
    />
  );
}

const AVATAR_SIZE = 36;

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
  account: { gap: Spacing.two },
  syncNow: { alignSelf: "flex-start" },
  avatarBorder: { borderWidth: StyleSheet.hairlineWidth },
  avatarFallback: { alignItems: "center", justifyContent: "center" },
  columns: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  masterColumn: { width: 360, maxWidth: "40%" },
  detailColumn: { flex: 1, minWidth: 0, gap: Spacing.three },
  detailHeader: { gap: Spacing.half },
  detailBack: { alignSelf: "flex-start" },
  setup: { gap: Spacing.two },
  cluster: { gap: Spacing.two },
  clusterHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  rows: { gap: Spacing.two },
  tiles: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  footer: { textAlign: "center", marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)/settings");
