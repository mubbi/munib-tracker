import { forwardRef, type ReactElement, type Ref } from "react";
import { FlatList, type FlatListProps } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

type TvFlatListProps<ItemT> = FlatListProps<ItemT>;

/**
 * FlatList that does not become a TV focus target.
 *
 * Same rationale as {@link TvScrollView}: list chrome must not steal D-pad /
 * Select from row Pressables. Rows stay focusable; the list scrolls to them.
 */
function TvFlatListInner<ItemT>(
  { focusable, ...rest }: TvFlatListProps<ItemT>,
  ref: Ref<FlatList<ItemT>>,
) {
  const tv = isTV();
  return <FlatList ref={ref} focusable={focusable ?? !tv} {...rest} />;
}

export const TvFlatList = forwardRef(TvFlatListInner) as <ItemT>(
  props: TvFlatListProps<ItemT> & { ref?: Ref<FlatList<ItemT>> },
) => ReactElement | null;
