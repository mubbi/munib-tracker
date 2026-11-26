import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut, useReducedMotion } from "react-native-reanimated";

import { IconButton } from "@/components/ui/icon-button";
import { SearchField } from "@/components/ui/search-field";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const SEARCH = { ios: "magnifyingglass", android: "search", web: "search" } as const;
const CLOSE = { ios: "xmark", android: "close", web: "close" } as const;

/**
 * Scroll tracking for a list whose chrome lives in its `ListHeaderComponent`:
 * `stuck` turns on once the header has scrolled away (state flips only when
 * the threshold is crossed, so scrolling does not re-render the screen).
 */
export function useStickyListHeader(): {
  stuck: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onHeaderLayout: (event: LayoutChangeEvent) => void;
} {
  const [stuck, setStuck] = useState(false);
  const headerHeight = useRef(0);
  const onHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    headerHeight.current = event.nativeEvent.layout.height;
  }, []);
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const height = headerHeight.current;
    const next = height > 0 && event.nativeEvent.contentOffset.y > height - Spacing.four;
    setStuck((prev) => (prev === next ? prev : next));
  }, []);
  return { stuck, onScroll, onHeaderLayout };
}

type CategoryStickyBarProps = {
  visible: boolean;
  /** Compact chrome on the start side (salah chips, progress ring, Start / Review). */
  children?: ReactNode;
  query: string;
  onChangeQuery: (query: string) => void;
  placeholder: string;
};

/**
 * The compact bar that pins over a category list once its header (session
 * card, search) has scrolled away: the screen's own compact controls plus a
 * search icon that expands into a field in place.
 */
export function CategoryStickyBar({
  visible,
  children,
  query,
  onChangeQuery,
  placeholder,
}: CategoryStickyBarProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);

  // A query typed in the header stays visible (and editable) in the bar.
  useEffect(() => {
    if (visible && query.trim().length > 0) setSearchOpen(true);
  }, [query, visible]);

  // An open search keeps the bar up even when a shorter result list scrolls the
  // header back into view — the field must not unmount (and drop the keyboard) mid-typing.
  if (!visible && !searchOpen) return null;

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(140)}
      exiting={reducedMotion ? undefined : FadeOut.duration(120)}
      style={[
        styles.bar,
        {
          backgroundColor: withAlpha(colors.background, tokens.isDark ? 0.94 : 0.96),
          borderColor: tokens.hairline,
        },
      ]}
    >
      {searchOpen ? (
        <View style={styles.row}>
          <SearchField
            value={query}
            onChangeText={onChangeQuery}
            placeholder={placeholder}
            autoFocus={query.length === 0}
            style={styles.flex}
          />
          <IconButton
            name={CLOSE}
            size={16}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("zikr.closeSearch")}
            onPress={() => {
              onChangeQuery("");
              setSearchOpen(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.row}>
          <View style={[styles.flex, styles.content]}>{children}</View>
          <IconButton
            name={SEARCH}
            size={18}
            tintColor={colors.foreground}
            accessibilityLabel={placeholder}
            onPress={() => setSearchOpen(true)}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    zIndex: 5,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderBottomWidth: BorderWidth.hairline,
    borderBottomStartRadius: Radius.md,
    borderBottomEndRadius: Radius.md,
  },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  content: { flexDirection: "row", alignItems: "center", gap: Spacing.two, minWidth: 0 },
  flex: { flex: 1, minWidth: 0 },
});
