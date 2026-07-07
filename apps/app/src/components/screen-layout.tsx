import { useFocusEffect } from "expo-router";
import type { ReactNode, RefObject } from "react";
import { useCallback, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ErrorBoundary } from "@/components/error-boundary";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useTheme } from "@/hooks/use-theme";

/** Breakpoint above which we allow a wider content column (wide web/tablet). */
const WideBreakpoint = 1024;
/** Wider cap used on large viewports so content isn't a narrow single column. */
const WideMaxContentWidth = 1120;

type ScreenLayoutProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onBack?: () => void;
  scrollable?: boolean;
  children: ReactNode;
  contentStyle?: ViewStyle;
  /** Ref to the internal ScrollView (e.g. to auto-scroll to a playing card). */
  scrollRef?: RefObject<ScrollView | null>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export function ScreenLayout({
  title,
  subtitle,
  eyebrow,
  notificationCount,
  onNotificationsPress,
  onBack,
  scrollable = true,
  children,
  contentStyle,
  scrollRef,
  onScroll,
}: ScreenLayoutProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentBottomInset = useContentBottomInset();
  const rootRef = useRef<View>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Content sits beneath the floating glass header. Fall back to an estimated
  // bar height for the first frame (before onLayout measures the real height)
  // so content isn't briefly hidden under the header.
  const headerInset = headerHeight || insets.top + 60;

  // On web, move focus into the incoming screen so it isn't left on a button in
  // the outgoing screen when React Navigation marks that layer aria-hidden.
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "web") return;
      const node = rootRef.current as unknown as { focus?: () => void } | null;
      node?.focus?.();
    }, []),
  );

  // On wide viewports (wide web / large tablets) allow a wider content column
  // so the layout doesn't sit as a narrow single strip in acres of whitespace.
  const maxWidth = width >= WideBreakpoint ? WideMaxContentWidth : MaxContentWidth;

  const content = (
    <View
      // Web-only landmark: exposes the screen body as <main> for crawlers/AT.
      {...(Platform.OS === "web" ? { role: "main" as const } : {})}
      // When the screen owns its own scroller (scrollable={false}), it isn't
      // wrapped in the ScrollView that carries the header inset, so pad it here
      // to clear the floating glass header.
      style={[styles.content, !scrollable && { paddingTop: headerInset }, contentStyle]}
    >
      {/* When the screen owns its own scroller (scrollable={false}, e.g. a screen
          hosting a FlatList), the inner wrapper must fill the available height so
          the child list is bounded and can scroll — otherwise it grows to its full
          content height and nothing scrolls. */}
      <View style={[styles.inner, !scrollable && styles.innerFill, { maxWidth }]}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </View>
    </View>
  );

  return (
    <View
      ref={rootRef}
      // Web-only: programmatically focusable screen landmark (tabIndex -1).
      {...(Platform.OS === "web" ? { tabIndex: -1 as const } : {})}
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      {scrollable ? (
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: headerInset, paddingBottom: contentBottomInset },
          ]}
          // The floating glass header already accounts for the top inset; opting
          // out keeps the OS from adding it again and double-padding the content.
          contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {/* Rendered last so it stacks above scrolling content on Android; content
          scrolls beneath the translucent material for the glass effect. */}
      <View
        style={styles.headerFloat}
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <AppHeader
          title={title}
          subtitle={subtitle}
          eyebrow={eyebrow}
          notificationCount={notificationCount}
          onNotificationsPress={onNotificationsPress}
          onBack={onBack}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerFloat: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
  },
  inner: {
    width: "100%",
    gap: Spacing.four,
  },
  /** Fill the available height when the screen hosts its own scroller (FlatList). */
  innerFill: {
    flex: 1,
  },
});
