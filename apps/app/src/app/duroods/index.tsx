import { DUROOD_ITEMS } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";

export default function DuroodsScreen() {
  const router = useRouter();

  return (
    <ScreenLayout
      eyebrow="Salawat"
      title="Duroods"
      subtitle="Sending blessings upon the Prophet ﷺ"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        {DUROOD_ITEMS.map((item) => (
          <View key={item.id} style={styles.item}>
            <ThemedText type="smallBold" style={styles.title}>
              {item.title}
            </ThemedText>
            <ReadingCard item={item} />
          </View>
        ))}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: Spacing.two,
  },
  title: {
    marginLeft: Spacing.one,
  },
});
