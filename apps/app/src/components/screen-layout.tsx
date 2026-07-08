import type { ContentReportKind } from "@munib-tracker/shared/types/content-report";
import { BlurTargetView } from "expo-blur";
import { useFocusEffect, usePathname } from "expo-router";
import type { ReactNode, RefObject } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { ContentReportFooterLink } from "@/components/content-report/content-report-footer-link";
import { ErrorBoundary } from "@/components/error-boundary";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useTheme } from "@/hooks/use-theme";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { LEARN_SECTION_ROUTES } from "@/lib/library-menu";

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
  /**
   * Optional chrome rendered directly beneath the floating header bar (e.g. a
   * scroll-driven reading toolbar). It floats over the content — it is NOT
   * counted in the content inset — so it can appear and disappear on scroll
   * without shifting the layout beneath it.
   */
  headerAccessory?: ReactNode;
  contentStyle?: ViewStyle;
  /** Ref to the internal ScrollView (e.g. to auto-scroll to a playing card). */
  scrollRef?: RefObject<ScrollView | null>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Show a thin scroll-progress line beneath the header for long-form reading
   * screens. Only applies to the built-in scroller (`scrollable`) and only once
   * the content actually overflows the viewport. Defaults to on for routes in
   * the "learn" section (see `LEARN_SECTION_ROUTES`); pass explicitly to force
   * it on/off elsewhere.
   */
  readingProgress?: boolean;
  /**
   * When set, appends a "report an issue" link at the end of the content so
   * readers can flag mistakes in long-form material. The report reference is
   * derived from the current route, `title`, and `subtitle`.
   */
  reportKind?: ContentReportKind;
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
  headerAccessory,
  contentStyle,
  scrollRef,
  onScroll,
  readingProgress,
  reportKind,
}: ScreenLayoutProps) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentBottomInset = useContentBottomInset();
  const rootRef = useRef<View>(null);
  const contentBlurTargetRef = useRef<View>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Reading-progress line: driven by the built-in scroller. A plain ScrollView
  // isn't virtualized, so pixel offset over content size is accurate and stable.
  const progress = useSharedValue(0);
  // Start at Infinity so the pre-scroll reveal below never fires before the
  // ScrollView's onLayout reports a real viewport height — otherwise short,
  // non-scrolling pages would briefly show the progress bar.
  const viewportHeightRef = useRef(Number.POSITIVE_INFINITY);
  const [canScroll, setCanScroll] = useState(false);
  // Default on for learn-section routes; an explicit prop always wins.
  const isLearnRoute = useMemo(
    () =>
      LEARN_SECTION_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`)),
    [pathname],
  );
  const trackProgress = (readingProgress ?? isLearnRoute) && scrollable;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (trackProgress) {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const range = contentSize.height - layoutMeasurement.height;
        progress.value = range > 0 ? Math.min(1, Math.max(0, contentOffset.y / range)) : 0;
        // Scrolling proves the content overflows — the most reliable reveal signal.
        if (range > 24) setCanScroll(true);
      }
      onScroll?.(event);
    },
    [onScroll, progress, trackProgress],
  );

  // Pre-scroll reveal: show the bar as soon as we know the content is taller than
  // the viewport, without waiting for the reader to start scrolling.
  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      if (!trackProgress) return;
      if (height - viewportHeightRef.current > 24) setCanScroll(true);
    },
    [trackProgress],
  );

  // Derive a report reference for the current screen so readers can flag
  // mistakes in the content from a footer link.
  const reportRef = useMemo(() => {
    if (!reportKind) return undefined;
    const locale = i18n.language?.split("-")[0] ?? "en";
    return buildContentReportRef(reportKind, pathname, pathname, locale, {
      snapshot: { title, translation: subtitle },
    });
  }, [i18n.language, pathname, reportKind, subtitle, title]);

  // Content sits beneath the floating glass header. Fall back to an estimated
  // bar height for the first frame (before onLayout measures the real height)
  // so content isn't briefly hidden under the header. Add a small gap below the
  // bar so content isn't cramped directly against it.
  const headerInset = (headerHeight || insets.top + 60) + Spacing.three;

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
        {reportRef && scrollable ? <ContentReportFooterLink contentRef={reportRef} /> : null}
      </View>
    </View>
  );

  const scrollBody = scrollable ? (
    <ScrollView
      ref={scrollRef}
      onScroll={handleScroll}
      onContentSizeChange={onContentSizeChange}
      onLayout={
        trackProgress
          ? (event) => {
              viewportHeightRef.current = event.nativeEvent.layout.height;
            }
          : undefined
      }
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
  );

  const screenBody =
    Platform.OS === "android" ? (
      <BlurTargetView ref={contentBlurTargetRef} style={styles.root}>
        {scrollBody}
      </BlurTargetView>
    ) : (
      scrollBody
    );

  return (
    <View
      ref={rootRef}
      // Web-only: programmatically focusable screen landmark (tabIndex -1).
      {...(Platform.OS === "web" ? { tabIndex: -1 as const } : {})}
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      {screenBody}
      {/* Rendered last so it stacks above scrolling content on Android; content
          scrolls beneath the translucent material for the glass effect. Only the
          header bar itself is measured for the content inset — the accessory
          floats over content below it. */}
      <View style={styles.headerFloat} pointerEvents="box-none">
        <AppHeader
          title={title}
          subtitle={subtitle}
          eyebrow={eyebrow}
          notificationCount={notificationCount}
          onNotificationsPress={onNotificationsPress}
          onBack={onBack}
          blurTargetRef={Platform.OS === "android" ? contentBlurTargetRef : undefined}
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        />
        {headerAccessory}
        {trackProgress && canScroll ? (
          <ReadingProgressBar
            progress={progress}
            accessibilityLabel={t("common.readingProgress")}
          />
        ) : null}
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
