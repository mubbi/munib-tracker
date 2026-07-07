import { forwardRef, useImperativeHandle, useRef } from "react";
import RNPagerView from "react-native-pager-view";

import type { PagerViewHandle, PagerViewProps } from "./pager-view-types";

/**
 * Thin wrapper around `react-native-pager-view` so the Qur'an page reader can
 * depend on a stable local interface. The `.web` variant supplies a bundle-safe
 * implementation (the native package imports RN internals unsupported on web).
 */
const PagerView = forwardRef<PagerViewHandle, PagerViewProps>((props, ref) => {
  const inner = useRef<RNPagerView>(null);
  useImperativeHandle(
    ref,
    () => ({
      setPage: (page: number) => inner.current?.setPage(page),
    }),
    [],
  );
  return <RNPagerView ref={inner} {...props} />;
});

PagerView.displayName = "PagerView";

export default PagerView;
export type { PagerViewHandle, PagerViewProps } from "./pager-view-types";
