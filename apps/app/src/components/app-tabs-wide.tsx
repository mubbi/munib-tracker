/**
 * Wide-window tab chrome for native builds (`app-tabs.web.tsx` owns web).
 *
 * - **TV:** Leanback-style collapsible rail inside `(tabs)` with strong D-pad
 *   focus states (the TV back ladder drives it, see `lib/tv/tv-rail-back.ts`).
 * - **Native tablets** (iPad / Android tablet / foldable, window ≥
 *   `SIDE_RAIL_BREAKPOINT`; D-UX3): the visible rail is {@link TabletRail},
 *   hosted beside the ROOT stack by `AppStack` so it persists on pushed screens
 *   (E-14). Inside `(tabs)` the trigger list stays mounted but hidden so
 *   expo-router still discovers the tab routes — the same split as web.
 */
import { Image } from "expo-image";
import { type Href, usePathname, useRouter } from "expo-router";
import {
  TabList,
  type TabListProps,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ReactNode, type Ref, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  findNodeHandle,
  Pressable,
  StyleSheet,
  View,
  type ViewInstance,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import {
  BorderWidth,
  Control,
  IconSize,
  Radius,
  Spacing,
  withAlpha,
  ZIndex,
} from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  registerTvRailBackHandler,
  setTvOnHomeTab,
  setTvRailExpanded,
} from "@/lib/tv/tv-rail-back";
import { type NavSection, resolveNavSection } from "@/lib/web/nav-section";
import { ThemedText } from "./themed-text";

type TabConfig = {
  name: string;
  /** Rail highlight for any route (`/quran/2` → library) on the tablet rail. */
  section: NavSection;
  href: "/" | "/tracker" | "/library" | "/settings";
  labelKey: string;
  icon: SymbolViewProps["name"];
};

const tabs: TabConfig[] = [
  {
    name: "index",
    section: "home",
    href: "/",
    labelKey: "tabs.home",
    icon: { ios: "house.fill", android: "home", web: "home" },
  },
  {
    name: "tracker",
    section: "tracker",
    href: "/tracker",
    labelKey: "tabs.tracker",
    icon: { ios: "list.bullet.clipboard.fill", android: "checklist", web: "checklist" },
  },
  {
    name: "library",
    section: "library",
    href: "/library",
    labelKey: "tabs.library",
    icon: { ios: "books.vertical.fill", android: "local_library", web: "local_library" },
  },
  {
    name: "settings",
    section: "settings",
    href: "/settings",
    labelKey: "tabs.settings",
    icon: { ios: "gearshape.fill", android: "settings", web: "settings" },
  },
];

/**
 * TV-only rail entry that opens universal search. Android TV's navigation drawer
 * and the tvOS tab bar both keep Search as a top-level destination; on TV the
 * home top-bar search button is otherwise a long D-pad trip away.
 */
const TV_SEARCH_ICON: SymbolViewProps["name"] = {
  ios: "magnifyingglass",
  android: "search",
  web: "search",
};

const RAIL_COLLAPSE_MS = 160;
const RAIL_BLUR_COLLAPSE_MS = 180;

/**
 * TV rail geometry (E-25). Every layout size is authored in Android TV dp and
 * passed through `tvDp()` / tokens so tvOS (2× canvas) matches Android TV
 * physically. `icon` stays raw: the `SymbolView` TV shim applies `TV_DENSITY`
 * itself, so the glyph (28 → 56pt on tvOS) always fits its well (44 → 88pt).
 */
export const TV_RAIL_METRICS = {
  iconWell: Control.md,
  icon: IconSize.hero,
  brandRow: tvDp(72),
  logo: tvDp(56),
  logoCollapsed: tvDp(64),
  selectedBar: tvDp(4),
  widthExpanded: TvLayout.sideRailWidthExpanded,
  widthCollapsed: TvLayout.sideRailWidthCollapsed,
} as const;

