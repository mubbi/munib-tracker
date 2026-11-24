import type { AnnotationColorId } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ANNOTATION_COLOR_IDS, annotationSwatch } from "@/lib/quran-notes/annotation-colors";

type AnnotationSwatchesProps = {
  value: AnnotationColorId | null;
  onChange: (color: AnnotationColorId | null) => void;
  /** Show the "Clear" chip (highlight sheet / editor). */
  allowClear?: boolean;
};

/** The five highlight colours plus "Clear" — shared by the highlight sheet and the note editor. */
export function AnnotationSwatches({
  value,
  onChange,
  allowClear = true,
}: AnnotationSwatchesProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {ANNOTATION_COLOR_IDS.map((id) => {
        const selected = value === id;
        return (
          <PressableScale
            key={id}
            haptic="selection"
            accessibilityRole="radio"
            accessibilityLabel={t(`quranNotes.color.${id}`)}
            accessibilityState={{ selected }}
            onPress={() => onChange(id)}
            style={[
              styles.swatch,
              {
                backgroundColor: annotationSwatch(id, colors.background),
                borderColor: selected ? colors.foreground : tokens.hairline,
              },
            ]}
            testID={`annotation-swatch-${id}`}
          >
            {selected ? (
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={16}
                tintColor={colors.background}
              />
            ) : null}
          </PressableScale>
        );
      })}
      {allowClear ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quranNotes.highlightClear")}
          onPress={() => onChange(null)}
          style={[styles.clear, { borderColor: tokens.hairline, backgroundColor: colors.muted }]}
          testID="annotation-swatch-clear"
        >
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranNotes.highlightClear")}
          </ThemedText>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.two,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  clear: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});
