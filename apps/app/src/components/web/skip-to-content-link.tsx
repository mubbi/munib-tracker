/**
 * "Skip to content" — the first tab stop on wide web (WCAG 2.4.1 Bypass Blocks).
 *
 * Visually hidden until it receives keyboard focus, then drawn over the rail's
 * top-start corner. Activating it moves focus to the visible `main` landmark
 * (`ScreenLayout` renders `role="main"`) so the next Tab lands in the page
 * instead of walking every rail link.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type GestureResponderEvent, Platform, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderWidth, Radius, Shadows, Spacing, ZIndex } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** In-page target the link advertises (used only for the `href`; focus is moved in JS). */
const MAIN_FRAGMENT = "#main-content";

type FocusableElement = {
  hasAttribute(name: string): boolean;
  setAttribute(name: string, value: string): void;
  focus(options?: { preventScroll?: boolean }): void;
  getClientRects(): { length: number };
};

type QueryableDocument = {
  querySelectorAll(selector: string): ArrayLike<FocusableElement>;
};

/**
 * Focuses the page's visible `main` landmark. Stack screens below the top one
 * stay mounted (hidden), so the last visible match is the current screen.
 * Returns false when no landmark exists.
 */
export function focusMainContent(
  doc: QueryableDocument | undefined = typeof document === "undefined"
    ? undefined
    : (document as unknown as QueryableDocument),
): boolean {
  if (!doc) return false;
  const mains = Array.from(doc.querySelectorAll('main, [role="main"]'));
  const visible = mains.filter((el) => el.getClientRects().length > 0);
  const target = visible.at(-1) ?? mains.at(-1);
  if (!target) return false;
  // Programmatic focus target only: tabindex="-1" keeps it out of the Tab order
  // and the global focus CSS draws no ring on it.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus();
  return true;
}

export function SkipToContentLink() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [focused, setFocused] = useState(false);

  if (Platform.OS !== "web") return null;

  const onPress = (event: GestureResponderEvent) => {
    // Keep the URL clean (no `#main-content` hash for the router to parse).
    event?.preventDefault?.();
    focusMainContent();
  };

  // RN Web renders a Pressable with `href` as a real `<a>`.
  const anchorProps = { href: MAIN_FRAGMENT } as object;

  return (
    <Pressable
      {...anchorProps}
      role="link"
      accessibilityRole="link"
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        styles.base,
        focused
          ? [
              styles.visible,
              Shadows.lg,
              { backgroundColor: colors.card, borderColor: tokens.accentBorder },
            ]
          : styles.hidden,
      ]}
    >
      <ThemedText type="button" style={{ color: colors.accentText }}>
        {t("webShell.skipToContent")}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    top: Spacing.two,
    start: Spacing.two,
    zIndex: ZIndex.overlay,
  },
  // Visually hidden but still focusable and announced.
  hidden: {
    width: 1,
    height: 1,
    overflow: "hidden",
    opacity: 0,
  },
  visible: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: BorderWidth.thin,
  },
});
