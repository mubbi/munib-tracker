/**
 * Metro resolves `react-native-pager-view` here when `EXPO_TV=1`.
 * The native Fabric view is not linked on Apple TV / Leanback.
 */
import { Children, forwardRef, useImperativeHandle, useState } from "react";
import { View, type ViewProps } from "react-native";

type SelectedEvent = { nativeEvent: { position: number } };

type Props = ViewProps & {
  initialPage?: number;
  onPageSelected?: (event: SelectedEvent) => void;
  children?: React.ReactNode;
};

export type PagerViewRef = {
  setPage: (index: number) => void;
  setPageWithoutAnimation: (index: number) => void;
};

const PagerView = forwardRef<PagerViewRef, Props>(
  ({ style, initialPage = 0, onPageSelected, children, ...rest }, ref) => {
    const pages = Children.toArray(children);
    const [index, setIndex] = useState(initialPage);

    useImperativeHandle(ref, () => ({
      setPage(next) {
        const clamped = Math.max(0, Math.min(pages.length - 1, next));
        setIndex(clamped);
        onPageSelected?.({ nativeEvent: { position: clamped } });
      },
      setPageWithoutAnimation(next) {
        const clamped = Math.max(0, Math.min(pages.length - 1, next));
        setIndex(clamped);
        onPageSelected?.({ nativeEvent: { position: clamped } });
      },
    }));

    return (
      <View style={style} {...rest}>
        {pages[index] ?? null}
      </View>
    );
  },
);

PagerView.displayName = "PagerView";

export default PagerView;
