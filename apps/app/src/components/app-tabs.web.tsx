import {
  TabList,
  type TabListProps,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type Ref, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View, type ViewInstance } from "react-native";
import {
  BorderWidth,
  MaxContentWidth,
  Opacity,
  Radius,
  Shadows,
  Spacing,
  withAlpha,
} from "@/constants/theme";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { SIDE_RAIL_BREAKPOINT } from "@/hooks/use-web-tab-layout";
import { blurActiveElement } from "@/lib/blur-active-element";
import { ThemedText } from "./themed-text";
import { GlassSurface } from "./ui/glass-surface";
import {
  WEB_TAB_BAR_MIN_PADDING_BOTTOM,
  WEB_TAB_BAR_PADDING_TOP,
  WEB_TAB_ICON_SIZE,
  WEB_TAB_MIN_HEIGHT,
} from "./web/web-tab-bar-metrics";

type TabConfig = {
  name: string;
  href: "/" | "/tracker" | "/library" | "/settings";
  labelKey: string;
  icon: SymbolViewProps["name"];
};

const tabs: TabConfig[] = [
  {
    // Trigger names match the (tabs) route files, like the native and wide navigators.
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

export default function AppTabs() {
  const { width } = useWindowDimensions();
  const { colors } = useThemeTokens();
  const { t } = useTranslation();
  const isWide = width >= SIDE_RAIL_BREAKPOINT;

  // `TabTrigger asChild` hands each button the resolved `href` (so it renders
  // as a real `<a href>`) and an `onPress` that lets modifier / middle clicks
  // fall through to the browser — the same contract as expo-router `Link`.
  const triggers = tabs.map((tab) => (
    <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
      <TabButton icon={tab.icon} label={t(tab.labelKey)} />
    </TabTrigger>
  ));

  // Wide viewports (tablet / desktop web): the visible navigation is the global
  // WebGlobalRail beside the root stack (so it persists on non-tab pages too).
  // TabList/TabSlot stay DIRECT children of Tabs — the TabList is mounted but
  // hidden so expo-router still discovers the tab triggers.
  if (isWide) {
    return (
      <Tabs style={[styles.wideRoot, { backgroundColor: colors.background }]}>
        <TabList style={styles.hiddenTabList}>{triggers}</TabList>
        <TabSlot style={styles.wideSlot} />
      </Tabs>
    );
  }

  // Narrow viewports: the floating bottom navigation bar.
  return (
    <Tabs>
      <TabSlot style={styles.narrowSlot} />
      <TabList asChild>
        <BottomTabBar>{triggers}</BottomTabBar>
      </TabList>
    </Tabs>
  );
}

/**
 * expo-router types the slot ref as `RefAttributes<View>` (a component, not an
 * instance), which React Native 0.88's strict API rejects. The trigger passes a
 * host-view ref at runtime, so it is typed as the instance here.
 */
type TabButtonProps = Omit<TabTriggerSlotProps, "ref"> & {
  ref?: Ref<ViewInstance>;
  label: string;
  icon: TabConfig["icon"];
};

/**
 * One bottom-navigation destination (Material navigation bar): a pill indicator
 * around the icon over a 12px label, ≥ 48px tall. Primary navigation, so it is
 * a link (`aria-current="page"` when active), not an ARIA tab.
 */
export function TabButton({ label, icon, isFocused, onPress, ref, ...props }: TabButtonProps) {
  const { colors, tokens } = useThemeTokens();
  const [hovered, setHovered] = useState(false);
  const selected = Boolean(isFocused);

  const handlePress: TabButtonProps["onPress"] = (event) => {
    blurActiveElement();
    onPress?.(event);
  };

  const indicatorColor = selected ? tokens.accentSoft : hovered ? tokens.hover : "transparent";

  return (
    <Pressable
      {...props}
      ref={ref}
      role="link"
      accessibilityRole="link"
      aria-current={selected ? "page" : undefined}
      onPress={handlePress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
    >
      <View style={[styles.indicator, { backgroundColor: indicatorColor }]}>
        <SymbolView
          name={icon}
          size={WEB_TAB_ICON_SIZE}
          tintColor={selected ? tokens.accentOnSoft : colors.mutedForeground}
        />
      </View>
      <ThemedText
        type="caption"
        weight={selected ? "bold" : "medium"}
        numberOfLines={1}
        // Chrome label in a fixed bar: scale with text size like a button, then stop.
        maxFontSizeMultiplier={1.3}
        style={[styles.label, { color: selected ? colors.accentText : colors.mutedForeground }]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function BottomTabBar(props: TabListProps) {
  const insets = useAppSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <View
      {...props}
      role="navigation"
      accessibilityLabel={t("webShell.primaryNavigation")}
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, WEB_TAB_BAR_MIN_PADDING_BOTTOM),
          borderTopColor: tokens.hairline,
          ...Shadows.lg,
        },
      ]}
    >
      <GlassSurface style={StyleSheet.absoluteFill} intensity={64} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.22 : 0.32),
            pointerEvents: "none",
          },
        ]}
      />
      <View style={styles.tabBarInner}>{props.children}</View>
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
  hiddenTabList: {
    display: "none",
  },
  narrowSlot: {
    flex: 1,
    height: "100%",
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: BorderWidth.hairline,
    alignItems: "center",
    paddingTop: WEB_TAB_BAR_PADDING_TOP,
    paddingHorizontal: Spacing.two,
  },
  tabBarInner: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: MaxContentWidth,
    backgroundColor: "transparent",
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    minHeight: WEB_TAB_MIN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  indicator: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  label: {
    textAlign: "center",
  },
  pressed: {
    opacity: Opacity.pressed,
  },
});
