/**
 * Desktop / tablet-web persistent navigation rail.
 *
 * Rendered beside the ROOT stack (not inside `(tabs)`), so every page — Qur'an
 * reader, Learn modules, settings sub-pages — keeps primary navigation on wide
 * web instead of falling back to a back-button-only header. The active item is
 * derived from the URL via {@link resolveNavSection}.
 *
 * Every destination is a `Pressable` with an `href`, which RN Web renders as a
 * real `<a href>`: middle-click / Ctrl-click open a new tab and crawlers see
 * the internal links, while a plain click navigates in-app
 * (`inAppLinkPress` — see there for why this is not `<Link asChild>`). A
 * visually hidden "Skip to content" link precedes the rail as the page's first
 * tab stop.
 *
 * Two densities (Material navigation rail / drawer pattern):
 * - compact (768–1279px): pill indicator around the icon over a 12px label (88px)
 * - expanded (≥1280px): logo + wordmark row, then icon/label rows (248px)
 */
import { Image } from "expo-image";
import { type Href, usePathname, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Divider } from "@/components/ui/divider";
import {
  BorderWidth,
  Control,
  IconSize,
  Opacity,
  Radius,
  Spacing,
  withAlpha,
} from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { type NavSection, resolveNavSection } from "@/lib/web/nav-section";
import { WEB_RAIL_EXPANDED_BREAKPOINT, webRailWidthFor } from "@/lib/web/web-rail";
import { SkipToContentLink } from "./skip-to-content-link";
import { inAppLinkPress } from "./web-link-press";

/** Brand mark sizes — a compact logo, not a hero (`platform-ux-guidelines.md` → Rail: 32–40px). */
export const RAIL_LOGO_SIZE_EXPANDED = 36;
export const RAIL_LOGO_SIZE_COMPACT = 40;

/** A route string — rendered verbatim as the anchor's `href`. */
type RailHref = Extract<Href, string>;

type RailItem = {
  section: NavSection;
  href: RailHref;
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

/**
 * In-app anchor props for a rail destination. `router.navigate` returns to an
 * existing route in the stack (e.g. the tabs screen) instead of stacking
 * duplicates on every click.
 */
function useRailAnchor(href: RailHref) {
  const router = useRouter();
  return {
    // RN Web renders a Pressable with `href` as `<a href>` (not in RN's types).
    anchorProps: { href } as object,
    onPress: inAppLinkPress(() => {
      blurActiveElement();
      router.navigate(href);
    }),
  };
}

function RailLink({
  item,
  active,
  expanded,
}: {
  item: RailItem;
  active: boolean;
  expanded: boolean;
}) {
  const { anchorProps, onPress } = useRailAnchor(item.href);
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const label = t(item.labelKey);
  const wash = active ? tokens.accentSoft : hovered ? tokens.hover : "transparent";
  // Expanded rows tint the whole row, so text sits on `accentSoft` → `accentOnSoft`.
  // Compact rows tint only the icon pill; the label sits on the rail → `accentText`.
  const iconTint = active ? tokens.accentOnSoft : colors.mutedForeground;
  const activeLabel = expanded ? tokens.accentOnSoft : colors.accentText;
  const labelColor = active ? activeLabel : colors.mutedForeground;

  return (
    <Pressable
      {...anchorProps}
      role="link"
      accessibilityRole="link"
      accessibilityLabel={label}
      aria-current={active ? "page" : undefined}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        expanded ? styles.rowExpanded : styles.rowCompact,
        expanded ? { backgroundColor: wash } : null,
        pressed && styles.pressed,
      ]}
    >
      <View style={expanded ? null : [styles.indicator, { backgroundColor: wash }]}>
        <SymbolView name={item.icon} size={IconSize.xl} tintColor={iconTint} />
      </View>
      <ThemedText
        type={expanded ? "button" : "caption"}
        weight={active ? "bold" : expanded ? "medium" : "semibold"}
        numberOfLines={1}
        maxFontSizeMultiplier={1.3}
        style={[expanded ? styles.labelExpanded : styles.labelCompact, { color: labelColor }]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function WebGlobalRail({ windowWidth }: { windowWidth: number }) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const pathname = usePathname();
  const active = resolveNavSection(pathname);
  const expanded = windowWidth >= WEB_RAIL_EXPANDED_BREAKPOINT;
  const width = webRailWidthFor(windowWidth);
  const appName = t("common.appName");
  const home = useRailAnchor("/");

  const renderItems = (items: RailItem[]) =>
    items.map((item) => (
      <RailLink
        key={item.section}
        item={item}
        active={active === item.section}
        expanded={expanded}
      />
    ));

  return (
    <>
      <SkipToContentLink />
      <View
        role="navigation"
        accessibilityLabel={t("webShell.primaryNavigation")}
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
          {...home.anchorProps}
          role="link"
          accessibilityRole="link"
          accessibilityLabel={appName}
          onPress={home.onPress}
          style={({ pressed }) => [
            expanded ? styles.brandExpanded : styles.brandCompact,
            pressed && styles.pressed,
          ]}
        >
          <Image
            testID="rail-logo"
            source={require("@/assets/images/munib-logo.png")}
            style={expanded ? styles.logoExpanded : styles.logoCompact}
            contentFit="contain"
            accessible={false}
          />
          {expanded ? (
            <ThemedText
              type="subtitle"
              numberOfLines={1}
              style={[styles.brandTitle, { color: colors.accentText }]}
            >
              {appName}
            </ThemedText>
          ) : null}
        </Pressable>

        <View style={styles.group}>{renderItems(PRIMARY)}</View>
        <Divider style={styles.divider} />
        <View style={styles.group}>{renderItems(SECONDARY)}</View>
        <View style={styles.spacer} />
        <View style={styles.group}>{renderItems([SETTINGS])}</View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rail: {
    height: "100%",
    borderEndWidth: BorderWidth.hairline,
    paddingVertical: Spacing.four,
    // Sticky column beside the scrolling stack content.
    flexShrink: 0,
  } as ViewStyle,
  // Expanded rail (248px): small logo + wordmark in one row.
  brandExpanded: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.twoHalf,
    minHeight: Control.md,
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.four,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  brandCompact: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: Control.md,
    marginBottom: Spacing.four,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  logoExpanded: {
    width: RAIL_LOGO_SIZE_EXPANDED,
    height: RAIL_LOGO_SIZE_EXPANDED,
    borderRadius: Radius.sm,
  },
  logoCompact: {
    width: RAIL_LOGO_SIZE_COMPACT,
    height: RAIL_LOGO_SIZE_COMPACT,
    borderRadius: Radius.sm,
  },
  brandTitle: {
    flexShrink: 1,
  },
  group: {
    gap: Spacing.one,
  },
  divider: {
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
    minHeight: Control.md,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  // Compact (Material rail): pill around the icon, label underneath.
  rowCompact: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    minHeight: Control.minTouch,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  indicator: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  labelExpanded: {
    flexShrink: 1,
  },
  labelCompact: {
    textAlign: "center",
  },
  pressed: {
    opacity: Opacity.pressed,
  },
});
