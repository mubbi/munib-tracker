import type { ContentReportKind } from "@munib-tracker/shared/types/content-report";
import { BlurTargetView } from "expo-blur";
import { NavigationBar } from "expo-navigation-bar";
import { useFocusEffect, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import type { ReactNode, RefObject } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  type ScrollViewInstance,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewInstance,
  type ViewStyle,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { AppHeader } from "@/components/app-header";
import { ContentReportFooterLink } from "@/components/content-report/content-report-footer-link";
import { ErrorBoundary } from "@/components/error-boundary";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { BorderWidth, Breakpoints, MaxContentWidth, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useContentBottomInset, useObstructedBottomInset } from "@/hooks/use-content-bottom-inset";
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover";
import { useReadingFullscreen } from "@/hooks/use-reading-fullscreen";
import { useTheme } from "@/hooks/use-theme";
import { buildContentReportRef } from "@/lib/content-report-ref";
import { LEARN_SECTION_ROUTES } from "@/lib/library-menu";
import { isTV } from "@/lib/platform/is-tv";
import { horizontalSafeAreaPadding } from "@/lib/rtl";

/** Wider cap used on large viewports so content isn't a narrow single column. */
const WideMaxContentWidth = 1120;
/** Desktop (>= `Breakpoints.xwide`): grids and list–detail screens can use more of the canvas. */
const XWideMaxContentWidth = 1320;
/**
 * The one reading measure: Learn / article prose on wide screens, ~75–85
 * characters per line at body size. Screens that add a side panel (TOC /
 * related) pass their own `maxContentWidth`; other prose screens use this too.
 */
export const READING_MEASURE = 880;

/** What a screen's chrome offers to content that takes over the whole screen. */
export interface ScreenChrome {
  title: string;
  onBack?: () => void;
  /**
   * Measured height of the floating header overlay (title bar + any revealed
   * `headerAccessory`), or 0 before the first layout. Content scrolls beneath
   * it, so sticky elements must offset by at least this much.
   */
  headerHeight: number;
}

const ScreenChromeContext = createContext<ScreenChrome | null>(null);

/**
 * The enclosing `ScreenLayout`'s title and back action, for full-screen
 * surfaces rendered from inside a screen (e.g. the tasbeeh Focus / Night
 * surface) so their back control behaves exactly like the header's.
 */
export function useScreenChrome(): ScreenChrome | null {
  return useContext(ScreenChromeContext);
}

/**
 * `top` for a web `position: sticky` element inside a `ScreenLayout` scroller:
 * clears the floating header overlay (incl. a revealed `headerAccessory`
 * toolbar) plus a small gap. Falls back to `fallback` before the header has
 * been measured or outside a `ScreenLayout`.
 */
export function useStickyHeaderOffset(fallback: number): number {
  const headerHeight = useContext(ScreenChromeContext)?.headerHeight ?? 0;
  return headerHeight > 0 ? headerHeight + Spacing.three : fallback;
}

type ScreenLayoutProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onBack?: () => void;
  /** Header trailing actions (at most two `IconButton`s) — see `AppHeader`. */
  trailing?: ReactNode;
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
  /**
   * Override the content column max width (e.g. list–detail panes that need more
   * horizontal room than the default single-column cap).
   */
  maxContentWidth?: number;
  /** Ref to the internal ScrollView (e.g. to auto-scroll to a playing card). */
  scrollRef?: RefObject<ScrollViewInstance | null>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Show a thin scroll-progress line beneath the header for long-form reading
   * screens. Only applies to the built-in scroller (`scrollable`) and only once
   * the content actually overflows the viewport. Defaults to on for routes in
   * Opt-in: pass `true` from article / long-form templates only — hubs, quizzes
   * and flash cards do not show it.
   */
  readingProgress?: boolean;
  /**
   * When set, appends a "report an issue" link at the end of the content so
   * readers can flag mistakes in long-form material. The report reference is
   * derived from the current route, `title`, and `subtitle`.
   */
  reportKind?: ContentReportKind;
  /**
   * Persistent actions for the screen (wizard Back / Next, a form's Save). On
   * phones and tablets it is pinned to the bottom edge — above the keyboard,
   * the home indicator, tab bar and mini-player — while the body scrolls. On
   * wide web (≥ `Breakpoints.wide`) and TV it follows the content inline, where
   * a pinned bar would sit far from the fields (and D-pad focus flows to it).
   */
  footer?: ReactNode;
};

