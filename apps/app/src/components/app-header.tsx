import type { ReactNode, RefObject } from "react";
import { useTranslation } from "react-i18next";
import {
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
  type ViewInstance,
} from "react-native";
import { GlassSurface } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { BorderWidth, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { isTV } from "@/lib/platform/is-tv";
import { horizontalSafeAreaInsets, useChevronBack, useIsRTL } from "@/lib/rtl";
import { ThemedText } from "./themed-text";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onBack?: () => void;
  /**
   * Trailing actions (save / share / text size), rendered after the title and
   * before the bell. Pass at most two `IconButton`s.
   */
  trailing?: ReactNode;
  /** Android: scroll content captured beneath this floating header. */
  blurTargetRef?: RefObject<ViewInstance | null>;
  /** Reports the rendered header height so the layout can inset content beneath it. */
  onLayout?: (event: LayoutChangeEvent) => void;
  /**
   * Wide screens: cap + center the header row so the title lines up with the
   * ScreenLayout content column instead of hugging the window edge.
   */
  contentMaxWidth?: number;
};

export function AppHeader({
  title,
  subtitle,
  eyebrow,
  notificationCount = 0,
  onNotificationsPress,
  onBack,
  trailing,
  blurTargetRef,
  onLayout,
  contentMaxWidth,
}: AppHeaderProps) {
  const insets = useAppSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const rtl = useIsRTL();
  const backIcon = useChevronBack();
  const tv = isTV();
  // TV: the remote's Back / Menu key is the only back affordance (Android TV
  // navigation guidance: no on-screen back button). A focusable chevron at the
  // top also steals D-pad Up from the first content row.
  const showBack = Boolean(onBack) && !tv;
  // ScreenLayout floats this header absolutely across its full width, so it does not
  // inherit the screen's side safe-area padding — inset the content here so it clears
  // iOS 27's vertical system rail (iPhone Duo) and landscape notches. Background stays
  // full-bleed. Physical → logical so RTL titles / back button land on the inset side.
  const safeX = horizontalSafeAreaInsets(insets);

  const withNavigationBlur = (handler?: () => void) => () => {
    if (Platform.OS === "web") blurActiveElement();
    handler?.();
  };

  return (
    <GlassSurface
      blurTargetRef={blurTargetRef}
      intensity={Platform.OS === "android" ? 50 : 40}
      onLayout={onLayout}
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.two,
          borderBottomColor: tokens.hairline,
        },
        !tv && {
          paddingStart: Spacing.four + safeX.start,
          paddingEnd: Spacing.four + safeX.end,
        },
        // Overscan-safe title on TV, aligned with ScreenLayout's content inset.
        tv && {
          paddingTop: TvLayout.overscanY,
          paddingHorizontal: TvLayout.contentPaddingX,
        },
      ]}
    >
      <View style={[styles.row, contentMaxWidth != null ? { maxWidth: contentMaxWidth } : null]}>
        {showBack ? (
          <IconButton
            key={rtl ? "back-rtl" : "back-ltr"}
            name={backIcon}
            size={19}
            tintColor={colors.accent}
            accessibilityLabel={t("common.goBack")}
            onPress={withNavigationBlur(onBack)}
            background={tokens.accentSoft}
            // No nested GlassView: this bar is already GlassSurface, and an
            // interactive well would FluidSpring-animate on the same turn as the
            // native stack pop (iOS AppHang).
            hitTarget={44}
          />
        ) : null}

        <View style={styles.textBlock}>
          {eyebrow ? (
            <ThemedText type="label" style={{ color: colors.accentText }}>
              {eyebrow}
            </ThemedText>
          ) : null}
          <ThemedText type="header" heading={1} numberOfLines={2}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText type="small" themeColor="mutedForeground" numberOfLines={2}>
              {subtitle}
            </ThemedText>
          ) : null}
        </View>

        {trailing}

        {onNotificationsPress ? (
          <IconButton
            name={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
            size={19}
            tintColor={colors.accent}
            background={tokens.accentSoft}
            accessibilityLabel={t("common.notifications")}
            badge={notificationCount}
            onPress={withNavigationBlur(onNotificationsPress)}
          />
        ) : null}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: BorderWidth.hairline,
  },
  /** Header content row — capped to the ScreenLayout column on wide screens. */
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.half,
    alignSelf: "stretch",
  },
});
