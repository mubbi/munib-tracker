import type { Ayah } from "@munib-tracker/shared/types";
import type { RefObject } from "react";
import { FlatList, type FlatListProps, StyleSheet, View } from "react-native";

import { Spacing } from "@/constants/theme";

/** Virtualized ayah list for the surah study reader (Level A ayah layout). */
export type SurahAyahListProps = Omit<FlatListProps<Ayah>, "ref"> & {
  listRef: RefObject<FlatList<Ayah> | null>;
};

export function SurahAyahList({
  listRef,
  contentContainerStyle,
  style,
  ...props
}: SurahAyahListProps) {
  return (
    <FlatList
      ref={listRef}
      style={[styles.list, style]}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      initialNumToRender={6}
      maxToRenderPerBatch={4}
      windowSize={5}
      updateCellsBatchingPeriod={100}
      removeClippedSubviews
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
  list: { flex: 1 },
  listContent: { paddingBottom: 0 },
  ayahSeparator: { height: Spacing.three },
});
