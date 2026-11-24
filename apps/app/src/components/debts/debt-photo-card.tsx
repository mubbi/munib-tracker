import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type AttachmentPickOutcome,
  pickAttachmentFromCamera,
  pickAttachmentFromGallery,
} from "@/lib/attachments/attachment-file-manager";
import { discardPickedFile } from "@/lib/attachments/discard-picked-file";
import { loadDebtPhoto, preparePickedPhoto } from "@/lib/debts/debt-photo";
import { debtsActions } from "@/lib/debts/debts-store";

type PhotoState =
  | { kind: "none" }
  | { kind: "loading" }
  | { kind: "shown"; uri: string }
  | { kind: "elsewhere" }
  | { kind: "unavailable" };

type PhotoError = "too-large" | "unsupported" | "read-failed" | "permission" | "save-failed";

/**
 * Optional document photo for a debt (NF-3.8): a signed note or receipt.
 * Encrypted with the vault key and kept on this device only — never synced or
 * backed up (the card says so). Not rendered on TV.
 */
export function DebtPhotoCard({
  debtId,
  documentUri,
}: {
  debtId: string;
  documentUri: string | undefined;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const [photo, setPhoto] = useState<PhotoState>({ kind: documentUri ? "loading" : "none" });
  const [error, setError] = useState<PhotoError | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!documentUri) {
      setPhoto({ kind: "none" });
      return;
    }
    let alive = true;
    setPhoto({ kind: "loading" });
    loadDebtPhoto(documentUri)
      .then((uri) => {
        if (alive) setPhoto(uri ? { kind: "shown", uri } : { kind: "elsewhere" });
      })
      .catch(() => {
        if (alive) setPhoto({ kind: "unavailable" });
      });
    return () => {
      alive = false;
    };
  }, [documentUri]);

  const attach = async (pick: () => Promise<AttachmentPickOutcome>) => {
    setError(null);
    setBusy(true);
    let pickedUri: string | null = null;
    try {
      const outcome = await pick();
      if (outcome.kind === "permission_denied") return setError("permission");
      if (outcome.kind !== "picked") return;
      pickedUri = outcome.attachment.uri;
      const prepared = await preparePickedPhoto(pickedUri);
      if (!prepared.ok) return setError(prepared.reason);
      await debtsActions.setDocumentPhoto(debtId, prepared.bytes, prepared.mimeType);
    } catch {
      setError("save-failed");
    } finally {
      // The picker's plaintext copy in the cache must not outlive the sealed one.
      discardPickedFile(pickedUri);
      setBusy(false);
    }
  };

  const hasPhoto = !!documentUri;

  return (
    <Card padding="three">
      <SectionHeader
        title={t("debts.photo.title")}
        subtitle={t("debts.photo.privacy")}
        icon={{ ios: "doc.text.image", android: "image", web: "image" }}
      />
      <View style={styles.body}>
        {photo.kind === "shown" ? (
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            contentFit="contain"
            accessible
            accessibilityLabel={t("debts.photo.imageA11y")}
          />
        ) : null}
        {photo.kind === "elsewhere" || photo.kind === "unavailable" ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t(photo.kind === "elsewhere" ? "debts.photo.elsewhere" : "debts.photo.unavailable")}
          </ThemedText>
        ) : null}
        {error ? (
          <ThemedText
            type="small"
            style={{ color: tokens.status.danger.text }}
            accessibilityRole="alert"
          >
            {t(`debts.photo.error.${error}`)}
          </ThemedText>
        ) : null}
        <View style={styles.actions}>
          {Platform.OS !== "web" ? (
            <Button
              label={t("debts.photo.camera")}
              variant="secondary"
              size="sm"
              disabled={busy}
              onPress={() => void attach(pickAttachmentFromCamera)}
            />
          ) : null}
          <Button
            label={t(hasPhoto ? "debts.photo.replace" : "debts.photo.choose")}
            variant="secondary"
            size="sm"
            disabled={busy}
            onPress={() => void attach(pickAttachmentFromGallery)}
          />
          {hasPhoto ? (
            <Button
              label={t("debts.photo.remove")}
              variant="ghost"
              size="sm"
              disabled={busy}
              onPress={() => {
                setError(null);
                void debtsActions.removeDocumentPhoto(debtId).catch(() => setError("save-failed"));
              }}
            />
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
  image: { width: "100%", aspectRatio: 4 / 3, borderRadius: Radius.md },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
