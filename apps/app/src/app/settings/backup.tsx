import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Share, StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { SettingsDetailScreen } from "@/components/settings/settings-screen";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TextField } from "@/components/ui/text-field";
import { Spacing } from "@/constants/theme";
import {
  applyBackup,
  type BackupFile,
  exportBackup,
  invalidateSyncStateAfterRestore,
  parseBackup,
} from "@/lib/backup";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { backupFileName, pickBackupFileText, saveBackupFile } from "@/lib/settings/backup-file";
import { type BackupSummary, summarizeBackup } from "@/lib/settings/backup-summary";
import { formatDisplayDate } from "@/lib/time";
import { useToast } from "@/providers/toast-provider";
import { reloadAllStores } from "@/stores/reload-all-stores";

type Pending = { file: BackupFile; summary: BackupSummary };

/**
 * Backup & restore (P5-46, D-03). Backups are files: "Save backup file" shares
 * (native) or downloads (web) a dated `.json`; "Copy as text" keeps the old
 * text path. Restore picks a file (or pasted text), shows what it contains, and
 * only then asks for the destructive confirm, which stays busy while the
 * restore runs and reports failures inline. The backup format and
 * `applyBackup` are unchanged.
 */
export default function BackupScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  // Web clipboard can fail (insecure context, denied permission): show the text to copy by hand (B-33).
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // No route-level empty state on TV (§4.5.10): bounce to the group.
  if (isTV()) {
    return (
      <SettingsDetailScreen
        parent="data"
        path="/settings/backup"
        title={t("backup.title")}
        available={false}
      />
    );
  }

  const web = Platform.OS === "web";

  const onSaveFile = async () => {
    if (saving) return;
    setSaving(true);
    setExportError(null);
    try {
      const nowIso = new Date().toISOString();
      const text = await exportBackup(nowIso);
      const result = await saveBackupFile(
        text,
        backupFileName(nowIso),
        t("backup.saveDialogTitle"),
      );
      if (result === "unavailable") setExportError(t("backup.saveUnavailable"));
      else if (web) toast.success(t("backup.downloaded"));
    } catch {
      setExportError(t("backup.exportFailed"));
    } finally {
      setSaving(false);
    }
  };

  const onCopyText = async () => {
    if (copying) return;
    setCopying(true);
    setExportError(null);
    setCopyFallback(null);
    let text: string | null = null;
    try {
      text = await exportBackup();
      if (web) {
        await navigator.clipboard.writeText(text);
        toast.success(t("backup.copied"));
      } else {
        await Share.share({ message: text });
      }
    } catch {
      if (web && text != null) {
        setCopyFallback(text);
        return;
      }
      setExportError(t("backup.exportFailed"));
    } finally {
      setCopying(false);
    }
  };

  /** Validates text from a file or the paste field and shows its contents. */
  const preview = (text: string) => {
    const result = parseBackup(text);
    if (!result.ok) {
      setPending(null);
      setRestoreError(t(`backup.error.${result.error}`));
      return;
    }
    setRestoreError(null);
    setPending({ file: result.file, summary: summarizeBackup(result.file, result.entries) });
  };

  const onChooseFile = async () => {
    if (picking) return;
    setPicking(true);
    setRestoreError(null);
    try {
      const text = await pickBackupFileText();
      if (text != null) preview(text);
    } catch {
      setRestoreError(t("backup.pickFailed"));
    } finally {
      setPicking(false);
    }
  };

  const onRestore = async () => {
    if (!pending) return;
    await applyBackup(pending.file);
    // Restored data replaced everything on disk — invalidate the sync cursors so
    // the next cloud sync re-uploads it instead of the delta filter skipping it.
    await invalidateSyncStateAfterRestore();
    await reloadAllStores();
    setPending(null);
    setPasteText("");
    toast.success(t("backup.restored"));
    goBackOrReplace(router, "/settings/data");
  };

  const savedOn = pending?.summary.exportedAt
    ? formatDisplayDate(new Date(pending.summary.exportedAt), i18n.language)
    : null;

  return (
    <SettingsDetailScreen
      parent="data"
      path="/settings/backup"
      title={t("backup.title")}
      subtitle={t("backup.subtitle")}
    >
      <Stagger>
        <Card>
          <SectionHeader
            title={t("backup.exportTitle")}
            icon={{ ios: "square.and.arrow.up", android: "ios_share", web: "ios_share" }}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
            {t("backup.exportHint")}
          </ThemedText>
          <View style={styles.actions}>
            <Button
              label={t("backup.saveFile")}
              fullWidth
              loading={saving}
              onPress={() => void onSaveFile()}
            />
            <Button
              label={web ? t("backup.copyText") : t("backup.shareText")}
              variant="secondary"
              fullWidth
              loading={copying}
              onPress={() => void onCopyText()}
            />
          </View>
          {exportError ? (
            <Callout tone="danger" style={styles.callout}>
              {exportError}
            </Callout>
          ) : null}
          {copyFallback != null ? (
            <View style={styles.callout}>
              <Callout tone="warning">{t("backup.copyFallbackHint")}</Callout>
              <TextField
                label={t("backup.copyFallbackLabel")}
                value={copyFallback}
                // Read-only in effect: the text stays the backup, but remains selectable.
                onChangeText={() => undefined}
                multiline
                selectTextOnFocus
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
          ) : null}
        </Card>

        <Card>
          <SectionHeader
            title={t("backup.importTitle")}
            icon={{ ios: "square.and.arrow.down", android: "download", web: "download" }}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.hint}>
            {t("backup.restoreHint")}
          </ThemedText>
          <View style={styles.actions}>
            <Button
              label={t("backup.chooseFile")}
              variant="secondary"
              fullWidth
              loading={picking}
              onPress={() => void onChooseFile()}
            />
          </View>
          <View style={styles.paste}>
            <CollapsibleSection title={t("backup.pasteInstead")}>
              <TextField
                label={t("backup.pasteLabel")}
                value={pasteText}
                onChangeText={setPasteText}
                placeholder={t("backup.importPlaceholder")}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
              <Button
                label={t("backup.checkPasted")}
                variant="secondary"
                fullWidth
                disabled={pasteText.trim().length === 0}
                onPress={() => preview(pasteText)}
                style={styles.action}
              />
            </CollapsibleSection>
          </View>
          {restoreError ? (
            <Callout tone="danger" style={styles.callout}>
              {restoreError}
            </Callout>
          ) : null}
        </Card>

        {pending ? (
          <Card>
            <SectionHeader
              title={t("backup.previewTitle")}
              icon={{ ios: "list.bullet.rectangle", android: "fact_check", web: "fact_check" }}
            />
            <View style={styles.summary}>
              {savedOn ? (
                <ThemedText type="small">
                  {t("backup.summary.savedOn", { date: savedOn })}
                </ThemedText>
              ) : null}
              {pending.summary.areas.map((area) => (
                <ThemedText key={area.id} type="small">
                  {t("backup.summary.row", {
                    label: t(`backup.summary.area.${area.id}`),
                    count: area.count,
                  })}
                </ThemedText>
              ))}
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("backup.summary.sections", { count: pending.summary.sections })}
              </ThemedText>
            </View>
            <View style={styles.actions}>
              <Button
                label={t("backup.restoreAction")}
                variant="destructive"
                fullWidth
                onPress={() => setConfirmOpen(true)}
              />
              <Button
                label={t("backup.chooseAnother")}
                variant="ghost"
                fullWidth
                onPress={() => setPending(null)}
              />
            </View>
          </Card>
        ) : null}
      </Stagger>

      <ConfirmDialog
        visible={confirmOpen}
        title={t("backup.confirmTitle")}
        message={t("backup.confirmMessage")}
        confirmLabel={t("backup.confirmAction")}
        destructive
        onConfirm={onRestore}
        errorMessage={t("backup.restoreFailed")}
        onClose={() => setConfirmOpen(false)}
      />
    </SettingsDetailScreen>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two },
  actions: { marginTop: Spacing.three, gap: Spacing.two },
  action: { marginTop: Spacing.three },
  paste: { marginTop: Spacing.two },
  callout: { marginTop: Spacing.three },
  summary: { marginTop: Spacing.three, gap: Spacing.half },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/backup");
