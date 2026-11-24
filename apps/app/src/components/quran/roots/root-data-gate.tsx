import { type ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { QAC_DOWNLOAD_MB, QAC_SITE } from "@/lib/quran-morphology/source";
import {
  useCompanionPrefs,
  useEnsureCompanionPrefsLoaded,
} from "@/stores/quran-companion-prefs-store";
import { quranRootsStore, useEnsureRootIndex, useRootDataStatus } from "@/stores/quran-roots-store";

/**
 * First-use gate for root search (NF-3.22). Renders `children` once the root
 * index is ready; until then it shows the one-time download card ("Download
 * word-root data (6 MB)", following the Wi-Fi-only download preference), then
 * download / verify / build progress, and a typed error with Retry. Nothing is
 * fetched until the person taps Download.
 */
export function RootDataGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureRootIndex();
  useEnsureCompanionPrefsLoaded();
  const prefs = useCompanionPrefs();
  const { status, progress, error } = useRootDataStatus();
  const [cellularConfirm, setCellularConfirm] = useState(false);

  const start = useCallback(
    async (allowCellular = false) => {
      setCellularConfirm(false);
      const result = await quranRootsStore
        .getState()
        .download({ wifiOnly: prefs.wifiOnlyDownload, allowCellular });
      if (result === "needs-cellular-confirm") setCellularConfirm(true);
    },
    [prefs.wifiOnlyDownload],
  );

  if (status === "ready") return <>{children}</>;

  const percent = Math.round(progress * 100);
  const busy = status === "downloading" || status === "verifying" || status === "building";

  return (
    <Card padding="three">
      <View style={styles.body}>
        <ThemedText type="smallBold">{t("quranRoots.data.title")}</ThemedText>
        {status === "idle" || status === "checking" ? (
          <View style={styles.row}>
            <ActivityIndicator size="small" color={colors.accent} />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranRoots.data.checking")}
            </ThemedText>
          </View>
        ) : busy ? (
          <>
            <ThemedText type="small" themeColor="mutedForeground" accessibilityLiveRegion="polite">
              {status === "downloading"
                ? t("quranRoots.data.downloading", { percent })
                : status === "verifying"
                  ? t("quranRoots.data.verifying")
                  : t("quranRoots.data.building", { percent })}
            </ThemedText>
            <ProgressBar value={status === "verifying" ? 1 : progress} />
            {status === "building" ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quranRoots.data.buildingHint")}
              </ThemedText>
            ) : null}
            {status === "downloading" ? (
              <Button
                label={t("quranRoots.data.cancel")}
                variant="ghost"
                size="sm"
                onPress={() => quranRootsStore.getState().cancel()}
              />
            ) : null}
          </>
        ) : (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("quranRoots.data.body")}
            </ThemedText>
            {error ? (
              <ThemedText
                type="small"
                style={{ color: tokens.status.danger.text }}
                accessibilityRole="alert"
              >
                {t(`quranRoots.data.error.${error}`)}
              </ThemedText>
            ) : null}
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranRoots.data.source", { site: QAC_SITE })}
            </ThemedText>
            <Button
              label={
                status === "failed"
                  ? t("quranRoots.data.retry")
                  : t("quranRoots.data.download", { size: QAC_DOWNLOAD_MB })
              }
              icon={{ ios: "arrow.down.circle", android: "download", web: "download" }}
              onPress={() => void start()}
              fullWidth
            />
            {prefs.wifiOnlyDownload ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("quranRoots.data.wifiOnly")}
              </ThemedText>
            ) : null}
          </>
        )}
      </View>
      <Sheet visible={cellularConfirm} onClose={() => setCellularConfirm(false)} variant="center">
        <View style={styles.body}>
          <ThemedText type="smallBold">{t("quranRoots.data.cellularTitle")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("quranRoots.data.cellularBody", { size: QAC_DOWNLOAD_MB })}
          </ThemedText>
          <Button label={t("quranRoots.data.cellularConfirm")} onPress={() => void start(true)} />
          <Button
            label={t("quranRoots.data.cancel")}
            variant="ghost"
            onPress={() => setCellularConfirm(false)}
          />
        </View>
      </Sheet>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
});
