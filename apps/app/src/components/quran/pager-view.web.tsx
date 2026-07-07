import { Children, forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";

import type { PagerViewHandle, PagerViewProps } from "./pager-view-types";

/**
 * Web-safe stand-in for `react-native-pager-view`, which has no web build and
 * imports React Native native internals (breaks the web bundle). Only the
 * active page is mounted; navigation is driven imperatively via `setPage`
 * (the reader's footer arrows and page picker), keeping the ~600-page Qur'an
 * reader light on web.
 */
const PagerView = forwardRef<PagerViewHandle, PagerViewProps>(
  ({ style, initialPage = 0, onPageSelected, children }, ref) => {
    const pages = Children.toArray(children);
    const [index, setIndex] = useState(initialPage);

    useImperativeHandle(
      ref,
      () => ({
        setPage: (page: number) => {
          const clamped = Math.max(0, Math.min(page, Math.max(0, pages.length - 1)));
          setIndex(clamped);
          onPageSelected?.({ nativeEvent: { position: clamped } });
        },
      }),
      [onPageSelected, pages.length],
    );

    const safeIndex = Math.max(0, Math.min(index, Math.max(0, pages.length - 1)));

    return <View style={[styles.container, style]}>{pages[safeIndex] ?? null}</View>;
  },
);

PagerView.displayName = "PagerView";

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default PagerView;
export type { PagerViewHandle, PagerViewProps } from "./pager-view-types";
