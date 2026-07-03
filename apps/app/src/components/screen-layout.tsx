import { useFocusEffect } from "expo-router";
import type { ReactNode, RefObject } from "react";
import { useCallback, useRef } from "react";
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

import { AppHeader } from "@/components/app-header";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
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
  const rootRef = useRef<View>(null);

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
    <View style={[styles.content, contentStyle]}>
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </View>
  );

  return (
    <View
      ref={rootRef}
      // Web-only: programmatically focusable screen landmark (tabIndex -1).
      {...(Platform.OS === "web" ? { tabIndex: -1 as const } : {})}
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      <AppHeader
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        notificationCount={notificationCount}
        onNotificationsPress={onNotificationsPress}
        onBack={onBack}
      />
      {scrollable ? (
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: BottomTabInset + Spacing.four,
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
});
