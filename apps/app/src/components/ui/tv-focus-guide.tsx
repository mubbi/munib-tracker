import { type ComponentType, forwardRef, type ReactNode, type Ref } from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

type TvFocusGuideProps = ViewProps & {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  /**
   * Prefer this guide when the screen gains focus. Also restores the last focused
   * child on revisit (react-native-tvos focus memory).
   */
  autoFocus?: boolean;
  /** Explicit focus destinations (takes precedence over autoFocus). */
  destinations?: unknown[];
  trapFocusUp?: boolean;
  trapFocusDown?: boolean;
  trapFocusLeft?: boolean;
  trapFocusRight?: boolean;
};

type TvFocusGuideNativeProps = TvFocusGuideProps & { ref?: Ref<View> };

/**
 * Focus trap / destination guide for TV remotes. On phone/web this is a plain View.
 * Use around dense lists or side-rail + content so D-pad focus does not get stuck.
 */
export const TvFocusGuide = forwardRef<View, TvFocusGuideProps>(function TvFocusGuide(
  {
    children,
    style,
    autoFocus,
    destinations,
    trapFocusUp,
    trapFocusDown,
    trapFocusLeft,
    trapFocusRight,
    ...rest
  },
  ref,
) {
  if (!isTV()) {
    return (
      <View ref={ref} style={style} {...rest}>
        {children}
      </View>
    );
  }

  const RN = require("react-native") as {
    // react-native-tvos adds TVFocusGuideView; typed loosely so phone builds compile.
    TVFocusGuideView?: ComponentType<TvFocusGuideNativeProps>;
  };
  const Guide = (RN.TVFocusGuideView ?? View) as ComponentType<TvFocusGuideNativeProps>;
  return (
    <Guide
      ref={ref}
      style={style}
      autoFocus={autoFocus}
      destinations={destinations}
      trapFocusUp={trapFocusUp}
      trapFocusDown={trapFocusDown}
      trapFocusLeft={trapFocusLeft}
      trapFocusRight={trapFocusRight}
      {...rest}
    >
      {children}
    </Guide>
  );
});
