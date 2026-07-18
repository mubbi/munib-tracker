import { USER_MEDIA_MAX_PER_ENTITY } from "@munib-tracker/shared/constants";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform, StyleSheet, View } from "react-native";
import { AttachmentThumb } from "@/components/attachments/attachment-thumb";
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
import { attachmentPickErrorFromUnknown } from "@/lib/attachments/attachment-mime";
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
      {attachments.length < USER_MEDIA_MAX_PER_ENTITY ? (
        <View style={[styles.addField, { backgroundColor: colors.muted }]}>
          <View style={styles.addCopy}>
            <ThemedText type="smallBold">{t("customAdhkar.attachments.add")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {canUpload
                ? t("customAdhkar.attachments.hint")
                : t("customAdhkar.attachments.signInRequired")}
            </ThemedText>
          </View>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("customAdhkar.attachments.add")}
            onPress={openSourcePicker}
            style={[styles.addButton, { backgroundColor: tokens.accentSoft }]}
            haptic="light"
          >
            <SymbolView
              name={{
                ios: "plus",
                android: "add",
                web: "add",
              }}
              size={22}
              tintColor={colors.accent}
            />
          </PressableScale>
        </View>
      ) : null}
      {attachments.length > 0 ? (
        <View style={styles.grid}>
          {attachments.map((attachment, index) => (
            <View
              key={attachment.uri}
              style={[styles.thumb, { borderColor: colors.border, backgroundColor: colors.muted }]}
            >
              <AttachmentThumb uri={attachment.uri} mimeType={attachment.mimeType} iconSize={28} />
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={t("customAdhkar.attachments.remove")}
                hitSlop={8}
                haptic="light"
                scaleTo={0.9}
                onPress={() => removeAt(index)}
                onLongPress={() => removeAt(index)}
                style={[styles.removeBadge, { backgroundColor: colors.background }]}
              >
                <SymbolView
                  name={{ ios: "xmark", android: "close", web: "close" }}
                  size={14}
                  tintColor={colors.mutedForeground}
                />
              </PressableScale>
            </View>
          ))}
        </View>
      ) : null}

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
  addField: {
    minHeight: 72,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    padding: Spacing.three,
  },
  addCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
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
  removeBadge: {
    position: "absolute",
    top: Spacing.one,
    end: Spacing.one,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
