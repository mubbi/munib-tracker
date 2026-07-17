import {
  TabList,
  type TabListProps,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useWindowDimensions, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaxContentWidth, Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { SIDE_RAIL_BREAKPOINT, SIDE_RAIL_WIDTH } from "@/hooks/use-web-tab-layout";
import { blurActiveElement } from "@/lib/blur-active-element";
import { ThemedText } from "./themed-text";
import { GlassSurface } from "./ui/glass-surface";

type TabConfig = {
  name: string;
  href: "/" | "/tracker" | "/library" | "/settings";
  labelKey: string;
  icon: SymbolViewProps["name"];
};

const tabs: TabConfig[] = [
  {
    name: "home",
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

  const triggers = (variant: TabVariant) =>
    tabs.map((tab) => (
      <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
        <TabButton icon={tab.icon} label={t(tab.labelKey)} variant={variant} />
      </TabTrigger>
    ));

  // Wide viewports (tablet / desktop web): rail beside the content column.
  // TabList/TabSlot stay DIRECT children of Tabs — required for expo-router
  // to discover the triggers.
  if (isWide) {
    return (
      <Tabs style={[styles.wideRoot, { backgroundColor: colors.background }]}>
        <TabList asChild>
          <SideRail>{triggers("rail")}</SideRail>
        </TabList>
        <TabSlot style={styles.wideSlot} />
      </Tabs>
    );
  }

  // Narrow viewports: keep the floating bottom tab bar.
  return (
    <Tabs>
      <TabSlot style={styles.narrowSlot} />
      <TabList asChild>
        <BottomTabBar>{triggers("bar")}</BottomTabBar>
      </TabList>
    </Tabs>
  );
}

type TabVariant = "bar" | "rail";

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: TabConfig["icon"];
  variant?: TabVariant;
};

export function TabButton({
  label,
  icon,
  isFocused,
  variant = "bar",
  onPress,
  ...props
}: TabButtonProps) {
  const { colors, tokens } = useThemeTokens();
  const tint = isFocused ? colors.accent : colors.mutedForeground;
  const isRail = variant === "rail";

  const handlePress: TabButtonProps["onPress"] = (event) => {
    blurActiveElement();
    onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      onPress={handlePress}
      style={({ pressed }) => [
        isRail ? styles.railButton : styles.tabButton,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          isRail ? styles.railInner : styles.tabInner,
          isFocused && { backgroundColor: tokens.accentSoft },
        ]}
      >
        <SymbolView name={icon} size={isRail ? 22 : 20} tintColor={tint} />
        <ThemedText
          type="small"
          style={{
            color: tint,
            fontWeight: isFocused ? "700" : "500",
            fontSize: isRail ? 15 : 12,
          }}
        >
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

/**
 * Frosted chrome for the side rail. The bottom tab bar floats over scrollable
 * content so `BlurView` can backdrop-blur it; the rail sits beside the column
 * with nothing behind it, and `expo-blur`'s system-chrome tint reads as flat
 * gray. Use a themed translucent wash + CSS blur instead.
 */
function SideRailChrome() {
  const { colors, tokens } = useThemeTokens();
  const washAlpha = tokens.isDark ? 0.22 : 0.32;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          pointerEvents: "none",
          backgroundColor: withAlpha(colors.background, tokens.isDark ? 0.78 : 0.86),
          // RN Web maps this to backdrop-filter for a subtle frosted edge.
          backdropFilter: "blur(20px) saturate(160%)",
        } as ViewStyle,
      ]}
    >
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: withAlpha(colors.card, washAlpha) }]}
      />
    </View>
  );
}

/**
 * Persistent left navigation rail shown on wide web / tablet. Receives the same
 * `TabTrigger` children as the bottom bar (via `TabList asChild`), so routing
 * behaviour is identical — only the presentation differs.
 */
export function SideRail(props: TabListProps) {
  const insets = useSafeAreaInsets();
  const { tokens } = useThemeTokens();

  return (
    <View
      {...props}
      // A11y: this is the primary site navigation landmark on web.
      role="navigation"
      style={[
        styles.railContainer,
        {
          paddingTop: Math.max(insets.top, Spacing.four),
          paddingBottom: Math.max(insets.bottom, Spacing.four),
          borderEndColor: tokens.hairline,
        },
      ]}
    >
      <SideRailChrome />
      <View style={styles.railList}>{props.children}</View>
    </View>
  );
}

export function BottomTabBar(props: TabListProps) {
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();

  return (
    <View
      {...props}
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, Spacing.two),
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
  narrowSlot: {
    flex: 1,
    height: "100%",
  },
  railContainer: {
    width: SIDE_RAIL_WIDTH,
    height: "100%",
    borderEndWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    overflow: "hidden",
  },
  railList: {
    flexDirection: "column",
    gap: Spacing.one,
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
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  tabBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: MaxContentWidth,
    backgroundColor: "transparent",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one + 2,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  pressed: {
    opacity: 0.75,
  },
});
