import type { ParsedPrayerImport } from "@munib-tracker/shared/utils";
import { getLocalDateString, parsePrayerImport } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { createId, PrayerRepository, QazaRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useToast } from "@/providers/toast-provider";
import { trackerStore } from "@/stores/tracker-store";

/** How many per-row errors to show in the preview before collapsing the rest. */
const MAX_ERRORS_SHOWN = 8;

export default function ImportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();

  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ParsedPrayerImport | null>(null);
  const [alsoQaza, setAlsoQaza] = useState(false);
  const [importing, setImporting] = useState(false);

  const onPreview = () => {
    setPreview(parsePrayerImport(text, getLocalDateString()));
  };

  const onImport = async () => {
    if (!preview || preview.rows.length === 0) return;
    setImporting(true);
    try {
      const nowIso = new Date().toISOString();
      for (const row of preview.rows) {
        await PrayerRepository.upsertLog({
          id: createId("prayer"),
          prayerId: row.prayerId,
          date: row.date,
          status: row.status,
          updatedAt: nowIso,
          source: "bulk_import",
        });
        // Optional: reflect imported misses in the make-up (qaza) counters.
        if (alsoQaza && row.status === "missed") {
          await QazaRepository.incrementRemaining(row.prayerId, 1);
        }
      }
      await trackerStore.getState().load();
      toast.success(t("import.done", { count: preview.rows.length }));
      setText("");
      setPreview(null);
      router.back();
    } catch {
      toast.error(t("import.failed"));
    } finally {
      setImporting(false);
    }
  };

  const shownErrors = preview?.errors.slice(0, MAX_ERRORS_SHOWN) ?? [];
  const extraErrors = Math.max(0, (preview?.errors.length ?? 0) - MAX_ERRORS_SHOWN);

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("import.title")}
      subtitle={t("import.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/settings"))}
    >
      <Seo path="/settings/import" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("import.pasteTitle")}
            icon={{ ios: "doc.on.clipboard", android: "content_paste", web: "content_paste" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("import.formatHint")}
          </ThemedText>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t("import.placeholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("import.pasteTitle")}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.input,
              {
                backgroundColor: colors.muted,
                color: colors.foreground,
                borderColor: colors.border,
              },
            ]}
          />
          <Button
            label={t("import.preview")}
            variant="secondary"
            fullWidth
            disabled={text.trim().length === 0}
            onPress={onPreview}
            style={styles.action}
          />
        </Card>

        {preview ? (
          <Card padding="three">
            <SectionHeader
              title={t("import.previewTitle")}
              icon={{ ios: "list.bullet.rectangle", android: "fact_check", web: "fact_check" }}
            />
            <View style={styles.summary}>
              <ThemedText type="small">
                {t("import.summaryValid", { count: preview.rows.length })}
              </ThemedText>
              <ThemedText
                type="small"
                style={{
                  color:
                    preview.errors.length > 0 ? tokens.status.danger.color : colors.mutedForeground,
                }}
              >
                {t("import.summaryErrors", { count: preview.errors.length })}
              </ThemedText>
              {preview.duplicates > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("import.summaryDuplicates", { count: preview.duplicates })}
                </ThemedText>
              ) : null}
              {preview.dateRange ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("import.summaryRange", {
                    from: preview.dateRange.from,
                    to: preview.dateRange.to,
                  })}
                </ThemedText>
              ) : null}
            </View>

            {shownErrors.length > 0 ? (
              <View style={[styles.errorBox, { backgroundColor: tokens.status.danger.soft }]}>
                {shownErrors.map((error) => (
                  <ThemedText
                    key={`${error.row}-${error.message}`}
                    type="caption"
                    style={{ color: tokens.status.danger.color }}
                  >
                    {t("import.errorLine", { row: error.row, message: error.message })}
                  </ThemedText>
                ))}
                {extraErrors > 0 ? (
                  <ThemedText type="caption" style={{ color: tokens.status.danger.color }}>
                    {t("import.moreErrors", { count: extraErrors })}
                  </ThemedText>
                ) : null}
              </View>
            ) : null}

            {preview.rows.length > 0 ? (
              <>
                <View style={styles.qazaToggle}>
                  <ToggleRow
                    icon={{ ios: "arrow.uturn.backward", android: "history", web: "history" }}
                    title={t("import.alsoQaza")}
                    subtitle={t("import.alsoQazaHint")}
                    value={alsoQaza}
                    onValueChange={setAlsoQaza}
                  />
                </View>
                {alsoQaza ? (
                  <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
                    {t("qazaCalc.disclaimer")}
                  </ThemedText>
                ) : null}
                <Button
                  label={
                    importing
                      ? t("import.importing")
                      : t("import.commit", { count: preview.rows.length })
                  }
                  fullWidth
                  disabled={importing}
                  onPress={() => void onImport()}
                  style={styles.action}
                />
              </>
            ) : null}
          </Card>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two },
  input: {
    marginTop: Spacing.three,
    minHeight: 140,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    fontSize: 14,
    textAlignVertical: "top",
  },
  action: { marginTop: Spacing.three },
  summary: { marginTop: Spacing.three, gap: 2 },
  errorBox: {
    marginTop: Spacing.three,
    gap: 2,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  qazaToggle: { marginTop: Spacing.three },
  disclaimer: { marginTop: Spacing.two },
});
