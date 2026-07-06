import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ReportAttachmentInput } from "@/lib/content-report-api";

const MAX_ATTACHMENTS = 3;

export function ContentReportAttachments({
  attachments,
  onChange,
}: {
  attachments: ReportAttachmentInput[];
  onChange: (next: ReportAttachmentInput[]) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  const pickImage = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsMultipleSelection: false,
    });

    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? "image/jpeg";
    const filename = asset.fileName ?? `proof-${Date.now()}.jpg`;
    onChange([...attachments, { uri: asset.uri, mimeType, filename }]);
  };

  const removeAt = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.wrap}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("contentReport.proofLabel")}
      </ThemedText>
      <View style={styles.grid}>
        {attachments.map((attachment, index) => (
          <Pressable
            key={attachment.uri}
            accessibilityLabel={t("contentReport.removeProof")}
            onLongPress={() => removeAt(index)}
            style={[styles.thumb, { borderColor: colors.border }]}
          >
            <Image source={{ uri: attachment.uri }} style={styles.image} />
          </Pressable>
        ))}
        {attachments.length < MAX_ATTACHMENTS ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("contentReport.addProof")}
            onPress={() => void pickImage()}
            style={[styles.add, { backgroundColor: tokens.accentSoft, borderColor: colors.border }]}
          >
            <SymbolView
              name={{
                ios: "photo.badge.plus",
                android: "add_photo_alternate",
                web: "add_photo_alternate",
              }}
              size={22}
              tintColor={colors.accent}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("contentReport.addProof")}
            </ThemedText>
          </PressableScale>
        ) : null}
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("contentReport.proofHint")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
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
