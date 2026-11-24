import { NavigationBar } from "expo-navigation-bar";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityProps,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { useScreenChrome } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronBack } from "@/lib/rtl";
import { NIGHT_PALETTE } from "@/lib/tasbeeh/materials";
import { DarkThemeScope } from "@/providers/theme-provider";

/** Widest numeral stage, so desktop web doesn't get billboard digits. */
const MAX_STAGE = 560;
/** Controls stay reachable but recede on the black surface. */
const CONTROLS_OPACITY = 0.62;

/**
 * Focus / Night (NF-3.19): the counter takes the whole screen — true black for
 * OLED, light status / navigation bar content, dim controls in one small strip
 * at the bottom, and everything else is the tap target. No animation. Rendered
 * by the counter shell over its route (all four tasbeeh routes, no per-screen
 * code); the back control is the screen's own (`useScreenChrome`). Children
 * (confirm dialogs, sheets) render inside it so they present above it and
 * inherit the dark palette.
 */
export function NightSurface({
  face,
  onTap,
  stageA11y,
  footer,
  children,
}: {
  /** The numerals (the Focus / Night face), sized by `stageSize`. */
  face: (stageSize: number) => ReactNode;
  onTap: () => void;
  /** The same accessible counter the regular stage exposes (role, value, increment). */
  stageA11y: AccessibilityProps;
  /** Status, hands-free panel and the control bar (dimmed). */
  footer: ReactNode;
  children?: ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const chrome = useScreenChrome();
  const insets = useAppSafeAreaInsets();
  const { width } = useWindowDimensions();
  const backIcon = useChevronBack();
  const goBack = chrome?.onBack ?? (() => goBackOrReplace(router, "/"));
  const stageSize = Math.min(width - Spacing.four * 2, MAX_STAGE);

  return (
    <Modal
      visible
      // Opaque and instant: no animation on this design, and nothing behind shows through.
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      supportedOrientations={["portrait", "landscape"]}
      onRequestClose={goBack}
    >
      <DarkThemeScope>
        {Platform.OS === "web" ? null : <StatusBar style="light" />}
        {Platform.OS === "android" ? <NavigationBar style="dark" /> : null}
        <View
          testID="tasbeeh-night-surface"
          style={[
            styles.root,
            {
              backgroundColor: NIGHT_PALETTE.background,
              paddingTop: insets.top,
              paddingBottom: insets.bottom + Spacing.two,
              paddingStart: insets.left,
              paddingEnd: insets.right,
            },
          ]}
        >
          <View style={[styles.topBar, { opacity: CONTROLS_OPACITY }]}>
            <IconButton
              name={backIcon}
              size={20}
              tintColor={NIGHT_PALETTE.numeral}
              accessibilityLabel={t("common.back")}
              onPress={goBack}
            />
            {chrome?.title ? (
              <ThemedText
                type="caption"
                numberOfLines={1}
                style={[styles.title, { color: NIGHT_PALETTE.caption }]}
              >
                {chrome.title}
              </ThemedText>
            ) : null}
          </View>

          {/* Everything between the top bar and the controls counts a tap. */}
          <Pressable {...stageA11y} onPress={onTap} style={styles.stage}>
            {face(stageSize)}
          </Pressable>

          <View style={[styles.footer, { opacity: CONTROLS_OPACITY }]}>{footer}</View>
        </View>
        {children}
      </DarkThemeScope>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    minHeight: 48,
  },
  title: {
    flex: 1,
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
