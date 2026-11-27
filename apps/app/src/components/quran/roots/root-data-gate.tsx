import { type ReactNode, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";
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
    <Card>
      <View style={styles.body}>
        <ThemedText type="smallBold">{t("quranRoots.data.title")}</ThemedText>
        {status === "idle" || status === "checking" ? (
          <SkeletonGroup accessibilityLabel={t("quranRoots.data.checking")} style={styles.body}>
            <Skeleton width="80%" height={12} />
            <Skeleton width="55%" height={12} />
          </SkeletonGroup>
        ) : busy ? (
          <>
            <ThemedText type="small" themeColor="mutedForeground" accessibilityLiveRegion="polite">
              {status === "downloading"
                ? t("quranRoots.data.downloading", { percent })
                : status === "verifying"
                  ? t("quranRoots.data.verifying")
                  : t("quranRoots.data.building", { percent })}
            </ThemedText>
            <ProgressBar
              value={status === "verifying" ? 1 : progress}
              accessibilityLabel={t("quranRoots.data.title")}
            />
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
            {error ? <Callout tone="danger">{t(`quranRoots.data.error.${error}`)}</Callout> : null}
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
      <ConfirmDialog
        visible={cellularConfirm}
        title={t("quranRoots.data.cellularTitle")}
        message={t("quranRoots.data.cellularBody", { size: QAC_DOWNLOAD_MB })}
        confirmLabel={t("quranRoots.data.cellularConfirm")}
        cancelLabel={t("quranRoots.data.cancel")}
        onConfirm={() => void start(true)}
        onCancel={() => setCellularConfirm(false)}
        onClose={() => setCellularConfirm(false)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two },
});
