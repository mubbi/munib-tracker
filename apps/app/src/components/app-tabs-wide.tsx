/**
 * Shared wide-window tab chrome (side rail). Used on web always when wide, and
 * on native tablets when window width ≥ {@link SIDE_RAIL_BREAKPOINT}.
 * On TV this is the default chrome (D-pad friendly).
 */
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
import { Platform, Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { SIDE_RAIL_WIDTH } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { isTV } from "@/lib/platform/is-tv";
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

function WideTabButton({
  label,
  icon,
  isFocused,
  onPress,
  ...props
}: TabTriggerSlotProps & { label: string; icon: TabConfig["icon"] }) {
  const { colors, tokens } = useThemeTokens();
  const tint = isFocused ? colors.accent : colors.mutedForeground;
  const tv = isTV();

  const handlePress: TabTriggerSlotProps["onPress"] = (event) => {
    if (Platform.OS === "web") blurActiveElement();
    onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      onPress={handlePress}
      style={({ pressed, focused }) => [
        styles.railButton,
        pressed && styles.pressed,
        tv &&
          Boolean(focused) && {
            borderWidth: TvLayout.focusRingWidth,
            borderColor: colors.accent,
            borderRadius: Radius.md,
          },
      ]}
    >
      <View
        style={[
          styles.railInner,
          tv && styles.railInnerTv,
          isFocused && { backgroundColor: tokens.accentSoft },
        ]}
      >
        <SymbolView name={icon} size={tv ? 26 : 22} tintColor={tint} />
        <ThemedText
          type="small"
          style={{
            color: tint,
            fontWeight: isFocused ? "700" : "500",
            fontSize: tv ? TvLayout.bodyFontSize : 15,
          }}
        >
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

function SideRail(props: TabListProps) {
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const washAlpha = tokens.isDark ? 0.22 : 0.32;
  const railWidth = isTV() ? TvLayout.sideRailWidth : SIDE_RAIL_WIDTH;

  return (
    <TvFocusGuide
      {...props}
      style={[
        styles.railContainer,
        {
          width: railWidth,
          paddingTop: Math.max(insets.top, Spacing.four),
          paddingBottom: Math.max(insets.bottom, Spacing.four),
          borderEndColor: tokens.hairline,
        },
      ]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: "none",
            backgroundColor: withAlpha(colors.background, tokens.isDark ? 0.78 : 0.86),
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
      <View style={styles.railList}>{props.children}</View>
    </TvFocusGuide>
  );
}

/** Side-rail tab shell for wide windows (tablet / desktop / TV). */
export function WideAppTabs() {
  const { colors } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <Tabs style={[styles.wideRoot, { backgroundColor: colors.background }]}>
      <TabList asChild>
        <SideRail>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <WideTabButton icon={tab.icon} label={t(tab.labelKey)} />
            </TabTrigger>
          ))}
        </SideRail>
      </TabList>
      <TabSlot style={styles.wideSlot} />
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
  railContainer: {
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
  railInnerTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
  },
  pressed: {
    opacity: 0.75,
  },
});
