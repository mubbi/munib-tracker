import { useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Share, StyleSheet, TextInput } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { applyBackup, type BackupFile, exportBackup, parseBackup } from "@/lib/backup";
import { useToast } from "@/providers/toast-provider";
import { reloadAllStores } from "@/stores/reload-all-stores";

export default function BackupScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const toast = useToast();

  const [exported, setExported] = useState("");
  const [importText, setImportText] = useState("");
  const [pending, setPending] = useState<BackupFile | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onExport = async () => {
    const text = await exportBackup();
    setExported(text);
    if (Platform.OS === "web") {
      try {
        await navigator?.clipboard?.writeText(text);
        toast.success(t("backup.copied"));
      } catch {
        // fall through — the text is shown for manual copy
      }
      return;
    }
    try {
      await Share.share({ message: text });
    } catch {
      // cancelled — the text remains visible for manual copy
    }
  };

  const onPreview = () => {
    const result = parseBackup(importText);
    if (!result.ok) {
      toast.error(t(`backup.error.${result.error}`));
      setPending(null);
      return;
    }
    setPending(result.file);
    setConfirmOpen(true);
  };

  const onRestore = async () => {
    if (!pending) return;
    await applyBackup(pending);
    await reloadAllStores();
    setConfirmOpen(false);
    setPending(null);
    setImportText("");
    toast.success(t("backup.restored"));
    goBackOrReplace(router, "/settings");
  };

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("backup.title")}
      subtitle={t("backup.subtitle")}
      onBack={() => (goBackOrReplace(router, "/settings"))}
    >
      <Seo path="/settings/backup" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("backup.exportTitle")}
            icon={{ ios: "square.and.arrow.up", android: "ios_share", web: "ios_share" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("backup.exportHint")}
          </ThemedText>
          <Button
            label={t("backup.exportAction")}
            variant="secondary"
            fullWidth
            onPress={() => void onExport()}
            style={styles.action}
          />
          {exported ? (
            <TextInput
              value={exported}
              editable={false}
              multiline
              selectTextOnFocus
              style={[
                styles.output,
                {
                  backgroundColor: colors.muted,
                  color: colors.mutedForeground,
                  borderColor: colors.border,
                },
              ]}
            />
          ) : null}
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("backup.importTitle")}
            icon={{ ios: "square.and.arrow.down", android: "download", web: "download" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("backup.importHint")}
          </ThemedText>
          <TextInput
            value={importText}
            onChangeText={setImportText}
            placeholder={t("backup.importPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
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
            label={t("backup.importAction")}
            fullWidth
            disabled={importText.trim().length === 0}
            onPress={onPreview}
            style={styles.action}
          />
        </Card>
      </Stagger>

      <ConfirmDialog
        visible={confirmOpen}
        title={t("backup.confirmTitle")}
        message={t("backup.confirmMessage")}
        confirmLabel={t("backup.confirmAction")}
        destructive
        onConfirm={() => void onRestore()}
        onClose={() => setConfirmOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two },
  action: { marginTop: Spacing.three },
  output: {
    marginTop: Spacing.three,
    minHeight: 100,
    maxHeight: 160,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    fontSize: 11,
    textAlignVertical: "top",
  },
  input: {
    marginTop: Spacing.three,
    minHeight: 120,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    fontSize: 12,
    textAlignVertical: "top",
  },
});
