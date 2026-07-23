/**
 * Shared wide-window tab chrome (side rail). Used on web always when wide, and
 * on native tablets when window width ≥ {@link SIDE_RAIL_BREAKPOINT}.
 * On TV this is the default chrome — Leanback-style collapsible rail with
 * strong D-pad focus states.
 */
import { Image } from "expo-image";
import {
  TabList,
  type TabListProps,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { SIDE_RAIL_WIDTH } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { isTV } from "@/lib/platform/is-tv";
import { registerTvRailBackHandler } from "@/lib/tv/tv-rail-back";
import { ThemedText } from "./themed-text";

type TabConfig = {
  name: string;
  href: "/" | "/tracker" | "/library" | "/settings";
  labelKey: string;
  icon: SymbolViewProps["name"];
};

const tabs: TabConfig[] = [
  {
    name: "index",
    href: "/",
    labelKey: "tabs.home",
    icon: { ios: "house.fill", android: "home", web: "home" },
  },
  {
    name: "tracker",
    href: "/tracker",
    labelKey: "tabs.tracker",
    icon: { ios: "list.bullet.clipboard.fill", android: "checklist", web: "checklist" },
  },
  {
    name: "library",
    href: "/library",
    labelKey: "tabs.library",
    icon: { ios: "books.vertical.fill", android: "local_library", web: "local_library" },
  },
  {
    name: "settings",
    href: "/settings",
    labelKey: "tabs.settings",
    icon: { ios: "gearshape.fill", android: "settings", web: "settings" },
  },
];

const RAIL_COLLAPSE_MS = 160;
const RAIL_BLUR_COLLAPSE_MS = 180;

type WideTabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: TabConfig["icon"];
  expanded: boolean;
  onRailFocusChange: (focused: boolean) => void;
  /** When true and this tab is selected, request TV focus after Back-to-rail. */
  preferRailFocus?: boolean;
  /** TV: D-pad right leaves the rail into the main content guide. */
  nextFocusRightTarget?: View | null;
};

function WideTabButton({
  label,
  icon,
  isFocused,
  onPress,
  expanded,
  onRailFocusChange,
  preferRailFocus,
  nextFocusRightTarget,
  ...props
}: WideTabButtonProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const selectedTint = isFocused ? colors.accent : colors.mutedForeground;

  const handlePress: TabTriggerSlotProps["onPress"] = (event) => {
    if (Platform.OS === "web") blurActiveElement();
    onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      onPress={handlePress}
      {...(tv && preferRailFocus && isFocused ? { hasTVPreferredFocus: true } : {})}
      {...(tv && nextFocusRightTarget != null ? { nextFocusRight: nextFocusRightTarget } : {})}
      onFocus={(event) => {
        onRailFocusChange(true);
        props.onFocus?.(event);
      }}
      onBlur={(event) => {
        onRailFocusChange(false);
        props.onBlur?.(event);
      }}
      style={({ pressed, focused }) => {
        const isDpadFocused = Boolean(focused);
        return [
          styles.railButton,
          pressed && !tv && styles.pressed,
          tv &&
            isDpadFocused && {
              borderWidth: TvLayout.focusRingWidth,
              borderColor: colors.accent,
              borderRadius: Radius.lg,
              backgroundColor: withAlpha(colors.accent, tokens.isDark ? 0.2 : 0.14),
            },
        ];
      }}
    >
      <View
        style={[
          styles.railInner,
          tv && styles.railInnerTv,
          !expanded && tv && styles.railInnerCollapsed,
          isFocused && { backgroundColor: tokens.accentSoft },
          isFocused &&
            tv && {
              borderStartWidth: 4,
              borderStartColor: colors.accent,
            },
        ]}
      >
        <View
          style={[
            styles.railIconWell,
            tv && styles.railIconWellTv,
            isFocused && tv && { backgroundColor: withAlpha(colors.accent, 0.22) },
          ]}
        >
          <SymbolView name={icon} size={tv ? 28 : 22} tintColor={selectedTint} />
        </View>
        {expanded || !tv ? (
          <ThemedText
            type="small"
            numberOfLines={1}
            style={{
              color: selectedTint,
              fontWeight: isFocused ? "700" : "600",
              fontSize: tv ? TvLayout.bodyFontSize : 15,
              flexShrink: 1,
            }}
          >
            {label}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

type SideRailProps = TabListProps & {
  expanded: boolean;
};

function SideRail({ expanded, style, children, ...props }: SideRailProps) {
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();
  const washAlpha = tokens.isDark ? 0.28 : 0.36;
  const targetWidth = tv
    ? expanded
      ? TvLayout.sideRailWidthExpanded
      : TvLayout.sideRailWidthCollapsed
    : SIDE_RAIL_WIDTH;
  const widthSv = useSharedValue(targetWidth);

  useEffect(() => {
    widthSv.value = withTiming(targetWidth, { duration: tv ? RAIL_COLLAPSE_MS : 0 });
  }, [targetWidth, tv, widthSv]);

  const animatedWidth = useAnimatedStyle(() => ({
    width: widthSv.value,
  }));

  const brand = tv ? (
    <View
      style={[styles.brandRow, styles.brandRowTv, !expanded && styles.brandRowCollapsed]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={require("@/assets/images/munib-logo.png")}
        style={[styles.brandLogo, styles.brandLogoTv, !expanded && styles.brandLogoTvCollapsed]}
        contentFit="contain"
      />
      {expanded ? (
        <View style={styles.brandCopy}>
          <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.accent }}>
            {t("common.appName")}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {t("tabs.navHint")}
          </ThemedText>
        </View>
      ) : null}
    </View>
  ) : null;

  const wash = (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          pointerEvents: "none",
          backgroundColor: withAlpha(colors.background, tokens.isDark ? 0.88 : 0.92),
          ...(Platform.OS === "web"
            ? ({ backdropFilter: "blur(20px) saturate(160%)" } as ViewStyle)
            : null),
        },
      ]}
    >
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: withAlpha(colors.card, washAlpha) }]}
      />
    </View>
  );

  const list = <View style={[styles.railList, tv && styles.railListTv]}>{children}</View>;

  if (tv) {
    return (
      <Animated.View
        {...props}
        style={[
          styles.railContainer,
          animatedWidth,
          {
            paddingTop: Math.max(insets.top, Spacing.five),
            paddingBottom: Math.max(insets.bottom, Spacing.five),
            borderEndColor: tokens.hairline,
            paddingHorizontal: expanded ? Spacing.three : Spacing.two,
          },
          style,
        ]}
      >
        {wash}
        <TvFocusGuide style={styles.railFocusGuide} autoFocus>
          {brand}
          {list}
        </TvFocusGuide>
      </Animated.View>
    );
  }

  return (
    <View
      {...props}
      style={[
        styles.railContainer,
        {
          width: SIDE_RAIL_WIDTH,
          paddingTop: Math.max(insets.top, Spacing.four),
          paddingBottom: Math.max(insets.bottom, Spacing.four),
          borderEndColor: tokens.hairline,
        },
        style,
      ]}
    >
      {wash}
      {list}
    </View>
  );
}