/** Native tablet rail geometry (Material 3 navigation rail / drawer items). */
export const TABLET_RAIL_METRICS = {
  icon: IconSize.xl,
  /** Active-indicator pill behind the icon in the compact rail (M3: 56×32). */
  indicatorWidth: 56,
  indicatorHeight: 32,
  /** Compact item (indicator + label) — above the 48dp / 44pt touch floor. */
  compactItemMinHeight: 64,
  /** Labelled row in the expanded rail. */
  rowMinHeight: Control.row,
} as const;

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
  /** Called while this tab is the selected one (TV back ladder bookkeeping). */
  onSelected?: () => void;
  /** Non-tab rail actions (TV Search) render as a plain button. */
  role?: "tab" | "button";
};

/** One TV rail entry (Pressable: owns D-pad focus, preferred focus and `nextFocusRight`). */
function WideTabButton({
  label,
  icon,
  isFocused,
  onPress,
  expanded,
  onRailFocusChange,
  preferRailFocus,
  nextFocusRightTarget,
  onSelected,
  role = "tab",
  ref,
  ...props
}: WideTabButtonProps) {
  const { colors, tokens } = useThemeTokens();
  const iconTint = isFocused ? colors.accent : colors.mutedForeground;
  // Labels are text: the accent fill fails AA as text (A-02), accentText passes.
  const labelTint = isFocused ? colors.accentText : colors.mutedForeground;

  useEffect(() => {
    if (isFocused) onSelected?.();
  }, [isFocused, onSelected]);

  return (
    <Pressable
      {...props}
      ref={ref}
      accessibilityRole={role}
      {...(role === "tab" ? { accessibilityState: { selected: Boolean(isFocused) } } : null)}
      accessibilityLabel={label}
      onPress={onPress}
      {...(preferRailFocus && isFocused ? { hasTVPreferredFocus: true } : {})}
      {...(nextFocusRightTarget != null
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
      style={({ focused }) => {
        const isDpadFocused = Boolean(focused);
        return [
          styles.railButton,
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
          styles.tvRailInner,
          !expanded && styles.tvRailInnerCollapsed,
          isFocused && { backgroundColor: tokens.accentSoft },
          isFocused && {
            borderStartWidth: TV_RAIL_METRICS.selectedBar,
            borderStartColor: colors.accent,
          },
        ]}
      >
        <View
          style={[
            styles.tvRailIconWell,
            isFocused && { backgroundColor: withAlpha(colors.accent, 0.22) },
          ]}
        >
          <SymbolView name={icon} size={TV_RAIL_METRICS.icon} tintColor={iconTint} />
        </View>
        {expanded ? (
          <ThemedText
            type="default"
            weight={isFocused ? "bold" : "semibold"}
            numberOfLines={1}
            style={[styles.tvRailLabel, { color: labelTint }]}
          >
            {label}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Hidden trigger for native tablets: the visible rail is {@link TabletRail}
 * beside the root stack; these only register the tab routes with expo-router.
 */
function HiddenTabTrigger({
  label,
  isFocused: _isFocused,
  ...props
}: Omit<TabTriggerSlotProps, "ref"> & { label: string }) {
  return <Pressable {...props} accessibilityLabel={label} />;
}

type SideRailProps = TabListProps & {
  expanded: boolean;
  /** TV: extra rail entries above the tab triggers (Search). */
  leading?: ReactNode;
};

/** TV rail: Compose-for-TV "modal navigation drawer" over the content pane. */
function TvSideRail({ expanded, leading, style, children, ...props }: SideRailProps) {
  const insets = useAppSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const washAlpha = tokens.isDark ? 0.28 : 0.36;
  const targetWidth = expanded ? TV_RAIL_METRICS.widthExpanded : TV_RAIL_METRICS.widthCollapsed;
  const widthSv = useSharedValue(targetWidth);

  useEffect(() => {
    widthSv.value = withTiming(targetWidth, { duration: RAIL_COLLAPSE_MS });
  }, [targetWidth, widthSv]);

  const animatedWidth = useAnimatedStyle(() => ({
    width: widthSv.value,
  }));

  // The rail always reserves only its collapsed width in layout; the expanded
  // drawer overlays content. Animating the layout width instead reflowed the
  // whole tab pane every frame — visible jank on Fire TV sticks / low-end
  // Android TV.
  return (
    <View {...props} style={[styles.tvRailFootprint, style]}>
      <Animated.View
        style={[
          styles.tvRailContainer,
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
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              pointerEvents: "none",
              backgroundColor: withAlpha(colors.background, tokens.isDark ? 0.88 : 0.92),
            },
          ]}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: withAlpha(colors.card, washAlpha) },
            ]}
          />
        </View>
        <TvFocusGuide style={styles.tvRailFocusGuide} autoFocus>
          <View
            style={[styles.tvBrandRow, !expanded && styles.tvBrandRowCollapsed]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Image
              source={require("@/assets/images/munib-logo.png")}
              style={expanded ? styles.tvBrandLogo : styles.tvBrandLogoCollapsed}
              contentFit="contain"
            />
            {expanded ? (
              <View style={styles.tvBrandCopy}>
                <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.accentText }}>
                  {t("common.appName")}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                  {t("tabs.navHint")}
                </ThemedText>
              </View>
            ) : null}
          </View>
          <View style={styles.tvRailList}>
            {leading}
            {children}
          </View>
        </TvFocusGuide>
      </Animated.View>
    </View>
  );
}

/**
 * Tab shell for wide native windows. TV: Leanback rail + content pane. Native
 * tablets: hidden triggers + content (the rail is {@link TabletRail}).
 */
export function WideAppTabs() {
  const tv = isTV();
  return tv ? <TvAppTabs /> : <TabletAppTabs />;
}

function TabletAppTabs() {
  const { colors } = useThemeTokens();
  const { t } = useTranslation();
  // TabList / TabSlot stay DIRECT children of Tabs — expo-router discovers the
  // triggers from them.
  return (
    <Tabs style={[styles.wideRoot, { backgroundColor: colors.background }]}>
      <TabList style={styles.hiddenTabList}>
        {tabs.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
            <HiddenTabTrigger label={t(tab.labelKey)} />
          </TabTrigger>
        ))}
      </TabList>
      <TabSlot style={styles.wideSlotFill} />
    </Tabs>
  );
}

