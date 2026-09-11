import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AttachmentPickSource } from "@/lib/attachments/attachment-file-manager";
import { useChevronForward } from "@/lib/rtl";

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Parent closes the sheet and presents the system picker (required on iOS). */
  onSelect: (source: AttachmentPickSource) => void;
  /**
   * When true, render options in-place (no nested Modal). Required when the
   * parent is already a Sheet — nested BlurView Modals crash on Android.
   */
  embedded?: boolean;
};

type Option = {
  source: AttachmentPickSource;
  icon: NonNullable<SymbolViewProps["name"]>;
  labelKey: string;
  hintKey: string;
};

const OPTIONS: Option[] = [
  {
    source: "camera",
    icon: { ios: "camera", android: "photo_camera", web: "photo_camera" },
    labelKey: "customAdhkar.attachments.sourceCamera",
    hintKey: "customAdhkar.attachments.sourceCameraHint",
  },
  {
    source: "gallery",
    icon: { ios: "photo.on.rectangle", android: "photo_library", web: "photo_library" },
    labelKey: "customAdhkar.attachments.sourceGallery",
    hintKey: "customAdhkar.attachments.sourceGalleryHint",
  },
  {
    source: "document",
    icon: { ios: "folder", android: "folder_open", web: "folder_open" },
    labelKey: "customAdhkar.attachments.sourceDocument",
    hintKey: "customAdhkar.attachments.sourceDocumentHint",
  },
];

function SourceOptionsList({ onSelect }: { onSelect: (source: AttachmentPickSource) => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();

  const visibleOptions =
    Platform.OS === "web" ? OPTIONS.filter((o) => o.source === "document") : OPTIONS;

  return (
    <View style={styles.list}>
      {visibleOptions.map((opt) => (
        <PressableScale
          key={opt.source}
          onPress={() => onSelect(opt.source)}
          haptic="selection"
          accessibilityRole="button"
          accessibilityLabel={t(opt.labelKey)}
          style={[styles.row, { backgroundColor: colors.muted, borderColor: colors.border }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: tokens.accentSoft }]}>
            <SymbolView name={opt.icon} size={22} tintColor={colors.accent} />
          </View>
          <View style={styles.rowText}>
            <ThemedText type="smallBold">{t(opt.labelKey)}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t(opt.hintKey)}
            </ThemedText>
          </View>
          <SymbolView name={chevronForward} size={18} tintColor={colors.mutedForeground} />
        </PressableScale>
      ))}
    </View>
  );
}

export function AttachmentSourceSheet({ visible, onClose, onSelect, embedded = false }: Props) {
  const { t } = useTranslation();

  if (embedded) {
    if (!visible) return null;
    return (
      <View style={styles.embedded}>
        <View style={styles.embeddedHeader}>
          <ThemedText type="smallBold">{t("customAdhkar.attachments.sourceTitle")}</ThemedText>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("common.cancel")}
            onPress={onClose}
            haptic="light"
            hitSlop={8}
          >
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("common.cancel")}
            </ThemedText>
          </PressableScale>
        </View>
        <SourceOptionsList onSelect={onSelect} />
      </View>
    );
  }

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      <ThemedText type="subtitle" style={styles.title}>
        {t("customAdhkar.attachments.sourceTitle")}
      </ThemedText>
      <SourceOptionsList onSelect={onSelect} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: Spacing.three },
  embedded: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  embeddedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  list: { gap: Spacing.two, alignSelf: "stretch" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1, gap: 2 },
});
