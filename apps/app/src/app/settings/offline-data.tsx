import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { HadithRepository, QuranCacheRepository, QuranStudyCacheRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type CacheGroupSize,
  clearCacheKeys,
  clearDownloadedAudio,
  clearDownloadedQcfFonts,
  formatBytes,
  getCacheSummary,
} from "@/lib/cache-manager";
import { goBackOrReplace } from "@/lib/navigation";
import { useToast } from "@/providers/toast-provider";

type PendingClear = { kind: "group"; group: CacheGroupSize } | { kind: "all" } | null;

export default function OfflineDataScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const [groups, setGroups] = useState<CacheGroupSize[]>([]);
  const [pending, setPending] = useState<PendingClear>(null);

  const refresh = useCallback(async () => {
    setGroups(await getCacheSummary());
  }, []);

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

  const handleConfirm = () => {
    if (pending?.kind === "group") void clearGroup(pending.group);
    if (pending?.kind === "all") void clearAll();
  };

  const total = groups.reduce((sum, g) => sum + g.bytes, 0);
  // Web audio clips can be cached with an unknown (opaque) size — count them so
  // "Clear all" stays enabled even when readable bytes total zero.
  const hasAnyCached = total > 0 || groups.some((g) => (g.count ?? 0) > 0);
  const pendingGroupName = pending?.kind === "group" ? t(pending.group.labelKey) : undefined;

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("offlineData.title")}
      subtitle={t("offlineData.subtitle")}
      onBack={() => goBackOrReplace(router, "/settings")}
    >
      <Seo path="/settings/offline-data" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("offlineData.cachesTitle")}
            icon={{ ios: "internaldrive.fill", android: "storage", web: "storage" }}
          />
          <View style={styles.rows}>
            {groups.map((group) => (
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
                  accessibilityLabel={t("offlineData.clearOne", { name: t(group.labelKey) })}
                  disabled={group.bytes === 0 && !(group.count ?? 0)}
                  onPress={() => setPending({ kind: "group", group })}
                />
              </View>
            ))}
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.total}>
            {t("offlineData.total", { size: formatBytes(total) })}
          </ThemedText>
        </Card>

        <Button
          label={t("offlineData.clearAll")}
          variant="ghost"
          fullWidth
          disabled={!hasAnyCached}
          icon={{ ios: "trash", android: "delete_sweep", web: "delete_sweep" }}
          onPress={() => setPending({ kind: "all" })}
          style={{ borderColor: tokens.status.danger.border }}
        />

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {t("offlineData.note")}
        </ThemedText>
      </Stagger>

      <ConfirmDialog
        visible={pending != null}
        title={
          pending?.kind === "all"
            ? t("offlineData.confirmClearAllTitle")
            : t("offlineData.confirmClearOneTitle", { name: pendingGroupName ?? "" })
        }
        message={
          pending?.kind === "all"
            ? t("offlineData.confirmClearAllMessage")
            : t("offlineData.confirmClearOneMessage", { name: pendingGroupName ?? "" })
        }
        confirmLabel={t("offlineData.confirmClearAction")}
        destructive
        onConfirm={handleConfirm}
        onClose={() => setPending(null)}
      />
    </ScreenLayout>
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
  rowBody: { flex: 1, gap: 2 },
  total: { marginTop: Spacing.three, textAlign: I18nManager.isRTL ? "left" : "right" },
  note: { textAlign: "center" },
});