function TvAppTabs() {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const router = useRouter();
  // TV starts collapsed: initial focus lands in content (Continue card / hero),
  // and the first Back press reveals the rail (Leanback pattern).
  const [railExpanded, setRailExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("index");
  const onHomeTab = activeTab === "index";
  const [preferRailFocus, setPreferRailFocus] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentGuideRef = useRef<ViewInstance>(null);
  const [contentFocusTarget, setContentFocusTarget] = useState<ViewInstance | null>(null);

  const onRailFocusChange = useCallback((focused: boolean) => {
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
  }, []);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  // Publish rail state so the TV back ladder knows when Back should reach the system.
  useEffect(() => {
    setTvRailExpanded(railExpanded);
  }, [railExpanded]);

  useEffect(() => {
    setTvOnHomeTab(onHomeTab);
  }, [onHomeTab]);

  // Unmounted rail (onboarding, sign-in) must not block Back from reaching the system.
  useEffect(() => () => setTvOnHomeTab(true), []);

  // Scrim over content while the drawer is open (opacity only — no layout work).
  const scrim = useSharedValue(0);
  useEffect(() => {
    scrim.value = withTiming(railExpanded ? 1 : 0, { duration: RAIL_COLLAPSE_MS });
  }, [railExpanded, scrim]);
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));

  // Expose rail expand to the root TV back ladder (stack → rail → system Home).
  useEffect(() => {
    registerTvRailBackHandler(() => {
      if (!railExpanded) {
        setPreferRailFocus(true);
        setRailExpanded(true);
        return true;
      }
      // Rail open on Tracker / Library / Settings → Home first, so Home is the
      // last screen before the launcher (Android TV) / the parent (tvOS HIG).
      if (!onHomeTab) {
        router.navigate("/");
        setPreferRailFocus(true);
        return true;
      }
      return false;
    });

    return () => registerTvRailBackHandler(null);
  }, [railExpanded, onHomeTab, router]);

  return (
    <Tabs style={[styles.wideRoot, { backgroundColor: colors.background }]}>
      <TabList asChild>
        <TvSideRail
          expanded={railExpanded}
          leading={
            <WideTabButton
              role="button"
              icon={TV_SEARCH_ICON}
              label={t("common.search")}
              isFocused={false}
              onPress={() => router.push("/search")}
              expanded={railExpanded}
              onRailFocusChange={onRailFocusChange}
              nextFocusRightTarget={contentFocusTarget}
            />
          }
        >
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <WideTabButton
                icon={tab.icon}
                label={t(tab.labelKey)}
                expanded={railExpanded}
                onRailFocusChange={onRailFocusChange}
                preferRailFocus={preferRailFocus}
                nextFocusRightTarget={contentFocusTarget}
                onSelected={() => setActiveTab(tab.name)}
              />
            </TabTrigger>
          ))}
        </TvSideRail>
      </TabList>
      <TvFocusGuide
        ref={contentGuideRef}
        style={styles.wideSlot}
        autoFocus
        // No trapFocusLeft: D-pad toward the rail from the leading content edge
        // opens the nav drawer (Android TV / Fire TV navigation guidance) instead
        // of being a dead end.
        onLayout={() => setContentFocusTarget(contentGuideRef.current)}
      >
        <TabSlot style={styles.wideSlotFill} />
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
      </TvFocusGuide>
    </Tabs>
  );
}

