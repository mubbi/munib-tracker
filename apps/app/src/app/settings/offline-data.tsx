import { type Href, useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DangerRow } from "@/components/settings/action-row";
import { SettingsRow } from "@/components/settings/settings-rows";
import { SettingsDetailScreen } from "@/components/settings/settings-screen";
import { ThemedText } from "@/components/themed-text";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { HadithRepository, QuranCacheRepository, QuranStudyCacheRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type CacheGroupSize,
  clearCacheKeys,
  clearDownloadedAudio,
  clearDownloadedQcfFonts,
  formatBytes,
  getCacheSummary,
  getRecitationListenerBytes,
} from "@/lib/cache-manager";
import { isTV } from "@/lib/platform/is-tv";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";

type PendingClear = { group: CacheGroupSize } | null;

export default function OfflineDataScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const [groups, setGroups] = useState<CacheGroupSize[]>([]);
  // D-39: null until the first measurement — show skeleton rows, never "0 B".
  const [measured, setMeasured] = useState<"pending" | "ready" | "error">("pending");
  const [pending, setPending] = useState<PendingClear>(null);
  const [listenerBytes, setListenerBytes] = useState(0);
  const practice = isPracticeAvailable();
  const tv = isTV();

  const refresh = useCallback(async () => {
    try {
      setGroups(await getCacheSummary());
      if (practice) setListenerBytes(await getRecitationListenerBytes());
      setMeasured("ready");
    } catch {
      setMeasured((prev) => (prev === "ready" ? prev : "error"));
    }
  }, [practice]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const clearGroup = async (group: CacheGroupSize) => {
    // Reset in-memory caches too so the freed space takes effect immediately.
    if (group.id === "quran") {
      await QuranCacheRepository.clear();
      await QuranStudyCacheRepository.clear();
    }
    if (group.id === "mushafFonts") await clearDownloadedQcfFonts();
    if (group.id === "hadith") await HadithRepository.clearBookCache();
    if (group.id === "audio") await clearDownloadedAudio();
    await clearCacheKeys(group.keys);
    await refresh();
    toast.success(t("offlineData.cleared"));
  };

  const clearAll = async () => {
    await QuranCacheRepository.clear();
    await QuranStudyCacheRepository.clear();
    await HadithRepository.clearBookCache();
    await clearDownloadedAudio();
    await clearDownloadedQcfFonts();
    await clearCacheKeys(groups.flatMap((g) => g.keys));
    await refresh();
    toast.success(t("offlineData.cleared"));
  };

  // Async: the dialog stays busy until the removal finishes and shows an inline error on failure.
  const handleConfirm = () => (pending ? clearGroup(pending.group) : undefined);

  const total = groups.reduce((sum, g) => sum + g.bytes, 0);
  // Web audio clips can be cached with an unknown (opaque) size — count them so
  // "Clear all" stays enabled even when readable bytes total zero.
  const hasAnyCached = total > 0 || groups.some((g) => (g.count ?? 0) > 0);
  const pendingGroupName = pending ? t(pending.group.labelKey) : "";

  return (
    <SettingsDetailScreen
      parent="data"
      path="/settings/offline-data"
      title={t("offlineData.title")}
      subtitle={t("offlineData.subtitle")}
    >
      <Stagger>
        <Card>
          <SectionHeader
            title={t("offlineData.cachesTitle")}
            icon={{ ios: "internaldrive.fill", android: "storage", web: "storage" }}
          />
          {measured === "pending" ? (
            <SkeletonPlaceholder
              preset="rows"
              count={4}
              accessibilityLabel={t("offlineData.measuring")}
              style={styles.rows}
            />
          ) : measured === "error" ? (
            <Callout
              tone="danger"
              action={{ label: t("common.tryAgain"), onPress: () => void refresh() }}
              style={styles.rows}
            >
              {t("offlineData.measureFailed")}
            </Callout>
          ) : (
            <View style={styles.rows}>
              {groups.map((group, index) => {
                const empty = group.bytes === 0 && !(group.count ?? 0);
                const label = t("offlineData.clearOne", { name: t(group.labelKey) });
                if (tv) {
                  // TV: the whole row is the D-pad target (a disabled trash icon would
                  // drop focus after clearing). Empty groups stay focusable but no-op.
                  return (
                    <PressableScale
                      key={group.id}
                      accessibilityRole="button"
                      accessibilityLabel={label}
                      accessibilityState={{ disabled: empty }}
                      onPress={empty ? undefined : () => setPending({ group })}
                      {...(index === 0 ? { hasTVPreferredFocus: true } : {})}
                      style={[styles.row, styles.rowTv, { backgroundColor: colors.muted }]}
                    >
                      <View style={styles.rowBody}>
                        <ThemedText type="small">{t(group.labelKey)}</ThemedText>
                        <ThemedText type="caption" themeColor="mutedForeground">
                          {formatBytes(group.bytes)}
                        </ThemedText>
                      </View>
                      <View style={empty ? styles.dimmedTv : undefined}>
                        <SymbolView
                          name={{ ios: "trash", android: "delete", web: "delete" }}
                          size={20}
                          tintColor={tokens.status.danger.color}
                        />
                      </View>
                    </PressableScale>
                  );
                }
                return (
                  <View key={group.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                    <View style={styles.rowBody}>
                      <ThemedText type="small">{t(group.labelKey)}</ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {formatBytes(group.bytes)}
                      </ThemedText>
                    </View>
                    <IconButton
                      name={{ ios: "trash", android: "delete", web: "delete" }}
                      size={18}
                      tintColor={tokens.status.danger.color}
                      accessibilityLabel={label}
                      disabled={empty}
                      onPress={() => setPending({ group })}
                    />
                  </View>
                );
              })}
            </View>
          )}
          {measured === "ready" ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.total}>
              {t("offlineData.total", { size: formatBytes(total) })}
            </ThemedText>
          ) : null}
        </Card>

        {practice ? (
          <SettingsRow
            icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            title={t("quranCompanion.offlineRow.title")}
            subtitle={t("quranCompanion.offlineRow.subtitle")}
            value={formatBytes(listenerBytes)}
            onPress={() => router.push("/settings/quran-practice" as Href)}
          />
        ) : null}

        <DangerRow
          icon={{ ios: "trash", android: "delete_sweep", web: "delete_sweep" }}
          title={t("offlineData.clearAll")}
          disabled={!hasAnyCached}
          confirmTitle={t("offlineData.confirmClearAllTitle")}
          confirmMessage={t("offlineData.confirmClearAllMessage")}
          confirmLabel={t("offlineData.confirmClearAction")}
          onConfirm={clearAll}
        />

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {t("offlineData.note")}
        </ThemedText>
      </Stagger>

      <ConfirmDialog
        visible={pending != null}
        title={t("offlineData.confirmClearOneTitle", { name: pendingGroupName })}
        message={t("offlineData.confirmClearOneMessage", { name: pendingGroupName })}
        confirmLabel={t("offlineData.confirmClearAction")}
        destructive
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />
    </SettingsDetailScreen>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: { flex: 1, gap: Spacing.half },
  rowTv: { minHeight: TvLayout.minFocusTarget },
  dimmedTv: { opacity: 0.35 },
  total: { marginTop: Spacing.three, textAlign: I18nManager.isRTL ? "left" : "right" },
  note: { textAlign: "center" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/offline-data");
