/**
 * Desktop / tablet-web persistent navigation rail.
 *
 * Rendered beside the ROOT stack (not inside `(tabs)`), so every page — Qur'an
 * reader, Learn modules, settings sub-pages — keeps primary navigation on wide
 * web instead of falling back to a back-button-only header. The active item is
 * derived from the URL via {@link resolveNavSection}.
 *
 * Two densities (Material navigation rail / drawer pattern):
 * - compact (768–1279px): icon over a short label (88px)
 * - expanded (≥1280px): brand + icon/label rows (248px)
 */
import { Image } from "expo-image";
import { type Href, usePathname, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { type NavSection, resolveNavSection } from "@/lib/web/nav-section";
import { WEB_RAIL_EXPANDED_BREAKPOINT, webRailWidthFor } from "@/lib/web/web-rail";

type RailItem = {
  section: NavSection;
  href: Href;
  labelKey: string;
  icon: SymbolViewProps["name"];
};

const PRIMARY: RailItem[] = [
  {
    section: "home",
    href: "/",
    labelKey: "tabs.home",
    icon: { ios: "house.fill", android: "home", web: "home" },
  },
  {
    section: "tracker",
    href: "/tracker",
    labelKey: "tabs.tracker",
    icon: { ios: "list.bullet.clipboard.fill", android: "checklist", web: "checklist" },
  },
  {
    section: "library",
    href: "/library",
    labelKey: "tabs.library",
    icon: { ios: "books.vertical.fill", android: "local_library", web: "local_library" },
  },
];

const SECONDARY: RailItem[] = [
  {
    section: "search",
    href: "/search",
    labelKey: "common.search",
    icon: { ios: "magnifyingglass", android: "search", web: "search" },
  },
  {
    section: "bookmarks",
    href: "/bookmarks",
    labelKey: "bookmarks.title",
    icon: { ios: "bookmark.fill", android: "bookmark", web: "bookmark" },
  },
];

const SETTINGS: RailItem = {
  section: "settings",
  href: "/settings",
  labelKey: "tabs.settings",
  icon: { ios: "gearshape.fill", android: "settings", web: "settings" },
};

function RailButton({
  item,
  active,
  expanded,
  onNavigate,
}: {
  item: RailItem;
  active: boolean;
  expanded: boolean;
  onNavigate: (href: Href) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const label = t(item.labelKey);
  const tint = active ? colors.accent : colors.mutedForeground;

  return (
    <Pressable
      role="link"
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      aria-current={active ? "page" : undefined}
      onPress={() => onNavigate(item.href)}
      style={(state) => {
        const hovered = Boolean((state as { hovered?: boolean }).hovered);
        return [
          expanded ? styles.rowExpanded : styles.rowCompact,
          active && { backgroundColor: tokens.accentSoft },
          !active && hovered && { backgroundColor: withAlpha(colors.foreground, 0.06) },
          state.pressed && styles.pressed,
        ];
      }}
    >
      <SymbolView name={item.icon} size={expanded ? 22 : 24} tintColor={tint} />
      <ThemedText
        type="small"
        numberOfLines={1}
        style={[
          expanded ? styles.labelExpanded : styles.labelCompact,
          { color: tint, fontWeight: active ? "700" : "500" },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function WebGlobalRail({ windowWidth }: { windowWidth: number }) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const active = resolveNavSection(pathname);
  const expanded = windowWidth >= WEB_RAIL_EXPANDED_BREAKPOINT;
  const width = webRailWidthFor(windowWidth);

  const onNavigate = (href: Href) => {
    blurActiveElement();
    // navigate() returns to an existing route in the stack (e.g. the tabs
    // screen) instead of stacking duplicates on every rail click.
    router.navigate(href);
  };

  const renderItems = (items: RailItem[]) =>
    items.map((item) => (
      <RailButton
        key={item.section}
        item={item}
        active={active === item.section}
        expanded={expanded}
        onNavigate={onNavigate}
      />
    ));

  return (
    <View
      role="navigation"
      accessibilityLabel={t("common.appName")}
      style={[
        styles.rail,
        {
          width,
          borderEndColor: tokens.hairline,
          backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.35 : 0.55),
          paddingHorizontal: expanded ? Spacing.three : Spacing.two,
        },
      ]}
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={t("common.appName")}
        onPress={() => onNavigate("/")}
        style={(state) => [
          expanded ? styles.brandExpanded : styles.brandCompact,
          state.pressed && styles.pressed,
        ]}
      >
        <Image
          source={require("@/assets/images/munib-logo.png")}
          style={expanded ? styles.logoExpanded : styles.logoCompact}
          contentFit="contain"
        />
        {expanded ? (
          <ThemedText
            type="smallBold"
            numberOfLines={1}
            style={[styles.brandTitle, { color: colors.accent }]}
          >
            {t("common.appName")}
          </ThemedText>
        ) : null}
      </Pressable>

      <View style={styles.group}>{renderItems(PRIMARY)}</View>
      <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
      <View style={styles.group}>{renderItems(SECONDARY)}</View>
      <View style={styles.spacer} />
      <View style={styles.group}>{renderItems([SETTINGS])}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    height: "100%",
    borderEndWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.four,
    // Sticky column beside the scrolling stack content.
    flexShrink: 0,
  } as ViewStyle,
  // Expanded rail (248px): large logo stacked over the app name.
  brandExpanded: {
    alignItems: "center",
    gap: Spacing.three,
    paddingTop: Spacing.two,
    marginBottom: Spacing.four,
  },
  brandCompact: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
    minHeight: 44,
  },
  logoExpanded: {
    width: 136,
    height: 136,
    borderRadius: Radius.xl,
  },
  logoCompact: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
  },
  brandTitle: {
    fontSize: 19,
    textAlign: "center",
  },
  group: {
    gap: Spacing.one,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.three,
    marginHorizontal: Spacing.two,
  },
  spacer: {
    flex: 1,
  },
  rowExpanded: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowCompact: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    minHeight: 60,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  labelExpanded: {
    fontSize: 15,
    flexShrink: 1,
  },
  labelCompact: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