/** One native tablet rail destination. */
function TabletRailItem({
  tab,
  active,
  expanded,
  onNavigate,
}: {
  tab: TabConfig;
  active: boolean;
  expanded: boolean;
  onNavigate: (href: Href) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const label = t(tab.labelKey);
  const iconTint = active ? colors.accent : colors.mutedForeground;
  const labelTint = active ? colors.accentText : colors.mutedForeground;
  // Hover feedback for iPad trackpads / Android mice (pointer devices).
  const highlight = active
    ? tokens.accentSoft
    : hovered
      ? withAlpha(colors.foreground, 0.06)
      : undefined;

  return (
    <PressableScale
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      haptic="selection"
      onPress={() => onNavigate(tab.href)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        expanded ? styles.tabletRow : styles.tabletItemCompact,
        expanded && highlight ? { backgroundColor: highlight } : null,
      ]}
    >
      {expanded ? (
        <SymbolView name={tab.icon} size={TABLET_RAIL_METRICS.icon} tintColor={iconTint} />
      ) : (
        <View style={[styles.tabletIndicator, highlight ? { backgroundColor: highlight } : null]}>
          <SymbolView name={tab.icon} size={TABLET_RAIL_METRICS.icon} tintColor={iconTint} />
        </View>
      )}
      <ThemedText
        type={expanded ? "button" : "caption"}
        weight={active ? "bold" : "medium"}
        numberOfLines={1}
        style={[expanded ? styles.tabletLabel : styles.tabletLabelCompact, { color: labelTint }]}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

export type TabletRailProps = {
  /** Total footprint (rail + start inset) from `useNativeTabletRail`. */
  width: number;
  /** Labels beside icons (≥ list–detail width); compact icon-over-label below. */
  expanded: boolean;
  /** Start-edge safe-area inset the rail pads for (landscape side insets). */
  startInset?: number;
};

/**
 * Native tablet navigation rail (D-UX3), rendered beside the root stack so it
 * stays on every routed screen. The active item follows the route
 * (`/quran/2` → Library); pressing an item pops back to the tabs screen and
 * selects that tab (`dismissTo`), so drilling in never grows a duplicate stack.
 */
export function TabletRail({ width, expanded, startInset = 0 }: TabletRailProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useAppSafeAreaInsets();
  const active = resolveNavSection(pathname);
  const sidePadding = expanded ? Spacing.three : Spacing.two;

  return (
    <View
      testID="tablet-rail"
      accessibilityRole="tablist"
      accessibilityLabel={t("common.appName")}
      style={[
        styles.tabletRail,
        {
          width,
          paddingTop: Math.max(insets.top, Spacing.four),
          paddingBottom: Math.max(insets.bottom, Spacing.four),
          paddingStart: startInset + sidePadding,
          paddingEnd: sidePadding,
          borderEndColor: tokens.hairline,
          backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.35 : 0.55),
        },
      ]}
    >
      <View style={expanded ? styles.tabletList : styles.tabletListCompact}>
        {tabs.map((tab) => (
          <TabletRailItem
            key={tab.name}
            tab={tab}
            active={active === tab.section}
            expanded={expanded}
            onNavigate={(href) => router.dismissTo(href)}
          />
        ))}
      </View>
    </View>
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
  hiddenTabList: {
    display: "none",
  },
  railButton: {
    width: "100%",
  },

  // ── TV rail (every size via tvDp / tokens — E-25) ──────────────────────────
  /** Layout footprint of the TV rail — always the collapsed width. */
  tvRailFootprint: {
    width: TV_RAIL_METRICS.widthCollapsed,
    height: "100%",
    zIndex: ZIndex.header,
    overflow: "visible",
  },
  /** Expanded TV drawer floats over the content pane. */
  tvRailContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    start: 0,
    zIndex: ZIndex.header,
    borderEndWidth: BorderWidth.hairline,
    overflow: "hidden",
  },
  tvRailFocusGuide: {
    flex: 1,
  },
  tvBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TV_RAIL_METRICS.brandRow,
    marginBottom: Spacing.five,
    paddingHorizontal: Spacing.two,
  },
  tvBrandRowCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  tvBrandLogo: {
    width: TV_RAIL_METRICS.logo,
    height: TV_RAIL_METRICS.logo,
    borderRadius: Radius.lg,
  },
  tvBrandLogoCollapsed: {
    width: TV_RAIL_METRICS.logoCollapsed,
    height: TV_RAIL_METRICS.logoCollapsed,
    borderRadius: Radius.lg,
  },
  tvBrandCopy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  tvRailList: {
    flexDirection: "column",
    gap: Spacing.two,
  },
  tvRailInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  tvRailInnerCollapsed: {
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
  tvRailIconWell: {
    width: TV_RAIL_METRICS.iconWell,
    height: TV_RAIL_METRICS.iconWell,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  tvRailLabel: {
    flexShrink: 1,
  },

  // ── Native tablet rail ─────────────────────────────────────────────────────
  tabletRail: {
    height: "100%",
    borderEndWidth: BorderWidth.hairline,
    // Sticky column beside the stack; never shrinks under a wide screen.
    flexShrink: 0,
    zIndex: ZIndex.header,
  } as ViewStyle,
  tabletList: {
    gap: Spacing.one,
  },
  tabletListCompact: {
    gap: Spacing.two,
  },
  tabletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TABLET_RAIL_METRICS.rowMinHeight,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  tabletItemCompact: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    minHeight: TABLET_RAIL_METRICS.compactItemMinHeight,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
  },
  tabletIndicator: {
    width: TABLET_RAIL_METRICS.indicatorWidth,
    height: TABLET_RAIL_METRICS.indicatorHeight,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  tabletLabel: {
    flexShrink: 1,
  },
  tabletLabelCompact: {
    textAlign: "center",
    alignSelf: "stretch",
  },
});
