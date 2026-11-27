import type { ImportError, ParsedPrayerImport } from "@munib-tracker/shared/utils";
import {
  getLocalDateString,
  IMPORT_PRAYER_VALUES,
  IMPORT_STATUS_VALUES,
  parsePrayerImport,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ToggleRow } from "@/components/settings/settings-rows";
import { SettingsDetailScreen } from "@/components/settings/settings-screen";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TextField } from "@/components/ui/text-field";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { createId, PrayerRepository, QazaRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";
import { trackerStore } from "@/stores/tracker-store";

/** How many per-row errors to show in the preview before collapsing the rest. */
const MAX_ERRORS_SHOWN = 8;

/** Machine-format sample under "Format details" (data, not copy — not translated). */
const FORMAT_SAMPLE = [
  "date,prayerId,status",
  "2026-06-01,fajr,completed",
  "2026-06-01,dhuhr,missed",
].join("\n");

/**
 * F-03: the parser returns `{ code, params }`; the user sees a translated,
 * actionable sentence — never the parser's English `message`.
 */
function useImportErrorText() {
  const { t } = useTranslation();
  return (error: ImportError): string => {
    const value = error.params?.value ?? "";
    const reason =
      error.code !== "invalid_json" && value === ""
        ? t("import.error.empty")
        : t(`import.error.${error.code}`, {
            value,
            // Accepted values are typed as-is (not translated): passed in, not in the catalogs.
            allowed: (error.code === "unknown_status"
              ? IMPORT_STATUS_VALUES
              : IMPORT_PRAYER_VALUES
            ).join(", "),
          });
    return error.row > 0 ? t("import.errorLine", { row: error.row, message: reason }) : reason;
  };
}

export default function ImportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const toast = useToast();
  const errorText = useImportErrorText();

  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ParsedPrayerImport | null>(null);
  const [alsoQaza, setAlsoQaza] = useState(false);
  const [importing, setImporting] = useState(false);

  // No route-level empty state on TV (§4.5.10): bounce to the group.
  if (isTV()) {
    return (
      <SettingsDetailScreen
        parent="data"
        path="/settings/import"
        title={t("import.title")}
        available={false}
      />
    );
  }

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
      goBackOrReplace(router, "/settings/data");
    } catch {
      toast.error(t("import.failed"));
    } finally {
      setImporting(false);
    }
  };

  const shownErrors = preview?.errors.slice(0, MAX_ERRORS_SHOWN) ?? [];
  const extraErrors = Math.max(0, (preview?.errors.length ?? 0) - MAX_ERRORS_SHOWN);

  return (
    <SettingsDetailScreen
      parent="data"
      path="/settings/import"
      title={t("import.title")}
      subtitle={t("import.subtitle")}
    >
      <Stagger>
        <Card>
          <SectionHeader
            title={t("import.pasteTitle")}
            icon={{ ios: "doc.on.clipboard", android: "content_paste", web: "content_paste" }}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
            {t("import.hint")}
          </ThemedText>
          <View style={styles.details}>
            <CollapsibleSection title={t("import.formatDetails")}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("import.formatHint")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.sampleLabel}>
                {t("import.formatSample")}
              </ThemedText>
              <View style={[styles.sample, { backgroundColor: colors.muted }]}>
                <ThemedText type="caption" selectable style={styles.sampleText}>
                  {FORMAT_SAMPLE}
                </ThemedText>
              </View>
            </CollapsibleSection>
          </View>
          <TextField
            label={t("import.fieldLabel")}
            value={text}
            onChangeText={(next) => {
              setText(next);
              // A new paste invalidates the old preview.
              if (preview) setPreview(null);
            }}
            placeholder={t("import.placeholder")}
            multiline
            minLines={6}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            style={styles.field}
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
          <Card>
            <SectionHeader
              title={t("import.previewTitle")}
              icon={{ ios: "list.bullet.rectangle", android: "fact_check", web: "fact_check" }}
            />
            <View style={styles.summary}>
              <ThemedText type="small">
                {t("import.summaryValid", { count: preview.rows.length })}
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
              <Callout
                tone="danger"
                title={t("import.summaryErrors", { count: preview.errors.length })}
                style={styles.errors}
              >
                <View style={styles.errorLines}>
                  {shownErrors.map((error) => (
                    <ThemedText key={`${error.row}-${error.code}`} type="small">
                      {errorText(error)}
                    </ThemedText>
                  ))}
                  {extraErrors > 0 ? (
                    <ThemedText type="small" themeColor="mutedForeground">
                      {t("import.moreErrors", { count: extraErrors })}
                    </ThemedText>
                  ) : null}
                </View>
              </Callout>
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
                  label={t("import.commit", { count: preview.rows.length })}
                  fullWidth
                  loading={importing}
                  onPress={() => void onImport()}
                  style={styles.action}
                />
              </>
            ) : null}
          </Card>
        ) : null}
      </Stagger>
    </SettingsDetailScreen>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two },
  details: { marginTop: Spacing.two },
  sampleLabel: { marginTop: Spacing.two },
  sample: {
    marginTop: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  sampleText: { fontFamily: Fonts?.mono },
  field: { marginTop: Spacing.three },
  action: { marginTop: Spacing.three },
  summary: { marginTop: Spacing.three, gap: Spacing.half },
  errors: { marginTop: Spacing.three },
  errorLines: { gap: Spacing.half },
  qazaToggle: { marginTop: Spacing.three },
  disclaimer: { marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/import");
