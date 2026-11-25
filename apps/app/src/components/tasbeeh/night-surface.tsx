import { NavigationBar } from "expo-navigation-bar";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityProps,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { useScreenChrome } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { goBackOrReplace } from "@/lib/navigation";
import { NIGHT_PALETTE } from "@/lib/tasbeeh/materials";
import { DarkThemeScope } from "@/providers/theme-provider";

/** Widest numeral stage, so desktop web doesn't get billboard digits. */
const MAX_STAGE = 560;

/**
 * Focus / Night (NF-3.19): the counter takes the whole screen — true black for
 * OLED, light status / navigation bar content, one Arabic line and the target
 * chip above the numerals, full-contrast controls in one strip at the bottom,
 * and everything else is the tap target. Built on `Sheet variant="fullscreen"`
 * so it shares the modal a11y, Escape / Back and z-order of every other
 * overlay. Rendered by the counter shell over its route (all tasbeeh routes,
 * no per-screen code); closing goes back like the screen's own back control.
 * Children (confirm dialogs, sheets) render inside it so they present above
 * it and inherit the dark palette.
 */
export function NightSurface({
  face,
  onTap,
  stageA11y,
  footer,
  arabic,
  targetLabel,
  children,
}: {
  /** The numerals (the Focus / Night face), sized by `stageSize`. */
  face: (stageSize: number) => ReactNode;
  onTap: () => void;
  /** The same accessible counter the regular stage exposes (role, value, increment). */
  stageA11y: AccessibilityProps;
  /** Status, hands-free panel and the control bar. */
  footer: ReactNode;
  /** The zikr's Arabic, shown as one truncated line above the numerals. */
  arabic?: string | null;
  /** "of 33" — the target chip beside the Arabic line. */
  targetLabel?: string | null;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const chrome = useScreenChrome();
  const { width } = useWindowDimensions();
  const arabicFont = useArabicFontFamily();
  const goBack = chrome?.onBack ?? (() => goBackOrReplace(router, "/"));
  const stageSize = Math.min(width - Spacing.four * 2, MAX_STAGE);
  const arabicLine = arabic?.replace(/\s+/g, " ").trim();

  return (
    <DarkThemeScope>
      {Platform.OS === "web" ? null : <StatusBar style="light" />}
      {Platform.OS === "android" ? <NavigationBar style="dark" /> : null}
      <Sheet
        visible
        variant="fullscreen"
        onClose={goBack}
        accessibilityLabel={chrome?.title ?? t("tasbeehUi.counterLabel")}
        showCloseButton
        contentStyle={{ backgroundColor: NIGHT_PALETTE.background }}
      >
        <View testID="tasbeeh-night-surface" style={styles.root}>
          {arabicLine || targetLabel ? (
            <View style={styles.strip}>
              {arabicLine ? (
                <ThemedText
                  numberOfLines={1}
                  style={[styles.arabic, { color: NIGHT_PALETTE.numeral, fontFamily: arabicFont }]}
                >
                  {arabicLine}
                </ThemedText>
              ) : null}
              {targetLabel ? (
                <View style={styles.chip}>
                  <ThemedText type="smallBold" style={{ color: NIGHT_PALETTE.numeral }}>
                    {targetLabel}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Everything between the strip and the controls counts a tap. */}
          <PressableScale
            haptic={false}
            scaleTo={0.99}
            onPress={onTap}
            {...stageA11y}
            style={styles.stage}
          >
            {face(stageSize)}
          </PressableScale>

          <View style={styles.footer}>{footer}</View>
        </View>
        {children}
      </Sheet>
    </DarkThemeScope>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  strip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  arabic: {
    flex: 1,
    fontSize: 20,
    textAlign: "center",
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: NIGHT_PALETTE.caption,
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  footer: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignSelf: "center",
    width: "100%",
    maxWidth: MAX_STAGE,
  },
});
