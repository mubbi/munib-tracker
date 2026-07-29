import { SymbolView } from "expo-symbols";
import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { type LayoutChangeEvent, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassControl, GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { useChevronBack, useIsRTL } from "@/lib/rtl";
import { ThemedText } from "./themed-text";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onBack?: () => void;
  /** Android: scroll content captured beneath this floating header. */
  blurTargetRef?: RefObject<View | null>;
  /** Reports the rendered header height so the layout can inset content beneath it. */
  onLayout?: (event: LayoutChangeEvent) => void;
};

export function AppHeader({
  title,
  subtitle,
  eyebrow,
  notificationCount = 0,
  onNotificationsPress,
  onBack,
  blurTargetRef,
  onLayout,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const rtl = useIsRTL();
  const backIcon = useChevronBack();

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
      ]}
    >
      {onBack ? (
        <IconButton
          key={rtl ? "back-rtl" : "back-ltr"}
          name={backIcon}
          size={19}
          tintColor={colors.accent}
          accessibilityLabel={t("common.goBack")}
          onPress={withNavigationBlur(onBack)}
          background={tokens.accentSoft}
          glass
          hitTarget={44}
        />
      ) : null}

      <View style={styles.textBlock}>
        {eyebrow ? (
          <ThemedText type="label" style={{ color: colors.accentText }}>
            {eyebrow}
          </ThemedText>
        ) : null}
        <ThemedText type="header" heading={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      {onNotificationsPress ? (
        <GlassControl radius={Radius.md}>
          <PressableScale
            accessibilityLabel={t("common.notifications")}
            accessibilityRole="button"
            haptic="light"
            onPress={withNavigationBlur(onNotificationsPress)}
            style={[
              styles.notificationButton,
              !hasLiquidGlass && { backgroundColor: tokens.accentSoft },
            ]}
          >
            <SymbolView
              name={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
              size={19}
              tintColor={colors.accent}
            />
            <NotificationBadge count={notificationCount} />
          </PressableScale>
        </GlassControl>
      ) : null}
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.half,
    alignSelf: "stretch",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
});
