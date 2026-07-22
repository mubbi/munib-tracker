import type { ReactNode } from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

type TVFocusGuideViewComponent = typeof View & {
  // react-native-tvos adds TVFocusGuideView; typed loosely so phone builds compile.
};

/**
 * Focus trap / destination guide for TV remotes. On phone/web this is a plain View.
 * Use around dense lists or side-rail + content so D-pad focus does not get stuck.
 */
export function TvFocusGuide({
  children,
  style,
  ...rest
}: ViewProps & { children?: ReactNode; style?: ViewStyle | ViewStyle[] }) {
  if (!isTV()) {
    return (
      <View style={style} {...rest}>
        {children}
      </View>
    );
  }

  const RN = require("react-native") as {
    TVFocusGuideView?: TVFocusGuideViewComponent;
  };
  const Guide = RN.TVFocusGuideView ?? View;
  return (
    <Guide style={style} {...rest}>
      {children}
    </Guide>
  );
}