export function ScreenLayout({
  title,
  subtitle,
  eyebrow,
  notificationCount,
  onNotificationsPress,
  onBack,
  trailing,
  scrollable = true,
  children,
  headerAccessory,
  contentStyle,
  maxContentWidth,
  scrollRef,
  onScroll,
  readingProgress,
  reportKind,
  footer,
}: ScreenLayoutProps) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const insets = useAppSafeAreaInsets();
  const contentBottomInset = useContentBottomInset();
  const obstructedBottomInset = useObstructedBottomInset();
  const { active: fullscreenActive } = useReadingFullscreen();
  const rootRef = useRef<ViewInstance>(null);
  const contentBlurTargetRef = useRef<ViewInstance>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  // Hide the title bar in reading fullscreen so the surface grows; keep any
  // headerAccessory (e.g. Qur'an toolbar) for exit + reading controls.
  const showAppHeader = !fullscreenActive;

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
  const trackProgress = readingProgress === true && scrollable;
  // Desktop web with a mouse: keep a visible scroll affordance (overlay scrollbars
  // are not guaranteed, and the page scroller is otherwise invisible).
  const finePointer = useFinePointerHover();

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
  // bar so content isn't cramped directly against it. In fullscreen the title
  // bar is gone — fall back to safe-area only when nothing has measured yet.
  const headerFallback = showAppHeader ? insets.top + 60 : insets.top;
  const headerInset = (headerHeight || headerFallback) + Spacing.three;

  // On web, move focus into the incoming screen so it isn't left on a button in
  // the outgoing screen when React Navigation marks that layer aria-hidden.
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "web") return;
      const node = rootRef.current as unknown as { focus?: () => void } | null;
      node?.focus?.();
    }, []),
  );

  const tv = isTV();
  const hasFooter = footer != null && footer !== false;
  /** Pinned footer bar (phones / tablets); inline after the content otherwise. */
  const footerPinned = hasFooter && !tv && width < Breakpoints.wide;
  const footerInline = hasFooter && !footerPinned;
  const chrome = useMemo<ScreenChrome>(
    () => ({ title, onBack, headerHeight }),
    [title, onBack, headerHeight],
  );

  // Phone/web: cap the column so it doesn't stretch into a sparse strip.
  // TV: fill the tab pane (minus overscan padding on the content wrapper).
  // Learn prose stays narrower on TV so long articles remain readable from
  // the couch — list–detail screens pass an explicit maxContentWidth instead.
  const maxWidth =
    maxContentWidth ??
    (tv
      ? isLearnRoute
        ? TvLayout.proseMaxWidth
        : undefined
      : width >= Breakpoints.wide
        ? isLearnRoute
          ? READING_MEASURE
          : width >= Breakpoints.xwide
            ? XWideMaxContentWidth
            : WideMaxContentWidth
        : MaxContentWidth);

  const content = (
    <View
      // Web-only landmark: exposes the screen body as <main> for crawlers/AT.
      // One per screen — the app shell must not add a second `main`.
      {...(Platform.OS === "web" ? { role: "main" as const } : {})}
      // When the screen owns its own scroller (scrollable={false}), it isn't
      // wrapped in the ScrollView that carries the header inset, so pad it here
      // to clear the floating glass header.
      style={[
        styles.content,
        !scrollable && styles.contentFill,
        tv && {
          paddingHorizontal: TvLayout.contentPaddingX,
          // Default content centers children; on TV that leaves a dead strip beside
          // list–detail rows. Stretch so panes can use the full pane width.
          alignItems: "stretch",
        },
        // Non-scrollable screens need the header inset; scrollable ones get it
        // on the ScrollView contentContainerStyle instead.
        !scrollable ? { paddingTop: headerInset } : { paddingTop: Spacing.one },
        tv && scrollable ? { paddingTop: Spacing.two } : null,
        contentStyle,
      ]}
    >
      {/* When the screen owns its own scroller (scrollable={false}, e.g. a screen
          hosting a FlatList), the inner wrapper must fill the available height so
          the child list is bounded and can scroll — otherwise it grows to its full
          content height and nothing scrolls. */}
      <View style={[styles.inner, !scrollable && styles.innerFill, { maxWidth }]}>
        {scrollable ? (
          <>
            <ErrorBoundary>{children}</ErrorBoundary>
            {footerInline ? <View style={styles.footerInline}>{footer}</View> : null}
            {reportRef ? <ContentReportFooterLink contentRef={reportRef} /> : null}
          </>
        ) : (
          // Host FlatLists in an explicit flex fill — TVFocusGuideView / BlurTarget
          // ancestors otherwise leave Card+list children with a zero-height viewport
          // (search chrome visible, rows blank) on Android TV.
          <>
            <View style={styles.scrollerHost}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </View>
            {footerInline ? <View style={styles.footerInline}>{footer}</View> : null}
          </>
        )}
      </View>
    </View>
  );

  const scrollBody = scrollable ? (
    <TvScrollView
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
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[
        styles.scrollContent,
        // A pinned footer already clears the bottom chrome.
        {
          paddingTop: headerInset,
          paddingBottom: footerPinned ? Spacing.four : contentBottomInset,
        },
      ]}
      // The floating glass header already accounts for the top inset; opting
      // out keeps the OS from adding it again and double-padding the content.
      contentInsetAdjustmentBehavior="never"
      showsVerticalScrollIndicator={Platform.OS === "web" && finePointer}
    >
      {content}
    </TvScrollView>
  ) : (
    content
  );

  const footerBar = footerPinned ? (
    <View
      style={[
        styles.footerBar,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(obstructedBottomInset, Spacing.two) + Spacing.two,
        },
      ]}
    >
      <View style={[styles.footerColumn, { maxWidth }]}>{footer}</View>
    </View>
  ) : null;

  // The pinned footer sits under the scroller in the same keyboard-avoiding
  // column, so it rides above the on-screen keyboard.
  const bodyWithFooter = footerBar ? (
    <View style={styles.root}>
      {scrollBody}
      {footerBar}
    </View>
  ) : (
    scrollBody
  );
  const avoidKeyboard = scrollable || footerPinned;

  const screenBody =
    Platform.OS === "android" && !tv ? (
      <BlurTargetView ref={contentBlurTargetRef} style={styles.blurTarget}>
        {avoidKeyboard ? (
          <KeyboardAvoidingView
            style={styles.root}
            behavior="padding"
            keyboardVerticalOffset={insets.top}
          >
            {bodyWithFooter}
          </KeyboardAvoidingView>
        ) : (
          bodyWithFooter
        )}
      </BlurTargetView>
    ) : avoidKeyboard ? (
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
        // Keep the ScrollView reachable via the first-subview chain so iOS 26
        // tab-bar minimize-on-scroll can find it (view flattening breaks it).
        collapsable={false}
      >
        {bodyWithFooter}
      </KeyboardAvoidingView>
    ) : (
      bodyWithFooter
    );

  return (
    <ScreenChromeContext.Provider value={chrome}>
      <View
        ref={rootRef}
        // Web-only: programmatically focusable screen landmark (tabIndex -1).
        {...(Platform.OS === "web" ? { tabIndex: -1 as const } : {})}
        // iOS 26 tab-bar minimize-on-scroll: UIKit walks first subviews from the
        // tab screen root to find the content scroll view — don't flatten.
        collapsable={false}
        // Left/right safe area: iOS 27 vertical system rail (iPhone Duo) and notches.
        style={[
          styles.root,
          { backgroundColor: colors.background },
          tv ? null : horizontalSafeAreaPadding(insets),
        ]}
      >
        {/* Native immersive reading: hide status bar (iOS HIG / Android immersive).
          Android also hides the nav bar; expo-navigation-bar uses transient
          swipe-to-reveal (BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE). */}
        {Platform.OS !== "web" && !tv ? (
          <StatusBar
            hidden={fullscreenActive}
            hideTransitionAnimation="fade"
            // iOS 27: immersive reading keeps the system bars out of the side rail so
            // the page gets the full window width (iPhone Duo).
            verticalBarBehaviorIOS={fullscreenActive ? "disabled" : "automatic"}
          />
        ) : null}
        {Platform.OS === "android" && !tv ? <NavigationBar hidden={fullscreenActive} /> : null}
        {tv ? (
          <TvFocusGuide style={styles.focusGuide} autoFocus>
            {screenBody}
          </TvFocusGuide>
        ) : (
          screenBody
        )}
        {/* Rendered last so it stacks above scrolling content on Android; content
          scrolls beneath the translucent material for the glass effect. Only the
          header bar itself is measured for the content inset — the accessory
          floats over content below it. */}
        <View
          style={[
            styles.headerFloat,
            // Immersive: AppHeader (which owns the top safe-area pad) is gone — keep
            // the floating reading toolbar clear of the notch / camera cutout.
            !showAppHeader && headerAccessory ? { paddingTop: insets.top } : null,
          ]}
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          {showAppHeader ? (
            <AppHeader
              title={title}
              subtitle={subtitle}
              eyebrow={eyebrow}
              notificationCount={notificationCount}
              onNotificationsPress={onNotificationsPress}
              onBack={onBack}
              trailing={trailing}
              blurTargetRef={Platform.OS === "android" && !tv ? contentBlurTargetRef : undefined}
              contentMaxWidth={maxWidth}
            />
          ) : null}
          {headerAccessory}
          {trackProgress && canScroll ? (
            <ReadingProgressBar
              progress={progress}
              accessibilityLabel={t("common.readingProgress")}
            />
          ) : null}
        </View>
      </View>
    </ScreenChromeContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  blurTarget: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
  /** TVFocusGuideView must participate in the flex height chain on Leanback. */
  focusGuide: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
  headerFloat: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "box-none",
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
  contentFill: {
    minHeight: 0,
  },
  inner: {
    width: "100%",
    gap: Spacing.four,
  },
  /**
   * Fill the available height when the screen hosts its own scroller (FlatList /
   * pager). No gap — overlay siblings (Modal sheets) still sit in this tree and
   * would otherwise invent empty space under the main chrome.
   */
  innerFill: {
    flex: 1,
    minHeight: 0,
    gap: 0,
  },
  /** Pinned action bar under the scroller (phones / tablets). */
  footerBar: {
    alignItems: "center",
    borderTopWidth: BorderWidth.hairline,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  footerColumn: {
    width: "100%",
  },
  footerInline: {
    width: "100%",
    paddingTop: Spacing.two,
  },
  /** Bounded host so nested Card + FlatList flex:1 children get a real viewport. */
  scrollerHost: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
});
