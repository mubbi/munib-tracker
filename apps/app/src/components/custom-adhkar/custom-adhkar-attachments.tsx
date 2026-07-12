import { USER_MEDIA_MAX_PER_ENTITY } from "@munib-tracker/shared/constants";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { AttachmentSourceSheet } from "@/components/custom-adhkar/attachment-source-sheet";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type AttachmentPickSource,
  pickAttachmentFromSource,
  validatePickedAttachment,
} from "@/lib/attachments/attachment-file-manager";
import { attachmentPickErrorFromUnknown, isPdfMime } from "@/lib/attachments/attachment-mime";
import { attachmentPickFailureFromOutcome } from "@/lib/attachments/map-attachment-pick-outcome";
import { runAfterSheetDismiss } from "@/lib/platform/run-after-sheet-dismiss";
import { useToast } from "@/providers/toast-provider";

export type DraftAdhkarAttachment = {
  uri: string;
  mimeType: string;
  filename: string;
};

export function CustomAdhkarAttachments({
  attachments,
  onChange,
  canUpload,
}: {
  attachments: DraftAdhkarAttachment[];
  onChange: (next: DraftAdhkarAttachment[]) => void;
  canUpload: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const [sourceOpen, setSourceOpen] = useState(false);

  const promptPermission = (canAskAgain: boolean, source: AttachmentPickSource) => {
    if (canAskAgain) {
      Alert.alert(
        t("customAdhkar.attachments.permissionTitle"),
        t("customAdhkar.attachments.permissionBody"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("customAdhkar.attachments.allowAccess"),
            onPress: () => void runPick(source),
          },
        ],
      );
      return;
    }
    Alert.alert(
      t("customAdhkar.attachments.permissionTitle"),
      t("customAdhkar.attachments.permissionSettingsBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("notif.openSettings"),
          onPress: () => void Linking.openSettings(),
        },
      ],
    );
  };

  const showPickError = (code: string) => {
    switch (code) {
      case "UNSUPPORTED_MIME":
        toast.warning(t("customAdhkar.attachments.unsupportedType"));
        break;
      case "FILE_TOO_LARGE":
        toast.warning(t("customAdhkar.attachments.tooLarge"));
        break;
      case "PERMISSION_DENIED":
        toast.warning(t("customAdhkar.attachments.permissionDenied"));
        break;
      case "READ_FAILED":
        toast.error(t("customAdhkar.attachments.readFailed"));
        break;
      default:
        toast.error(t("customAdhkar.attachments.pickFailed"));
    }
  };

  const runPick = async (source: AttachmentPickSource) => {
    try {
      const outcome = await pickAttachmentFromSource(source);
      const failure = attachmentPickFailureFromOutcome(outcome);
      if (failure) {
        if (failure.canceled) return;
        if (failure.permissionDenied) {
          promptPermission(failure.canAskAgain !== false, source);
          return;
        }
        if (failure.error) showPickError(failure.error);
        return;
      }

      if (outcome.kind !== "picked") return;
      const validated = await validatePickedAttachment(outcome.attachment);
      onChange([
        ...attachments,
        {
          uri: validated.uri,
          mimeType: validated.mimeType,
          filename: validated.fileName,
        },
      ]);
    } catch (error) {
      showPickError(attachmentPickErrorFromUnknown(error));
    }
  };

  const openSourcePicker = () => {
    if (!canUpload) {
      toast.warning(t("customAdhkar.attachments.signInRequired"));
      return;
    }
    if (attachments.length >= USER_MEDIA_MAX_PER_ENTITY) return;

    if (Platform.OS === "web") {
      void runPick("document");
      return;
    }
    setSourceOpen(true);
  };

  const handleSourceSelect = (source: AttachmentPickSource) => {
    setSourceOpen(false);
    runAfterSheetDismiss(() => {
      void runPick(source);
    });
  };

  const removeAt = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.wrap}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("customAdhkar.attachments.label")}
      </ThemedText>
      <View style={styles.grid}>
        {attachments.map((attachment, index) => (
          <Pressable
            key={attachment.uri}
            accessibilityLabel={t("customAdhkar.attachments.remove")}
            onLongPress={() => removeAt(index)}
            style={[styles.thumb, { borderColor: colors.border, backgroundColor: colors.muted }]}
          >
            {isPdfMime(attachment.mimeType) ? (
              <View style={styles.pdfThumb}>
                <SymbolView
                  name={{ ios: "doc.richtext", android: "picture_as_pdf", web: "picture_as_pdf" }}
                  size={28}
                  tintColor={colors.accent}
                />
              </View>
            ) : (
              <Image source={{ uri: attachment.uri }} style={styles.image} />
            )}
          </Pressable>
        ))}
        {attachments.length < USER_MEDIA_MAX_PER_ENTITY ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("customAdhkar.attachments.add")}
            onPress={openSourcePicker}
            style={[styles.add, { backgroundColor: tokens.accentSoft, borderColor: colors.border }]}
          >
            <SymbolView
              name={{
                ios: "plus.circle",
                android: "add_circle",
                web: "add_circle",
              }}
              size={22}
              tintColor={colors.accent}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("customAdhkar.attachments.add")}
            </ThemedText>
          </PressableScale>
        ) : null}
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {canUpload
          ? t("customAdhkar.attachments.hint")
          : t("customAdhkar.attachments.signInRequired")}
      </ThemedText>

      <AttachmentSourceSheet
        visible={sourceOpen}
        onClose={() => setSourceOpen(false)}
        onSelect={handleSourceSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two, marginBottom: Spacing.three },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: { width: "100%", height: "100%" },
  pdfThumb: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    padding: Spacing.one,
  },
  add: {
    width: 88,
    height: 88,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    padding: Spacing.one,
  },
});
