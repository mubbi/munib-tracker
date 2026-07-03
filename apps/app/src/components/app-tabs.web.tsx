import {
  TabList,
  type TabListProps,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaxContentWidth, Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ThemedText } from "./themed-text";

type TabConfig = {
  name: string;
  href: "/" | "/tracker" | "/settings";
  label: string;
  icon: SymbolViewProps["name"];
};

const tabs: TabConfig[] = [
  {
    name: "home",
    href: "/",
    label: "Home",
    icon: { ios: "house.fill", android: "home", web: "home" },
  },
  {
    name: "tracker",
    href: "/tracker",
    label: "Tracker",
    icon: { ios: "list.bullet.clipboard.fill", android: "checklist", web: "checklist" },
  },
  {
    name: "settings",
    href: "/settings",
    label: "Settings",
    icon: { ios: "gearshape.fill", android: "settings", web: "settings" },
  },
];

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1, height: "100%" }} />
      <TabList asChild>
        <BottomTabBar>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton icon={tab.icon} label={tab.label} />
            </TabTrigger>
          ))}
        </BottomTabBar>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: TabConfig["icon"];
};

export function TabButton({ label, icon, isFocused, ...props }: TabButtonProps) {
  const { colors, tokens } = useThemeTokens();
  const tint = isFocused ? colors.accent : colors.mutedForeground;

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
    >
      <View style={[styles.tabInner, isFocused && { backgroundColor: tokens.accentSoft }]}>
        <SymbolView name={icon} size={20} tintColor={tint} />
        <ThemedText
          type="small"
          style={{
            color: tint,
            fontWeight: isFocused ? "700" : "500",
            fontSize: 12,
          }}
        >
          {label}
        </ThemedText>
      </View>
    </Pressable>
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
          backgroundColor: colors.card,
          borderTopColor: tokens.hairline,
          ...Shadows.lg,
        },
      ]}
    >
      <View style={styles.tabBarInner}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
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
