import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { AttachmentThumb } from "@/components/attachments/attachment-thumb";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ReportAttachmentInput } from "@/lib/content-report-api";
import { useToast } from "@/providers/toast-provider";

const MAX_ATTACHMENTS = 3;
const ALLOWED_IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

function normalizeMime(mimeType: string | undefined): string {
  return mimeType?.split(";")[0]?.trim().toLowerCase() ?? "";
}

function isAllowedProofImage(mimeType: string | undefined, fileName: string): boolean {
  const mime = normalizeMime(mimeType);
  if (ALLOWED_IMAGE_MIME.has(mime)) return true;
  // Some platforms omit mimeType; infer from extension.
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp";
}

function isUnsupportedFileTypeError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /unsupported file type/i.test(error.message);
}

export function ContentReportAttachments({
  attachments,
  onChange,
}: {
  attachments: ReportAttachmentInput[];
  onChange: (next: ReportAttachmentInput[]) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();

  const pickImage = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) return;

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast.warning(t("contentReport.permissionDenied"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        allowsMultipleSelection: false,
      });

      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const filename = asset.fileName ?? `proof-${Date.now()}.jpg`;
      const mimeType = normalizeMime(asset.mimeType) || "image/jpeg";

      if (!isAllowedProofImage(mimeType, filename)) {
        toast.warning(t("contentReport.imagesOnly"));
        return;
      }

      onChange([...attachments, { uri: asset.uri, mimeType, filename }]);
    } catch (error) {
      if (isUnsupportedFileTypeError(error)) {
        toast.warning(t("contentReport.imagesOnly"));
        return;
      }
      toast.error(t("contentReport.pickFailed"));
    }
  };

  const removeAt = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.wrap}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("contentReport.proofLabel")}
      </ThemedText>
      {attachments.length < MAX_ATTACHMENTS ? (
        <View style={[styles.addField, { backgroundColor: colors.muted }]}>
          <View style={styles.addCopy}>
            <ThemedText type="smallBold">{t("contentReport.addProof")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("contentReport.proofHint")}
            </ThemedText>
          </View>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("contentReport.addProof")}
            onPress={() => void pickImage()}
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("contentReport.removeProof")}
                hitSlop={8}
                onPress={() => removeAt(index)}
                onLongPress={() => removeAt(index)}
                style={[styles.removeBadge, { backgroundColor: colors.background }]}
              >
                <SymbolView
                  name={{ ios: "xmark", android: "close", web: "close" }}
                  size={14}
                  tintColor={colors.mutedForeground}
                />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
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
