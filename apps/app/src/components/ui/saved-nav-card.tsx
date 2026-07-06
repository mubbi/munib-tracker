import type { SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";

type SavedNavCardProps = {
  title: string;
  viewLabel: string;
  count?: number;
  onPress: () => void;
  headerIcon: SymbolViewProps["name"];
  rowIcon: SymbolViewProps["name"];
};

export function SavedNavCard({
  title,
  viewLabel,
  count,
  onPress,
  headerIcon,
  rowIcon,
}: SavedNavCardProps) {
  return (
    <Card padding="three">
      <SectionHeader title={title} icon={headerIcon} />
      <View style={styles.list}>
        <NavRow icon={rowIcon} label={viewLabel} count={count} onPress={onPress} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, marginTop: Spacing.three },
});
