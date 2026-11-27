import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";

export interface EvidenceItem {
  /** i18n key holding the claim + its citation (e.g. "Write debts down — Qur'an 2:282"). */
  key: string;
  /** Qur'an refs open the reader at that ayah; hadith refs stay plain citations. */
  quran?: { surah: number; ayah: number };
}

/**
 * Evidence list for a feature (D11): every line is verified in the feature's
 * proof log. Scripture is never typed here — Qur'an refs deep-link to the
 * bundled corpus; hadith refs are citations (see `lib/reference-link.ts`).
 */
export function EvidenceCard({
  titleKey,
  items,
}: {
  titleKey: string;
  items: readonly EvidenceItem[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Card>
      <SectionHeader
        title={t(titleKey)}
        icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
      />
      <View style={styles.list}>
        {items.map((item) =>
          item.quran ? (
            <PressableScale
              key={item.key}
              accessibilityRole="link"
              accessibilityLabel={t(item.key)}
              onPress={() =>
                router.push(`/quran/${item.quran?.surah}?ayah=${item.quran?.ayah}` as Href)
              }
            >
              <ThemedText type="small" themeColor="accent">
                {t(item.key)}
              </ThemedText>
            </PressableScale>
          ) : (
            <ThemedText key={item.key} type="small" themeColor="mutedForeground">
              {t(item.key)}
            </ThemedText>
          ),
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, marginTop: Spacing.two },
});
