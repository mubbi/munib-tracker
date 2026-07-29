import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type PagerViewHandle = {
  setPage: (page: number) => void;
};

export type PagerViewSelectedEvent = { nativeEvent: { position: number } };

export type PagerViewProps = {
  style?: StyleProp<ViewStyle>;
  initialPage?: number;
  /** Android: pages kept alive on either side of the active page. */
  offscreenPageLimit?: number;
  onPageSelected?: (event: PagerViewSelectedEvent) => void;
  children?: ReactNode;
};
