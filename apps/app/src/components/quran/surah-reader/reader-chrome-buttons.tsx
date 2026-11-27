import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * List–detail side pane header: "Back to top" (once the reader has scrolled)
 * and the reading fullscreen toggle (where the platform supports it).
 */
export function ReaderChromeButtons({
  showBackToTop,
  onBackToTop,
  fullscreen,
}: {
  showBackToTop: boolean;
  onBackToTop: () => void;
  /** From `useReadingFullscreen()` — owned by the screen so exit-on-blur always runs. */
  fullscreen: { supported: boolean; active: boolean; toggle: () => unknown };
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const fullscreenLabel = fullscreen.active
    ? t("quran.exitFullscreen")
    : t("quran.enterFullscreen");
  return (
    <View style={styles.row}>
      {showBackToTop ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quran.backToTop")}
          onPress={onBackToTop}
          scaleTo={0.97}
          style={[styles.button, { backgroundColor: tokens.accentSoft }]}
        >
          <SymbolView
            name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
            size={16}
            tintColor={colors.accent}
          />
          <ThemedText weight="semibold" type="caption" style={{ color: colors.accentText }}>
            {t("quran.backToTop")}
          </ThemedText>
        </PressableScale>
      ) : null}
      {fullscreen.supported ? (
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={fullscreenLabel}
          accessibilityState={{ selected: fullscreen.active }}
          onPress={() => void fullscreen.toggle()}
          scaleTo={0.97}
          style={[
            styles.button,
            {
              backgroundColor: fullscreen.active ? tokens.accentSoft : colors.muted,
              borderColor: fullscreen.active ? colors.accent : "transparent",
              borderWidth: BorderWidth.thin,
            },
          ]}
        >
          <SymbolView
            name={
              fullscreen.active
                ? {
                    ios: "arrow.down.right.and.arrow.up.left",
                    android: "fullscreen_exit",
                    web: "fullscreen_exit",
                  }
                : {
                    ios: "arrow.up.left.and.arrow.down.right",
                    android: "fullscreen",
                    web: "fullscreen",
                  }
            }
            size={16}
            tintColor={fullscreen.active ? colors.accent : colors.mutedForeground}
          />
          <ThemedText
            weight="semibold"
            type="caption"
            style={{
              color: fullscreen.active ? colors.accentText : colors.mutedForeground,
            }}
          >
            {fullscreenLabel}
          </ThemedText>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingStart: Spacing.four,
  },
  button: {
    flex: 1,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.oneHalf,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
