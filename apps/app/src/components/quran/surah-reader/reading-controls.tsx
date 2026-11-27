import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { PrefToggle as SharedPrefToggle } from "@/components/content/pref-toggle";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { readerControlStyles } from "./reader-control-styles";

/** Icon glyphs for each reading-control row (SF Symbols → Material fallbacks). */
export const CONTROL_ICONS = {
  layout: { ios: "book.pages", android: "menu_book", web: "menu_book" },
  reciter: { ios: "person.wave.2.fill", android: "record_voice_over", web: "record_voice_over" },
  translation: { ios: "translate", android: "translate", web: "translate" },
  secondTranslation: { ios: "globe", android: "language", web: "language" },
  tafsir: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
  showTransliteration: { ios: "textformat.abc", android: "abc", web: "abc" },
  showTranslation: { ios: "text.alignleft", android: "notes", web: "notes" },
  wordByWord: { ios: "text.word.spacing", android: "space_bar", web: "space_bar" },
  tajweed: { ios: "paintpalette.fill", android: "palette", web: "palette" },
  playback: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
  textSize: { ios: "textformat.size", android: "format_size", web: "format_size" },
} as const satisfies Record<string, SymbolViewProps["name"]>;

export { ControlLabel } from "@/components/content/pref-toggle";

/** The shared reading-preference row with the Qur'an reader's spacing between toggles. */
export function PrefToggle(props: Omit<ComponentProps<typeof SharedPrefToggle>, "style">) {
  return <SharedPrefToggle {...props} style={styles.toggleSpacing} />;
}

export function PlaySurahButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={t("quran.playSurah")}
      onPress={onPress}
      style={[
        readerControlStyles.playSurah,
        tv && styles.playSurahTv,
        { backgroundColor: colors.accent },
      ]}
    >
      <SymbolView name={PLAY_CIRCLE_ICON} size={tv ? 24 : 20} tintColor={colors.accentForeground} />
      <ThemedText
        type="smallBold"
        style={{
          color: colors.accentForeground,
          fontSize: tv ? TvLayout.bodyFontSize : undefined,
        }}
      >
        {t("quran.playSurah")}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  toggleSpacing: { marginTop: Spacing.three },
  playSurahTv: {
    minHeight: TvLayout.minFocusTarget,
    gap: Spacing.three,
  },
});
