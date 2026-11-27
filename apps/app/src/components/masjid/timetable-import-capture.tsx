import { useTranslation } from "react-i18next";
import { Linking, Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SwitchRow } from "@/components/ui/switch-row";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ocrDownloadAccepted, ocrDownloadBytes } from "@/lib/timetable-ocr";

function formatMegabytes(bytes: number, locale: string): string {
  return (bytes / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 1 });
}

/**
 * NF-3.12 capture step: "nothing found / couldn't read" notice, tips, the
 * on-device badge, web download size + Arabic model toggle, keep-photo toggle
 * and the camera / library buttons.
 */
export function TimetableImportCapture({
  masjidName,
  locale,
  notice,
  arabic,
  keepPhoto,
  permissionDenied,
  onArabicChange,
  onKeepPhotoChange,
  onPick,
  onTypeInstead,
  onMark,
}: {
  masjidName: string;
  locale: string;
  /** Shown above the capture card after an empty / failed read. */
  notice: "empty" | "error" | null;
  arabic: boolean;
  keepPhoto: boolean;
  permissionDenied: boolean;
  onArabicChange: (on: boolean) => void;
  onKeepPhotoChange: (on: boolean) => void;
  onPick: (source: "camera" | "library") => void;
  onTypeInstead: () => void;
  /** Offered after an empty read while the photo is still here: mark each time on it. */
  onMark?: () => void;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const web = Platform.OS === "web";
  const deviceBadge = web ? t("timetableImport.inBrowser") : t("timetableImport.onDevice");

  return (
    <View style={styles.stack}>
      {notice ? (
        <Card>
          <SectionHeader
            title={
              notice === "empty" ? t("timetableImport.emptyTitle") : t("timetableImport.errorTitle")
            }
            icon={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
          />
          <ThemedText type="small" style={styles.gapTop}>
            {notice === "empty" ? t("timetableImport.emptyBody") : t("timetableImport.errorBody")}
          </ThemedText>
          {onMark ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
              {t("timetableImport.mark.offer")}
            </ThemedText>
          ) : null}
          <View style={[styles.row, styles.gapTop]}>
            {onMark ? (
              <Button
                size="sm"
                icon={{ ios: "viewfinder", android: "highlight_alt", web: "highlight_alt" }}
                label={t("timetableImport.mark.start")}
                onPress={onMark}
              />
            ) : null}
            <Button
              size="sm"
              variant="secondary"
              label={t("timetableImport.typeInstead")}
              onPress={onTypeInstead}
            />
          </View>
        </Card>
      ) : null}

      <Card>
        <SectionHeader
          title={t("timetableImport.captureTitle")}
          icon={{ ios: "camera.viewfinder", android: "document_scanner", web: "document_scanner" }}
        />
        <View style={styles.list}>
          <ThemedText type="small">{t("timetableImport.intro", { name: masjidName })}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("timetableImport.tips")}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: tokens.status.success.soft }]}>
            <ThemedText type="caption" style={{ color: tokens.status.success.text }}>
              {deviceBadge}
            </ThemedText>
          </View>
          {web ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {ocrDownloadAccepted()
                ? t("timetableImport.webCached")
                : t("timetableImport.webDownload", {
                    size: formatMegabytes(ocrDownloadBytes({ arabic }), locale),
                  })}
            </ThemedText>
          ) : null}
          {web ? (
            <SwitchRow
              title={t("timetableImport.arabicToggle", {
                size: formatMegabytes(
                  ocrDownloadBytes({ arabic: true }) - ocrDownloadBytes(),
                  locale,
                ),
              })}
              value={arabic}
              onValueChange={onArabicChange}
            />
          ) : null}
          <SwitchRow
            title={t("timetableImport.keepPhoto")}
            subtitle={t("timetableImport.keepPhotoHint")}
            value={keepPhoto}
            onValueChange={onKeepPhotoChange}
          />
          <View style={styles.row}>
            {!web ? (
              <Button
                icon={{ ios: "camera.fill", android: "photo_camera", web: "photo_camera" }}
                label={t("timetableImport.takePhoto")}
                onPress={() => onPick("camera")}
              />
            ) : null}
            <Button
              variant={web ? "primary" : "secondary"}
              icon={{ ios: "photo.on.rectangle", android: "image", web: "image" }}
              label={
                web && !ocrDownloadAccepted()
                  ? t("timetableImport.choosePhotoDownload")
                  : t("timetableImport.choosePhoto")
              }
              onPress={() => onPick("library")}
            />
          </View>
          {permissionDenied ? (
            <View style={styles.list}>
              <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
                {t("timetableImport.cameraDenied")}
              </ThemedText>
              <Button
                size="sm"
                variant="ghost"
                label={t("timetableImport.openSettings")}
                onPress={() => void Linking.openSettings()}
              />
            </View>
          ) : null}
        </View>
      </Card>

      <ThemedText type="caption" themeColor="mutedForeground">
        {t("timetableImport.privacy")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  list: { gap: Spacing.two, marginTop: Spacing.two },
  gapTop: { marginTop: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
});
