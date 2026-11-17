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
import { type Ref, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  findNodeHandle,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewInstance,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { SIDE_RAIL_WIDTH } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { isTV } from "@/lib/platform/is-tv";
import { registerTvRailBackHandler, setTvRailExpanded } from "@/lib/tv/tv-rail-back";
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

/**
 * expo-router types the slot ref as `RefAttributes<View>` (a component, not an
 * instance), which React Native 0.88's strict API rejects. The trigger passes a
 * host-view ref at runtime, so it is typed as the instance here.
 */
type WideTabButtonProps = Omit<TabTriggerSlotProps, "ref"> & {
  ref?: Ref<ViewInstance>;
  label: string;
  icon: TabConfig["icon"];
  expanded: boolean;
  onRailFocusChange: (focused: boolean) => void;
  /** When true and this tab is selected, request TV focus after Back-to-rail. */
  preferRailFocus?: boolean;
  /** TV: D-pad right leaves the rail into the main content guide. */
  nextFocusRightTarget?: ViewInstance | null;
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
  ref,
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
      ref={ref}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      onPress={handlePress}
      {...(tv && preferRailFocus && isFocused ? { hasTVPreferredFocus: true } : {})}
      {...(tv && nextFocusRightTarget != null
        ? // Typed as a node tag; react-native-tvos resolves instances the same way.
          { nextFocusRight: findNodeHandle(nextFocusRightTarget) ?? undefined }
        : {})}
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
  const insets = useAppSafeAreaInsets();
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
    // Compose-for-TV "modal navigation drawer": the rail always reserves only its
    // collapsed width in layout; the expanded drawer overlays content. Animating
    // the layout width instead reflowed the whole tab pane every frame — visible
    // jank on Fire TV sticks / low-end Android TV.
    return (
      <View {...props} style={[styles.railFootprint, style]}>
        <Animated.View
          style={[
            styles.railContainer,
            styles.railOverlay,
            animatedWidth,
            {
              paddingTop: Math.max(insets.top, TvLayout.overscanY),
              paddingBottom: Math.max(insets.bottom, TvLayout.overscanY),
              borderEndColor: tokens.hairline,
              paddingHorizontal: expanded ? Spacing.three : Spacing.two,
              backgroundColor: colors.background,
            },
          ]}
        >
          {wash}
          <TvFocusGuide style={styles.railFocusGuide} autoFocus>
            {brand}
            {list}
          </TvFocusGuide>
        </Animated.View>
      </View>
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
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();
  // TV starts collapsed: initial focus lands in content (Continue card / hero),
  // and the first Back press reveals the rail (Leanback pattern).
  const [railExpanded, setRailExpanded] = useState(!tv);
  const [preferRailFocus, setPreferRailFocus] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentGuideRef = useRef<ViewInstance>(null);
  const [contentFocusTarget, setContentFocusTarget] = useState<ViewInstance | null>(null);

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

  // Publish rail state so the TV back ladder knows when Back should reach the system.
  useEffect(() => {
    if (tv) setTvRailExpanded(railExpanded);
  }, [tv, railExpanded]);

  // Scrim over content while the drawer is open (opacity only — no layout work).
  const scrim = useSharedValue(0);
  useEffect(() => {
    scrim.value = withTiming(tv && railExpanded ? 1 : 0, { duration: RAIL_COLLAPSE_MS });
  }, [tv, railExpanded, scrim]);
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));

  // Expose rail expand to the root TV back ladder (stack → rail → system Home).
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
        // No trapFocusLeft: D-pad toward the rail from the leading content edge
        // opens the nav drawer (Android TV / Fire TV navigation guidance) instead
        // of being a dead end.
        onLayout={() => {
          if (tv) setContentFocusTarget(contentGuideRef.current);
        }}
      >
        <TabSlot style={styles.wideSlotFill} />
        {tv ? (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                pointerEvents: "none",
                backgroundColor: withAlpha(colors.background, tokens.isDark ? 0.6 : 0.5),
              },
              scrimStyle,
            ]}
          />
        ) : null}
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
  /** Layout footprint of the TV rail — always the collapsed width. */
  railFootprint: {
    width: TvLayout.sideRailWidthCollapsed,
    height: "100%",
    zIndex: 20,
    overflow: "visible",
  },
  /** Expanded TV drawer floats over the content pane. */
  railOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    start: 0,
    zIndex: 20,
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
