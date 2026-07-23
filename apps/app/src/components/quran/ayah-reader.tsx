import type { Ayah } from "@munib-tracker/shared/types";
import type { RefObject } from "react";
import { type FlatList, type FlatListProps, StyleSheet, View } from "react-native";
import { TvFlatList } from "@/components/ui/tv-flat-list";

import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";

/** Virtualized ayah list for the surah study reader (Level A ayah layout). */
export type SurahAyahListProps = Omit<FlatListProps<Ayah>, "ref"> & {
  listRef: RefObject<FlatList<Ayah> | null>;
};

export function SurahAyahList({
  listRef,
  contentContainerStyle,
  style,
  removeClippedSubviews,
  ...props
}: SurahAyahListProps) {
  const tv = isTV();
  return (
    <TvFlatList
      ref={listRef}
      style={[styles.list, style]}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      initialNumToRender={tv ? 12 : 6}
      maxToRenderPerBatch={tv ? 8 : 4}
      windowSize={tv ? 7 : 5}
      updateCellsBatchingPeriod={100}
      // Android TV: clipping + zero-height flex hosts leave a blank body while
      // the floating header (sibling) still paints.
      removeClippedSubviews={removeClippedSubviews ?? !tv}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      {...props}
    />
  );
}

/** Stable FlatList key for an ayah row (ayah numbers are unique within a surah). */
export function ayahKeyExtractor(ayah: Ayah): string {
  return String(ayah.ayah);
}

export function AyahSeparator() {
  return <View style={styles.ayahSeparator} />;
}

const styles = StyleSheet.create({
  list: { flex: 1, minHeight: 0 },
  listContent: { paddingBottom: 0 },
  ayahSeparator: { height: Spacing.three },
});
