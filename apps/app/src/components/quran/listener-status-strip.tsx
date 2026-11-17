import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatBytes } from "@/lib/cache-manager";
import { PRACTICE_ERROR_COPY } from "@/lib/quran-companion/error-codes";
import {
  downloadPercent,
  isListenerUsable,
  type ListenerState,
} from "@/lib/quran-companion/model/download-job";

/**
 * One line that says what the on-device listener can do right now, with the one
 * action that moves it forward (download, cancel, try again). Replaces separate
 * captions, so a failed download never reads as "the listener did not start".
 */
export function ListenerStatusStrip({
  listener,
  online,
  sizeMb,
  onDownload,
  onCancel,
}: {
  listener: ListenerState;
  online: boolean;
  sizeMb: number;
  onDownload: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const usable = isListenerUsable(listener);
  const downloading = listener.status === "downloading" || listener.status === "verifying";

  const tone = usable
    ? tokens.status.success
    : listener.status === "failed"
      ? tokens.status.warning
      : tokens.status.info;

  const title = usable
    ? t("quranCompanion.listenerStatus.ready")
    : downloading
      ? listener.status === "verifying"
        ? t("quranCompanion.listener.verifying")
        : t("quranCompanion.listenerStatus.downloading", { percent: downloadPercent(listener) })
      : listener.status === "failed"
        ? t("quranCompanion.listenerStatus.failed")
        : listener.status === "unsupported"
          ? Platform.OS === "web"
            ? t("quranCompanion.listener.webUnsupported")
            : t("quranCompanion.listener.unsupported")
          : t("quranCompanion.listenerStatus.missing");

  const subtitle = usable
    ? t("quranCompanion.listenerStatus.readySub")
    : downloading
      ? t("quranCompanion.listener.downloadingBytes", {
          done: formatBytes(listener.bytesDone),
          total: formatBytes(listener.bytesTotal),
        })
      : listener.status === "failed"
        ? `${t(PRACTICE_ERROR_COPY[listener.error ?? "unknown"])}. ${t("quranCompanion.listenerStatus.stillListen")}`
        : listener.status === "unsupported"
          ? t("quranCompanion.listenerStatus.stillListen")
          : online
            ? t("quranCompanion.listenerStatus.missingSub", { size: sizeMb })
            : t("quranCompanion.listenerStatus.offlineSub");

  const icon = usable
    ? ({ ios: "checkmark.seal.fill", android: "verified", web: "verified" } as const)
    : listener.status === "failed"
      ? ({ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" } as const)
      : ({ ios: "waveform", android: "graphic_eq", web: "graphic_eq" } as const);

  return (
    <View
      style={[styles.strip, { backgroundColor: tone.soft, borderColor: tone.border }]}
      accessibilityRole="summary"
    >
      <View style={styles.row}>
        <SymbolView name={icon} size={20} tintColor={tone.color} />
        <View style={styles.flex}>
          <ThemedText type="smallBold">{title}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        </View>
        {downloading ? (
          <Button
            label={t("quranCompanion.listener.cancel")}
            variant="ghost"
            size="sm"
            onPress={onCancel}
          />
        ) : !usable && listener.status !== "unsupported" && online ? (
          <Button
            label={
              listener.status === "failed"
                ? t("quranCompanion.listener.tryAgain")
                : t("quranCompanion.listener.download")
            }
            size="sm"
            onPress={onDownload}
          />
        ) : null}
      </View>
      {downloading ? (
        <ProgressBar value={downloadPercent(listener) / 100} color={colors.accent} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  flex: { flex: 1, minWidth: 0, gap: 2 },
});