/** Side-rail tab shell for wide windows (tablet / desktop / TV). */
export function WideAppTabs() {
  const { colors } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();
  const [railExpanded, setRailExpanded] = useState(true);
  const [preferRailFocus, setPreferRailFocus] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentGuideRef = useRef<View>(null);
  const [contentFocusTarget, setContentFocusTarget] = useState<View | null>(null);

  const onRailFocusChange = useCallback(
    (focused: boolean) => {
      if (!tv) return;
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
      if (focused) {
        setPreferRailFocus(false);
        setRailExpanded(true);
        return;
      }
      // Defer collapse so D-pad moves between rail items don't flicker.
      collapseTimerRef.current = setTimeout(() => {
        setRailExpanded(false);
        collapseTimerRef.current = null;
      }, RAIL_BLUR_COLLAPSE_MS);
    },
    [tv],
  );

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  // Expose rail expand to the root TV back ladder (stack → rail → exit).
  useEffect(() => {
    if (!tv) {
      registerTvRailBackHandler(null);
      return;
    }

    registerTvRailBackHandler(() => {
      if (railExpanded) return false;
      setPreferRailFocus(true);
      setRailExpanded(true);
      return true;
    });

    return () => registerTvRailBackHandler(null);
  }, [tv, railExpanded]);

  return (
    <Tabs style={[styles.wideRoot, { backgroundColor: colors.background }]}>
      <TabList asChild>
        <SideRail expanded={!tv || railExpanded}>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <WideTabButton
                icon={tab.icon}
                label={t(tab.labelKey)}
                expanded={!tv || railExpanded}
                onRailFocusChange={onRailFocusChange}
                preferRailFocus={preferRailFocus}
                nextFocusRightTarget={contentFocusTarget}
              />
            </TabTrigger>
          ))}
        </SideRail>
      </TabList>
      <TvFocusGuide
        ref={contentGuideRef}
        style={styles.wideSlot}
        autoFocus
        trapFocusLeft
        onLayout={() => {
          if (tv) setContentFocusTarget(contentGuideRef.current);
        }}
      >
        <TabSlot style={styles.wideSlotFill} />
      </TvFocusGuide>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wideRoot: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
  },
  wideSlot: {
    flex: 1,
    height: "100%",
  },
  wideSlotFill: {
    flex: 1,
    height: "100%",
  },
  railContainer: {
    height: "100%",
    borderEndWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    overflow: "hidden",
  },
  railFocusGuide: {
    flex: 1,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginBottom: Spacing.five,
    paddingHorizontal: Spacing.two,
    minHeight: 52,
  },
  brandRowTv: {
    minHeight: 72,
    marginBottom: Spacing.five,
  },
  brandRowCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
  },
  brandLogoTv: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
  },
  brandLogoTvCollapsed: {
    width: 64,
    height: 64,
  },
  brandCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  railList: {
    flexDirection: "column",
    gap: Spacing.one,
  },
  railListTv: {
    gap: Spacing.two,
  },
  railButton: {
    width: "100%",
  },
  railInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  railInnerTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    gap: Spacing.three,
  },
  railInnerCollapsed: {
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
  railIconWell: {
    alignItems: "center",
    justifyContent: "center",
  },
  railIconWellTv: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
